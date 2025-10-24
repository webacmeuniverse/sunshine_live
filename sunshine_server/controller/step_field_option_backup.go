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

type StepBackupFieldOption struct {
	st      stores.Store
	country models.Country
}

func NewStepBackupFieldOption(env *services.Env) *StepBackupFieldOption {
	return &StepBackupFieldOption{
		st:      env.StepBackupFieldOptionStore,
		country: "Latvia",
	}
}

func (sbfo *StepBackupFieldOption) Create(ctx context.Context, option models.StepFieldOptionBackup) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, CreateStepBackupFieldOpt, uuid.Nil, cv.User.Country) {
		return ErrUnauthorized
	}
	_, err := sbfo.st.Create(ctx, sanitizeEntityFields(&option))

	return err
}

func (sbfo *StepBackupFieldOption) Get(ctx context.Context, sbfoID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	_, err := sbfo.st.Get(ctx, sbfoID)
	if err != nil {
		return nil, nil, ErrNotFound
	}

	return sbfo.st.Unwrap(ctx, sbfoID)
}

func (sbfo *StepBackupFieldOption) Update(ctx context.Context, fieldOptionBackupID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	doc, err := sbfo.st.Get(ctx, fieldOptionBackupID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateStepBackupFieldOpt, fieldOptionBackupID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	new := *doc.Data.(*models.StepFieldOptionBackup)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	new.ID = fieldOptionBackupID

	doc.Data = &new

	_, err = sbfo.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}

	result, deps, err := sbfo.st.Unwrap(ctx, fieldOptionBackupID)

	return result, deps, err
}

func (sbfo *StepBackupFieldOption) List(ctx context.Context, filter stores.Filter) ([]models.Document, stores.Dependencies, int, error) {
	docs, deps, n, err := sbfo.st.List(ctx, filter)

	return docs, deps, n, err
}

func (sbfo *StepBackupFieldOption) NextIndex(ctx context.Context, filter stores.Filter) (*int, error) {
	docs, _, _, err := sbfo.List(ctx, filter)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (sbfo *StepBackupFieldOption) DeleteStepBackupFieldOption(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	doc, err := sbfo.st.Get(ctx, uid)
	if err != nil {
		return err
	}
	if !Can(ctx, DeleteStepBackupFieldOpt, uid, cv.User.Country) {
		return ErrUnauthorized
	}
	return sbfo.st.Delete(ctx, doc)
}

func (sbfo *StepBackupFieldOption) FetchOnboardingResidentFieldOptionBackups(ctx context.Context, ids []uuid.UUID) ([]models.StepFieldOptionBackup, error) {
	var result []models.StepFieldOptionBackup
	return result, sbfo.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
