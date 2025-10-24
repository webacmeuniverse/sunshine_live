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

type Placeholder struct {
	st      stores.Store
	country models.Country
}

func NewPlaceholder(env *services.Env) *Placeholder {
	return &Placeholder{
		st:      env.PlaceholderStore,
		country: "Latvia",
	}
}

func (ph *Placeholder) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var placeholder models.PlaceHolder

	if err := json.NewDecoder(rc).Decode(&placeholder); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if _, err := ph.st.GetByIndex(ctx, fmt.Sprint(placeholder.Index)); err == nil {
		return nil, fmt.Errorf("%w: Index", ErrDuplicate)
	}
	if !Can(ctx, CreatePlaceholder, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	doc, err := ph.st.Create(ctx, sanitizeEntityFields(&placeholder))
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func (ph *Placeholder) Get(ctx context.Context, phID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	_, err := ph.st.Get(ctx, phID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	return ph.st.Unwrap(ctx, phID)
}

func (ph *Placeholder) Update(ctx context.Context, phID uuid.UUID, r io.Reader) (*models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	doc, err := ph.st.Get(ctx, phID)
	if err != nil {
		return nil, ErrNotFound
	}
	if !Can(ctx, UpdatePlaceholder, phID, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	new := *doc.Data.(*models.PlaceHolder)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	doc.Data = &new

	doc, err = ph.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func (ph *Placeholder) List(ctx context.Context, filter stores.Filter) ([]models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, ListPlaceholder, uuid.Nil, cv.User.Country) {
		return nil, nil, 0, ErrUnauthorized
	}
	return ph.st.List(ctx, filter)
}

func (ph *Placeholder) NextIndex(ctx context.Context, filter stores.Filter) (*int, error) {
	docs, _, _, err := ph.List(ctx, filter)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (ph *Placeholder) DeletePlaceholder(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	doc, err := ph.st.Get(ctx, uid)
	if err != nil {
		return err
	}
	if !Can(ctx, DeletePlaceholder, uid, cv.User.Country) {
		return ErrUnauthorized
	}
	return ph.st.Delete(ctx, doc)
}

func (ph *Placeholder) FetchPlaceholders(ctx context.Context, ids []uuid.UUID) ([]models.PlaceHolder, error) {
	var result []models.PlaceHolder
	return result, ph.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
