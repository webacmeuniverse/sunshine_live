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

type OnboardingResidentStepBackupField struct {
	st      stores.Store
	country models.Country
}

func NewOnboardingResidentStepBackupField(env *services.Env) *OnboardingResidentStepBackupField {
	return &OnboardingResidentStepBackupField{
		st:      env.OnboardingResidentStepBackupFieldStore,
		country: "Latvia",
	}
}

func (orsbf *OnboardingResidentStepBackupField) Create(ctx context.Context, backupField models.OnboardingResidentStepFieldBackup) (*uuid.UUID, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, CreateOnboardResStepBackupField, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	_, err := orsbf.st.Create(ctx, sanitizeEntityFields(&backupField))
	if err != nil {
		return nil, err
	}

	return &backupField.ID, nil
}

func (orsbf *OnboardingResidentStepBackupField) Get(ctx context.Context, orsID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}

	_, err := orsbf.st.Get(ctx, orsID)
	if err != nil {
		return nil, nil, ErrNotFound
	}

	return orsbf.st.Unwrap(ctx, orsID)
}

func (orsbf *OnboardingResidentStepBackupField) Update(ctx context.Context, stepBackupID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}

	doc, err := orsbf.st.Get(ctx, stepBackupID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateOnboardResStepBackupField, stepBackupID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	new := *doc.Data.(*models.OnboardingResidentStepFieldBackup)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	doc.Data = &new

	_, err = orsbf.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}

	result, deps, err := orsbf.st.Unwrap(ctx, stepBackupID)

	return result, deps, err
}

func (orsbf *OnboardingResidentStepBackupField) List(ctx context.Context, filter stores.Filter) ([]models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)

	if !cv.Authorized() {
		return nil, nil, 0, ErrUnauthorized
	}

	docs, deps, n, err := orsbf.st.List(ctx, filter)

	return docs, deps, n, err
}

func (orsbf *OnboardingResidentStepBackupField) NextIndex(ctx context.Context, filter stores.Filter) (*int, error) {
	docs, _, _, err := orsbf.List(ctx, filter)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (orsbf *OnboardingResidentStepBackupField) DeleteOnboardingResidentFieldBackup(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}

	doc, err := orsbf.st.Get(ctx, uid)
	if err != nil {
		return err
	}

	if !Can(ctx, DeleteOnboardResStepBackupField, uid, cv.User.Country) {
		return ErrUnauthorized
	}

	return orsbf.st.Delete(ctx, doc)
}

func (orsbf *OnboardingResidentStepBackupField) FetchOnboardingResidentFieldBackups(ctx context.Context, ids []uuid.UUID) ([]models.OnboardingResidentStepFieldBackup, error) {
	var result []models.OnboardingResidentStepFieldBackup
	return result, orsbf.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
