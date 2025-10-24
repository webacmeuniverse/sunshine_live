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

type OnboardingHousingStepField struct {
	st      stores.Store
	country models.Country
}

func NewOnboardingHousingStepField(env *services.Env) *OnboardingHousingStepField {
	return &OnboardingHousingStepField{
		st:      env.OnboardingHousingStepFieldStore,
		country: "Latvia",
	}
}

func (ohsf *OnboardingHousingStepField) Create(ctx context.Context, rc io.ReadCloser, uid uuid.UUID) (*models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var onboardingHousingStepField models.OnboardingHousingStepField
	if err := json.NewDecoder(rc).Decode(&onboardingHousingStepField); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateOnboardingHousingStepField, uid, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	onboardingHousingStepField.QuestionID = uid

	if _, err := ohsf.st.GetByIndex(ctx, fmt.Sprint(onboardingHousingStepField.Index)); err == nil {
		return nil, fmt.Errorf("%w: Index", ErrDuplicate)
	}

	doc, err := ohsf.st.Create(ctx, sanitizeEntityFields(&onboardingHousingStepField))
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func (ohsf *OnboardingHousingStepField) Get(ctx context.Context, fieldID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, GetOnboardingHousingStepField, fieldID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	var onboardingHousingStepField models.OnboardingHousingStepField

	if err := ohsf.st.DB().Where("id = ?", fieldID).First(&onboardingHousingStepField).Error; err != nil {
		return nil, nil, err
	}
	doc, err := ohsf.st.Get(ctx, fieldID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	return doc, nil, nil
}

func (ohsf *OnboardingHousingStepField) Update(ctx context.Context, housingStepFieldID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	doc, err := ohsf.st.Get(ctx, housingStepFieldID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateOnboardingHousingStepField, housingStepFieldID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}

	new := *doc.Data.(*models.OnboardingHousingStepField)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	doc.Data = &new

	_, err = ohsf.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}

	result, deps, err := ohsf.st.Unwrap(ctx, housingStepFieldID)

	return result, deps, err
}

func (ohsf *OnboardingHousingStepField) List(ctx context.Context, filter stores.Filter, rc io.ReadCloser) ([]models.Document, error) {
	// cv := services.FromContext(ctx)

	// if !cv.Authorized() || !Can(ctx, ListCalcMenus, uuid.Nil, cv.User.Country) {
	// 	return nil, nil, 0, ErrUnauthorized
	// }
	var (
		docs                        []models.Document
		onboardingHousingStepFields []models.OnboardingHousingStepField
		getRequest                  FieldGetRequest
	)

	if err := json.NewDecoder(rc).Decode(&getRequest); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	// _, deps, n, err := ors.st.List(ctx, filter)

	fmt.Printf("Listing admin: %v and lang: %v\n", getRequest.OssAdminID, getRequest.Lang)
	if err := ohsf.st.DB().Order("created_at ASC").Where("step_id = ?", getRequest.StepID).Where("oss_admin_id = ?", getRequest.OssAdminID).Where("lang = ?", getRequest.Lang).Find(&onboardingHousingStepFields).Error; err != nil {
		return nil, err
	}

	return docs, nil
}

func (ohsf *OnboardingHousingStepField) NextIndex(ctx context.Context, filter stores.Filter, rc io.ReadCloser) (*int, error) {
	docs, err := ohsf.List(ctx, filter, rc)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (ohsf *OnboardingHousingStepField) DeleteOnboardingHousingField(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	doc, err := ohsf.st.Get(ctx, uid)
	if err != nil {
		return err
	}
	if !Can(ctx, DeleteOnboardingHousingStepField, uid, cv.User.Country) {
		return ErrUnauthorized
	}
	return ohsf.st.Delete(ctx, doc)
}

func (ohsf *OnboardingHousingStepField) FetchOnboardingHousingField(ctx context.Context, ids []uuid.UUID) ([]models.OnboardingHousingStepField, error) {
	var result []models.OnboardingHousingStepField
	return result, ohsf.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
