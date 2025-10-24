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

type OnboardingResidentStepField struct {
	st      stores.Store
	country models.Country
}

func NewOnboardingResidentStepField(env *services.Env) *OnboardingResidentStepField {
	return &OnboardingResidentStepField{
		st:      env.OnboardingResidentStepFieldStore,
		country: "Latvia",
	}
}

func (orsf *OnboardingResidentStepField) Create(ctx context.Context, rc io.ReadCloser, id uuid.UUID) (*models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var onboardingResidentStepField models.OnboardingResidentStepField

	if err := json.NewDecoder(rc).Decode(&onboardingResidentStepField); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	if !Can(ctx, CreateOnboardResStepField, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}

	if _, err := orsf.st.GetByIndex(ctx, fmt.Sprintf("%d", onboardingResidentStepField.Index)); err == nil {
		return nil, fmt.Errorf("%w: index", ErrDuplicate)
	}

	onboardingResidentStepField.QuestionID = id

	doc, err := orsf.st.Create(ctx, sanitizeEntityFields(&onboardingResidentStepField))
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func (orsf *OnboardingResidentStepField) Get(ctx context.Context, orsID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	_, err := orsf.st.Get(ctx, orsID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, GetOnboardResStepField, orsID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	return orsf.st.Unwrap(ctx, orsID)
}

func (orsf *OnboardingResidentStepField) Update(ctx context.Context, stepsResultID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}

	doc, err := orsf.st.Get(ctx, stepsResultID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateOnboardResStepField, stepsResultID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	new := *doc.Data.(*models.OnboardingResidentStepField)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	doc.Data = &new

	_, err = orsf.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}

	result, deps, err := orsf.st.Unwrap(ctx, stepsResultID)

	return result, deps, err
}

func (orsf *OnboardingResidentStepField) List(ctx context.Context, filter stores.Filter) ([]models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, ListOnboardingResidentStep, uuid.Nil, cv.User.Country) {
		return nil, nil, 0, ErrUnauthorized
	}
	docs, deps, n, err := orsf.st.List(ctx, filter)

	return docs, deps, n, err
}

func (orsf *OnboardingResidentStepField) ListDefaults(allLangs bool, quizID uuid.UUID, lang string) ([]models.OnboardingResidentStepField, error) {
	var fields []models.OnboardingResidentStepField
	if allLangs {
		if err := orsf.st.DB().Order("created_at ASC").Where("is_default_template = '1'").Where("question_id = ?", quizID).Find(&fields).Error; err != nil {
			return nil, err
		}
		return fields, nil
	}
	if err := orsf.st.DB().Order("created_at ASC").Where("is_default_template = '1'").Where("question_id = ?", quizID).Where("lang = ?", lang).Find(&fields).Error; err != nil {
		return nil, err
	}
	return fields, nil
}

func (orsf *OnboardingResidentStepField) NextIndex(ctx context.Context, filter stores.Filter) (*int, error) {
	docs, _, _, err := orsf.List(ctx, filter)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (orsf *OnboardingResidentStepField) DeleteOnboardingResidentField(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}

	doc, err := orsf.st.Get(ctx, uid)
	if err != nil {
		return err
	}

	if !Can(ctx, DeleteOnboardResStepField, uid, cv.User.Country) {
		return ErrUnauthorized
	}

	return orsf.st.Delete(ctx, doc)
}

func (orsf *OnboardingResidentStepField) FetchOnboardingResidentFields(ctx context.Context, ids []uuid.UUID) ([]models.OnboardingResidentStepField, error) {
	var result []models.OnboardingResidentStepField
	return result, orsf.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
