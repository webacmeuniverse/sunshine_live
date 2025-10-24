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

type OnboardingResidentStepBackupQuestion struct {
	st      stores.Store
	country models.Country
}

func NewOnboardingResidentStepBackupQuestion(env *services.Env) *OnboardingResidentStepBackupQuestion {
	return &OnboardingResidentStepBackupQuestion{
		st:      env.OnboardingResidentStepBackupQuestionStore,
		country: "Latvia",
	}
}

func (orsbq *OnboardingResidentStepBackupQuestion) Create(ctx context.Context, backupQuestion models.ResidentStepQuestionBackup) (*uuid.UUID, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}

	if !Can(ctx, CreateOnboardResQuizBUp, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}

	if err := orsbq.st.DB().Save(&backupQuestion).Error; err != nil {
		return nil, err
	}

	return &backupQuestion.ID, nil
}

func (orsbq *OnboardingResidentStepBackupQuestion) Get(ctx context.Context, orsqID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}

	_, err := orsbq.st.Get(ctx, orsqID)
	if err != nil {
		return nil, nil, ErrNotFound
	}

	doc, deps, errU := orsbq.st.Unwrap(ctx, orsqID)

	return doc, deps, errU
}

func (orsbq *OnboardingResidentStepBackupQuestion) Update(ctx context.Context, quizID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}

	doc, err := orsbq.st.Get(ctx, quizID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateOnboardResQuizBUp, quizID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	new := *doc.Data.(*models.ResidentStepQuestionBackup)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	doc.Data = &new

	_, err = orsbq.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}

	result, deps, err := orsbq.st.Unwrap(ctx, quizID)

	return result, deps, err
}

func (orsbq *OnboardingResidentStepBackupQuestion) List(ctx context.Context, filter stores.Filter, rc io.ReadCloser) ([]models.ResidentStepQuestionBackup, error) {
	cv := services.FromContext(ctx)

	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}

	var (
		onboardingResidentStepBackupQuestions []models.ResidentStepQuestionBackup
	)

	if err := orsbq.st.DB().Order("created_at ASC").Where("step_id = ?", filter.StepID).Where("lang = ?", filter.Lang).Find(&onboardingResidentStepBackupQuestions).Error; err != nil {
		return nil, err
	}

	return onboardingResidentStepBackupQuestions, nil
}

func (orsbq *OnboardingResidentStepBackupQuestion) MakeDocs(questions []models.ResidentStepQuestionBackup, docs []models.Document) ([]models.Document, error) {

	for _, quiz := range questions {
		doc, err := orsbq.AddStepBackupQuestionFields(quiz)
		if err != nil {
			return nil, err
		}
		docs = append(docs, doc)
	}
	return docs, nil

}

// AddStepBackupQuestionFields nested objects to document
func (orsbq *OnboardingResidentStepBackupQuestion) AddStepBackupQuestionFields(question models.ResidentStepQuestionBackup) (models.Document, error) {
	var _doc models.Document
	var stepBackupQuestionFields []models.OnboardingResidentStepFieldBackup

	if err := orsbq.st.DB().Order("created_at ASC").Where("question_id = ?", question.ID).Find(&stepBackupQuestionFields).Error; err != nil {
		return _doc, err
	}

	for _, field := range stepBackupQuestionFields {
		if err := orsbq.AddStepBackupFieldOptions(&field); err != nil {
			return _doc, err
		}
	}
	question.StepFields = stepBackupQuestionFields

	doc := models.Document{
		ID:        question.ID,
		Kind:      question.Kind(),
		Data:      question,
		Timestamp: question.UpdatedAt,
	}
	return doc, nil
}

// AddStepBackupFieldOptions nested objects to document
func (orsbq *OnboardingResidentStepBackupQuestion) AddStepBackupFieldOptions(stepField *models.OnboardingResidentStepFieldBackup) error {
	var stepBackupFieldOptions []models.StepFieldOptionBackup

	if err := orsbq.st.DB().Order("created_at ASC").Where("step_field_id = ?", stepField.ID).Find(&stepBackupFieldOptions).Error; err != nil {
		return err
	}
	stepField.Options = stepBackupFieldOptions
	return nil
}

func (orsbq *OnboardingResidentStepBackupQuestion) NextIndex(ctx context.Context, filter stores.Filter, rc io.ReadCloser) (*int, error) {
	docs, err := orsbq.List(ctx, filter, rc)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (orsbq *OnboardingResidentStepBackupQuestion) DeleteResidentStepBackupQuestion(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, DeleteOnboardResQuizBUp, uid, cv.User.Country) {
		return ErrUnauthorized
	}

	doc, err := orsbq.st.Get(ctx, uid)
	if err != nil {
		return err
	}

	return orsbq.st.Delete(ctx, doc)
}

func (orsbq *OnboardingResidentStepBackupQuestion) FetchResidentStepBackupQuestions(ctx context.Context, ids []uuid.UUID) ([]models.ResidentStepQuestionBackup, error) {
	var result []models.ResidentStepQuestionBackup
	return result, orsbq.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
