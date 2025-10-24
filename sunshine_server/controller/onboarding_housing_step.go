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

type OnboardingHousingStep struct {
	st      stores.Store
	country models.Country
}

func NewOnboardingHousingStep(env *services.Env) *OnboardingHousingStep {
	return &OnboardingHousingStep{
		st:      env.OnboardingHousingStepStore,
		country: "Latvia",
	}
}

func (ohs *OnboardingHousingStep) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var onboardingHousingStep models.OnboardingHousingStep

	if err := json.NewDecoder(rc).Decode(&onboardingHousingStep); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateOnboardHseQuiz, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	if _, err := ohs.st.GetByIndex(ctx, fmt.Sprint(onboardingHousingStep.Index)); err == nil {
		return nil, fmt.Errorf("%w: Index", ErrDuplicate)
	}

	doc, err := ohs.st.Create(ctx, sanitizeEntityFields(&onboardingHousingStep))
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func (ohs *OnboardingHousingStep) Get(ctx context.Context, ohsID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	var (
		step models.OnboardingHousingStep
		deps stores.Dependencies
	)
	if !Can(ctx, GetOnboardHseQuiz, ohsID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	if err := ohs.st.DB().Where("id = ?", ohsID).First(&step).Error; err != nil {
		return nil, nil, ErrNotFound
	}
	for i, quiz := range step.Questions {
		fields, errF := ohs.QuestionFieldsList(quiz)
		if errF != nil {
			return nil, nil, errF
		}
		quiz.QuestionFields = fields
		step.Questions[i] = quiz
	}
	doc := models.Document{
		ID:        step.ID,
		Kind:      step.Kind(),
		Data:      step,
		Timestamp: step.UpdatedAt,
	}

	return &doc, deps, nil
}

func (ohs *OnboardingHousingStep) Update(ctx context.Context, housingStepID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}

	doc, err := ohs.st.Get(ctx, housingStepID)
	if err != nil {
		return nil, nil, ErrNotFound
	}

	if !Can(ctx, UpdateOnboardHseStep, housingStepID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}

	new := *doc.Data.(*models.OnboardingHousingStep)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	doc.Data = &new

	_, errU := ohs.st.Update(ctx, sanitizeInputFields(doc))
	if errU != nil {
		return nil, nil, errU
	}

	result, deps, err := ohs.st.Unwrap(ctx, housingStepID)

	return result, deps, err
}

func (ohs *OnboardingHousingStep) List(ctx context.Context, filter stores.Filter, rc io.ReadCloser) ([]models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		docs                   []models.Document
		onboardingHousingSteps []models.OnboardingHousingStep
		getRequest             MenuGetRequest
	)
	if err := json.NewDecoder(rc).Decode(&getRequest); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, ListOnboardHseQuiz, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	if err := ohs.st.DB().Order("created_at ASC").Where("menu_type = ?", getRequest.MenuType).Where("oss_admin_id = ?", getRequest.OssAdminID).Where("lang = ?", getRequest.Lang).Find(&onboardingHousingSteps).Error; err != nil {
		return nil, err
	}

	docs, err1 := ohs.MakeDocs(onboardingHousingSteps)

	if err1 != nil {
		return nil, err1
	}

	return docs, nil
}

func (ohs *OnboardingHousingStep) MakeDocs(steps []models.OnboardingHousingStep) ([]models.Document, error) {
	var docs []models.Document

	for _, step := range steps {
		doc, err := ohs.StepQuestionsList(step)
		if err != nil {
			return nil, err
		}
		docs = append(docs, doc)
	}
	return docs, nil

}

func (ohs *OnboardingHousingStep) StepQuestionsList(step models.OnboardingHousingStep) (models.Document, error) {

	var _doc models.Document
	var questions []models.HousingStepQuestion
	if err := ohs.st.DB().Order("created_at ASC").Where("step_id = ?", step.ID).Find(&questions).Error; err != nil {
		return _doc, err
	}
	for i, quiz := range questions {
		fields, err := ohs.QuestionFieldsList(quiz)
		if err != nil {
			return _doc, err
		}
		questions[i].QuestionFields = fields
	}
	step.Questions = questions

	doc := models.Document{
		ID:        step.ID,
		Kind:      step.Kind(),
		Data:      step,
		Timestamp: step.UpdatedAt,
	}

	return doc, nil
}

func (ohs *OnboardingHousingStep) QuestionFieldsList(quiz models.HousingStepQuestion) ([]models.OnboardingHousingStepField, error) {
	var quizFields []models.OnboardingHousingStepField
	if err := ohs.st.DB().Order("created_at ASC").Where("question_id = ?", quiz.ID).Find(&quizFields).Error; err != nil {
		return quizFields, err
	}
	for i, field := range quizFields {
		if err := ohs.AddStepFieldOptions(&field); err != nil {
			return quizFields, err
		}
		quizFields[i] = field
	}

	return quizFields, nil
}

// AddStepFieldOptions nested objects to document
func (ohs *OnboardingHousingStep) AddStepFieldOptions(stepField *models.OnboardingHousingStepField) error {
	var stepFieldOptions []models.StepFieldOption

	if err := ohs.st.DB().Order("created_at ASC").Where("step_field_id = ?", stepField.ID).Find(&stepFieldOptions).Error; err != nil {
		return err
	}
	stepField.Options = stepFieldOptions
	return nil
}

func (ohs *OnboardingHousingStep) NextIndex(ctx context.Context, filter stores.Filter, rc io.ReadCloser) (*int, error) {
	docs, err := ohs.List(ctx, filter, rc)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (ohs *OnboardingHousingStep) DeleteOnboardingHousing(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	doc, err := ohs.st.Get(ctx, uid)
	if err != nil {
		return err
	}
	if !Can(ctx, DeleteOnboardHseQuiz, uid, cv.User.Country) {
		return ErrUnauthorized
	}
	return ohs.st.Delete(ctx, doc)
}

func (ohs *OnboardingHousingStep) FetchOnboardingHousing(ctx context.Context, ids []uuid.UUID) ([]models.OnboardingHousingStep, error) {
	var result []models.OnboardingHousingStep
	return result, ohs.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
