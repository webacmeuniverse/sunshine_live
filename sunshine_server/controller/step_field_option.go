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

type StepFieldOption struct {
	st      stores.Store
	country models.Country
}

func NewStepFieldOption(env *services.Env) *StepFieldOption {
	return &StepFieldOption{
		st:      env.StepFieldOptionStore,
		country: "Latvia",
	}
}

func (sfo *StepFieldOption) Create(ctx context.Context, rc io.ReadCloser, id uuid.UUID) (*models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var stepFieldOption models.StepFieldOption

	if err := json.NewDecoder(rc).Decode(&stepFieldOption); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateStepFieldOption, id, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	stepFieldOption.StepFieldID = id

	doc, err := sfo.st.Create(ctx, sanitizeEntityFields(&stepFieldOption))
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func (sfo *StepFieldOption) Get(ctx context.Context, sfoID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	_, err := sfo.st.Get(ctx, sfoID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, GetStepFieldOption, sfoID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	return sfo.st.Unwrap(ctx, sfoID)
}

func (sfo *StepFieldOption) Update(ctx context.Context, fieldOptionID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	doc, err := sfo.st.Get(ctx, fieldOptionID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateStepFieldOption, fieldOptionID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	new := *doc.Data.(*models.StepFieldOption)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	new.ID = fieldOptionID

	doc.Data = &new

	_, err = sfo.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}

	result, deps, err := sfo.st.Unwrap(ctx, fieldOptionID)

	return result, deps, err
}

func (sfo *StepFieldOption) List(ctx context.Context, filter stores.Filter) ([]models.Document, stores.Dependencies, int, error) {
	docs, deps, n, err := sfo.st.List(ctx, filter)

	return docs, deps, n, err
}

func (sfo *StepFieldOption) ListDefaults(fieldID uuid.UUID) ([]models.StepFieldOption, error) {
	var options []models.StepFieldOption
	if err := sfo.st.DB().Order("created_at ASC").Where("is_default_template = '1'").Where("step_field_id = ?", fieldID).Find(&options).Error; err != nil {
		return nil, err
	}
	return options, nil
}

func (sfo *StepFieldOption) ListByOss(ctx context.Context, stepID uuid.UUID) ([]models.StepFieldOption, error) {
	var stepFields []models.StepFieldOption

	if err := sfo.st.DB().Where("step_field_id = ?", stepID).Find(&stepFields).Error; err != nil {
		return nil, err
	}
	return stepFields, nil
}

func (sfo *StepFieldOption) NextIndex(ctx context.Context, filter stores.Filter) (*int, error) {
	docs, _, _, err := sfo.List(ctx, filter)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (sfo *StepFieldOption) DeleteStepFieldOption(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	option := models.StepFieldOption{
		Value: models.Value{
			ID: uid,
		},
	}
	if !Can(ctx, DeleteStepFieldOption, uid, cv.User.Country) {
		return ErrUnauthorized
	}
	err := sfo.st.DB().Unscoped().Delete(&option).Error
	return err
}

func (sfo *StepFieldOption) FetchOnboardingResidentFields(ctx context.Context, ids []uuid.UUID) ([]models.StepFieldOption, error) {
	var result []models.StepFieldOption
	return result, sfo.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
