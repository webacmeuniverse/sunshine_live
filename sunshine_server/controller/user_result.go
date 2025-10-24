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

type UserResult struct {
	st      stores.Store
	country models.Country
}

func NewUserResultItem(env *services.Env) *UserResult {
	return &UserResult{
		st:      env.UserResultStore,
		country: "Latvia",
	}
}

func (ur *UserResult) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var userResult models.UserResult

	if err := json.NewDecoder(rc).Decode(&userResult); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if _, err := ur.st.GetByIndex(ctx, string(userResult.ID.String())); err == nil {
		return nil, fmt.Errorf("%w: id", ErrDuplicate)
	}
	if !Can(ctx, CreateUserResult, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	doc, err := ur.st.Create(ctx, sanitizeEntityFields(&userResult))
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func (ur *UserResult) Get(ctx context.Context, userResultID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	_, err := ur.st.Get(ctx, userResultID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, GetUserResult, userResultID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	return ur.st.Unwrap(ctx, userResultID)
}

func (ur *UserResult) Update(ctx context.Context, userResultID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	doc, err := ur.st.Get(ctx, userResultID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateUserResult, userResultID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	new := *doc.Data.(*models.UserResult)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	doc.Data = &new

	_, err = ur.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}

	result, deps, err := ur.st.Unwrap(ctx, userResultID)

	return result, deps, err
}

func (ur *UserResult) List(ctx context.Context, filter stores.Filter) ([]models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, ListUserResult, uuid.Nil, cv.User.Country) {
		return nil, nil, 0, ErrUnauthorized
	}
	docs, deps, n, err := ur.st.List(ctx, filter)

	return docs, deps, n, err
}

func (ur *UserResult) ListByOssAdminID(ctx context.Context, ossAdminID string) ([]models.UserResult, error) {
	var results []models.UserResult

	if err := ur.st.DB().Where("selected_oss = ?", ossAdminID).Find(&results).Error; err != nil {
		return nil, err
	}

	return results, nil
}

func (ur *UserResult) NextIndex(ctx context.Context, filter stores.Filter) (*int, error) {
	docs, _, _, err := ur.List(ctx, filter)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (ur *UserResult) DeleteUserResult(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	doc, err := ur.st.Get(ctx, uid)
	if err != nil {
		return err
	}
	if !Can(ctx, DeleteUserResult, uid, cv.User.Country) {
		return ErrUnauthorized
	}
	return ur.st.Delete(ctx, doc)

}

func (ur *UserResult) FetchStepsResultItems(ctx context.Context, ids []uuid.UUID) ([]models.UserResult, error) {
	var result []models.UserResult
	return result, ur.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
