package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"io"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/google/uuid"
)

type OnboardingHousingStepQuestion struct {
	st      stores.Store
	country models.Country
}

func NewOnboardingHousingStepQuestion(env *services.Env) *OnboardingHousingStepQuestion {
	return &OnboardingHousingStepQuestion{
		st:      env.OnboardingHousingStepQuestionStore,
		country: "Latvia",
	}
}

func (ohsq *OnboardingHousingStepQuestion) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var onboardingHousingStepQuiz models.HousingStepQuestion

	if err := json.NewDecoder(rc).Decode(&onboardingHousingStepQuiz); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	if !Can(ctx, CreateOnboardHseQuiz, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}

	if _, err := ohsq.st.GetByIndex(ctx, fmt.Sprint(onboardingHousingStepQuiz.Index)); err == nil {
		return nil, fmt.Errorf("%w: Index", ErrDuplicate)
	}

	doc, err := ohsq.st.Create(ctx, sanitizeEntityFields(&onboardingHousingStepQuiz))
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func (ohsq *OnboardingHousingStepQuestion) Get(ctx context.Context, orsqID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	_, err := ohsq.st.Get(ctx, orsqID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, GetOnboardHseQuiz, orsqID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	doc, deps, errU := ohsq.st.Unwrap(ctx, orsqID)
	return doc, deps, errU
}

func (ohsq *OnboardingHousingStepQuestion) Update(ctx context.Context, quizID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}

	doc, err := ohsq.st.Get(ctx, quizID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateOnboardHseQuiz, quizID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}

	new := *doc.Data.(*models.HousingStepQuestion)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	doc.Data = &new

	_, err = ohsq.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}

	result, deps, err := ohsq.st.Unwrap(ctx, quizID)

	return result, deps, err
}

func (ohsq *OnboardingHousingStepQuestion) List(ctx context.Context, filter stores.Filter, rc io.ReadCloser) ([]models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		onboardingHousingStepQuestions []models.HousingStepQuestion
		getRequest                     MenuGetRequest
		_docs                          []models.Document
	)
	if err := json.NewDecoder(rc).Decode(&getRequest); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, ListOnboardHseQuiz, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	if err := ohsq.st.DB().Order("created_at ASC").Where("menu_type = ?", getRequest.MenuType).Where("oss_admin_id = ?", getRequest.OssAdminID).Where("lang = ?", getRequest.Lang).Find(&onboardingHousingStepQuestions).Error; err != nil {
		return nil, err
	}
	docs, err := ohsq.MakeDocs(onboardingHousingStepQuestions, _docs)
	if err != nil {
		return nil, err
	}
	return docs, nil
}

func (ohsq *OnboardingHousingStepQuestion) MakeDocs(questions []models.HousingStepQuestion, docs []models.Document) ([]models.Document, error) {

	for _, quiz := range questions {
		doc, err := ohsq.AddStepQuestionFields(&quiz)
		if err != nil {
			return nil, err
		}
		docs = append(docs, doc)
	}
	return docs, nil

}

// AddStepQuestionFields nested objects to document
func (ohsq *OnboardingHousingStepQuestion) AddStepQuestionFields(question *models.HousingStepQuestion) (models.Document, error) {
	var _doc models.Document
	var stepQuestionFields []models.OnboardingHousingStepField

	if err := ohsq.st.DB().Order("created_at ASC").Where("question_id = ?", question.ID).Find(&stepQuestionFields).Error; err != nil {
		return _doc, err
	}
	for _, field := range stepQuestionFields {
		if err := ohsq.AddStepFieldOptions(&field); err != nil {
			return _doc, err
		}
	}
	question.QuestionFields = stepQuestionFields

	doc := models.Document{
		ID:        question.ID,
		Kind:      question.Kind(),
		Data:      question,
		Timestamp: question.UpdatedAt,
	}
	return doc, nil
}

// AddStepFieldOptions nested objects to document
func (ohsq *OnboardingHousingStepQuestion) AddStepFieldOptions(stepField *models.OnboardingHousingStepField) error {
	var stepFieldOptions []models.StepFieldOption

	if err := ohsq.st.DB().Order("created_at ASC").Where("step_field_id = ?", stepField.ID).Find(&stepFieldOptions).Error; err != nil {
		return err
	}
	stepField.Options = stepFieldOptions
	return nil
}

func (ohsq *OnboardingHousingStepQuestion) NextIndex(ctx context.Context, filter stores.Filter, rc io.ReadCloser) (*int, error) {
	docs, err := ohsq.List(ctx, filter, rc)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (ohsq *OnboardingHousingStepQuestion) DeleteHousingStepQuestion(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	doc, err := ohsq.st.Get(ctx, uid)
	if err != nil {
		return ErrNotFound
	}
	if !Can(ctx, DeleteOnboardHseQuiz, uid, ohsq.country) {
		return ErrUnauthorized
	}
	return ohsq.st.Delete(ctx, doc)
}

func (ohsq *OnboardingHousingStepQuestion) FetchHousingStepQuestion(ctx context.Context, ids []uuid.UUID) ([]models.HousingStepQuestion, error) {
	var result []models.HousingStepQuestion
	return result, ohsq.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
