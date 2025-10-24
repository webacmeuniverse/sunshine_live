package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/url"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/google/uuid"
)

type UserInputData struct {
	st      stores.Store
	country models.Country
}

func NewUserInputData(env *services.Env) *UserInputData {
	return &UserInputData{
		st:      env.UserInputDataStore,
		country: "Latvia",
	}
}

func (uid *UserInputData) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	var (
		userInputData    models.UserInputData
		existingUserData models.UserInputData
		blankInputData   models.UserInputData
	)
	if err := json.NewDecoder(rc).Decode(&userInputData); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if err := uid.st.DB().Where("field_id = ?", userInputData.FieldID).Where("user_id = ?", userInputData.UserID).First(&existingUserData).Error; err != nil && err.Error() != "record not found" {
		return nil, err
	}

	if existingUserData != blankInputData {
		if errU := uid.st.DB().Unscoped().Delete(&existingUserData).Error; errU != nil && errU.Error() != "record not found" {
			return nil, errU
		}
	}
	doc, err := uid.st.Create(ctx, sanitizeEntityFields(&userInputData))
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func (uid *UserInputData) Get(ctx context.Context, urbID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	_, err := uid.st.Get(ctx, urbID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, GetUserInputData, urbID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	return uid.st.Unwrap(ctx, urbID)
}

func (uid *UserInputData) Update(ctx context.Context, uidID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	doc, err := uid.st.Get(ctx, uidID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateUserInputData, uidID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	new := *doc.Data.(*models.UserInputData)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	doc.Data = &new
	_, err = uid.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}
	result, deps, err := uid.st.Unwrap(ctx, uidID)

	return result, deps, err
}

func (uid *UserInputData) List(ctx context.Context, filter stores.Filter, query url.Values) ([]models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, 0, ErrUnauthorized
	}
	var userInputs []models.UserInputData
	var docs []models.Document

	OssAdminID := query.Get("oss_admin_id")
	Lang := query.Get("lang")
	Session := query.Get("session")
	UserID := query.Get("user_id")
	MenuType := query.Get("menu_type")

	if !Can(ctx, ListUserInputData, uuid.Nil, cv.User.Country) {
		return nil, nil, 0, ErrUnauthorized
	}
	if err := uid.st.DB().
		Where("oss_admin_id = ?", OssAdminID).
		Where("lang = ?", Lang).
		Where("session = ?", Session).
		Where("menu_type = ?", MenuType).
		Where("user_id = ?", UserID).
		Order("created_at ASC").
		Find(&userInputs).
		Error; err != nil {
		return nil, nil, 0, err
	}

	for _, input := range userInputs {
		doc := models.Document{
			ID:        input.ID,
			Kind:      input.Kind(),
			Data:      input,
			Timestamp: input.UpdatedAt,
		}
		docs = append(docs, doc)
	}

	_, deps, n, err := uid.st.List(ctx, filter)

	return docs, deps, n, err
}

func (uid *UserInputData) NextIndex(ctx context.Context, filter stores.Filter, query url.Values) (*int, error) {
	docs, _, _, err := uid.List(ctx, filter, query)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (uid *UserInputData) DeleteUserInputData(ctx context.Context, uidID uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	doc, err := uid.st.Get(ctx, uidID)
	if err != nil {
		return ErrNotFound
	}
	if !Can(ctx, DeleteUserInputData, uidID, cv.User.Country) {
		return ErrUnauthorized
	}
	return uid.st.Delete(ctx, doc)
}
