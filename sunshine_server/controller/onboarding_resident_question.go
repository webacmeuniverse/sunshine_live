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

type OnboardingResidentStepQuestion struct {
	st      stores.Store
	country models.Country
}

func NewOnboardingResidentStepQuestion(env *services.Env) *OnboardingResidentStepQuestion {
	return &OnboardingResidentStepQuestion{
		st:      env.OnboardingResidentStepQuestionStore,
		country: "Latvia",
	}
}

func (orsq *OnboardingResidentStepQuestion) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var onboardingResidentStepQuiz models.ResidentStepQuestion

	if err := json.NewDecoder(rc).Decode(&onboardingResidentStepQuiz); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	if !Can(ctx, CreateOnboardResQuiz, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}

	if _, err := orsq.st.GetByIndex(ctx, fmt.Sprint(onboardingResidentStepQuiz.Index)); err == nil {
		return nil, fmt.Errorf("%w: Index", ErrDuplicate)
	}

	doc, err := orsq.st.Create(ctx, sanitizeEntityFields(&onboardingResidentStepQuiz))
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func (orsq *OnboardingResidentStepQuestion) Get(ctx context.Context, orsqID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	_, err := orsq.st.Get(ctx, orsqID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, GetOnboardResQuizBUp, orsqID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	doc, deps, errU := orsq.st.Unwrap(ctx, orsqID)

	return doc, deps, errU
}

func (orsq *OnboardingResidentStepQuestion) Update(ctx context.Context, quizID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}

	doc, err := orsq.st.Get(ctx, quizID)
	if err != nil {
		return nil, nil, ErrNotFound
	}

	if !Can(ctx, UpdateOnboardResQuiz, quizID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}

	new := *doc.Data.(*models.ResidentStepQuestion)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	doc.Data = &new

	_, err = orsq.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}

	result, deps, err := orsq.st.Unwrap(ctx, quizID)

	return result, deps, err
}

func (orsq *OnboardingResidentStepQuestion) List(ctx context.Context, filter stores.Filter, rc io.ReadCloser) ([]models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		onboardingResidentStepQuestions []models.ResidentStepQuestion
		getRequest                      FieldGetRequest
		_docs                           []models.Document
	)
	if err := json.NewDecoder(rc).Decode(&getRequest); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, ListOnboardResQuiz, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	if err := orsq.st.DB().Order("created_at ASC").Where("step_id = ?", getRequest.StepID).Where("lang = ?", getRequest.Lang).Find(&onboardingResidentStepQuestions).Error; err != nil {
		return nil, err
	}
	docs, err := orsq.MakeDocs(onboardingResidentStepQuestions, _docs)

	if err != nil {
		return nil, err
	}

	return docs, nil
}

func (orsq *OnboardingResidentStepQuestion) ListDefaults(allLangs bool, stepID uuid.UUID, menuType, lang string) ([]models.ResidentStepQuestion, error) {
	var questions []models.ResidentStepQuestion
	if allLangs {
		if err := orsq.st.DB().Order("created_at ASC").Where("is_default_template = '1'").Where("step_id = ?", stepID).Find(&questions).Error; err != nil {
			return nil, err
		}
		return questions, nil
	}
	if err := orsq.st.DB().Order("created_at ASC").Where("is_default_template = '1'").Where("step_id = ?", stepID).Where("lang = ?", lang).Find(&questions).Error; err != nil {
		return nil, err
	}
	return questions, nil
}

func (orsq *OnboardingResidentStepQuestion) MakeDocs(questions []models.ResidentStepQuestion, docs []models.Document) ([]models.Document, error) {

	for _, quiz := range questions {
		doc, err := orsq.AddStepQuestionFields(quiz)
		if err != nil {
			return nil, err
		}
		docs = append(docs, doc)
	}
	return docs, nil

}

// AddStepQuestionFields nested objects to document
func (orsq *OnboardingResidentStepQuestion) AddStepQuestionFields(question models.ResidentStepQuestion) (models.Document, error) {
	var _doc models.Document
	var stepQuestionFields []models.OnboardingResidentStepField

	if err := orsq.st.DB().Order("created_at ASC").Where("question_id = ?", question.ID).Find(&stepQuestionFields).Error; err != nil {
		return _doc, err
	}
	for _, field := range stepQuestionFields {
		if err := orsq.AddStepFieldOptions(&field); err != nil {
			return _doc, err
		}
	}
	question.StepFields = stepQuestionFields

	doc := models.Document{
		ID:        question.ID,
		Kind:      question.Kind(),
		Data:      question,
		Timestamp: question.UpdatedAt,
	}
	return doc, nil
}

// AddStepFieldOptions nested objects to document
func (orsq *OnboardingResidentStepQuestion) AddStepFieldOptions(stepField *models.OnboardingResidentStepField) error {
	var stepFieldOptions []models.StepFieldOption

	if err := orsq.st.DB().Order("created_at ASC").Where("step_field_id = ?", stepField.ID).Find(&stepFieldOptions).Error; err != nil {
		return err
	}
	stepField.Options = stepFieldOptions
	return nil
}

func (orsq *OnboardingResidentStepQuestion) NextIndex(ctx context.Context, filter stores.Filter, rc io.ReadCloser) (*int, error) {
	docs, err := orsq.List(ctx, filter, rc)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (orsq *OnboardingResidentStepQuestion) DeleteResidentStepQuestion(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}

	doc, err := orsq.st.Get(ctx, uid)
	if err != nil {
		return err
	}
	if !Can(ctx, DeleteOnboardResQuiz, uid, cv.User.Country) {
		return ErrUnauthorized
	}

	return orsq.st.Delete(ctx, doc)
}

func (orsq *OnboardingResidentStepQuestion) FetchResidentStepQuestion(ctx context.Context, ids []uuid.UUID) ([]models.ResidentStepQuestion, error) {
	var result []models.ResidentStepQuestion
	return result, orsq.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
