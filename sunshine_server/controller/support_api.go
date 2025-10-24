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

type SupportAPI struct {
	st      stores.Store
	country models.Country
}

func NewSupportAPI(env *services.Env) *SupportAPI {
	return &SupportAPI{
		st:      env.SupportAPIStore,
		country: "Latvia",
	}
}

func (sa *SupportAPI) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		supportAPI models.SupportAPI
	)
	if err := json.NewDecoder(rc).Decode(&supportAPI); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateSupportAPI, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	doc, err := sa.st.Create(ctx, sanitizeEntityFields(&supportAPI))
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func (sa *SupportAPI) Get(ctx context.Context, urbID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	_, err := sa.st.Get(ctx, urbID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	return sa.st.Unwrap(ctx, urbID)
}

func (sa *SupportAPI) Update(ctx context.Context, uidID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	doc, err := sa.st.Get(ctx, uidID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateSupportAPI, uidID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	new := *doc.Data.(*models.SupportAPI)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	doc.Data = &new

	_, err = sa.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}

	return sa.st.Unwrap(ctx, uidID)
}

func (sa *SupportAPI) List(ctx context.Context, filter stores.Filter, query url.Values) ([]models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, ListSupportAPI, uuid.Nil, cv.User.Country) {
		return nil, nil, 0, ErrUnauthorized
	}
	return sa.st.List(ctx, filter)
}

func (as *SupportAPI) NextIndex(ctx context.Context, filter stores.Filter, query url.Values) (*int, error) {
	docs, _, _, err := as.List(ctx, filter, query)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (as *SupportAPI) DeleteSupportAPI(ctx context.Context, uidID uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	doc, err := as.st.Get(ctx, uidID)
	if err != nil {
		return ErrNotFound
	}
	if !Can(ctx, DeleteSupportAPI, uidID, cv.User.Country) {
		return ErrUnauthorized
	}
	return as.st.Delete(ctx, doc)
}
