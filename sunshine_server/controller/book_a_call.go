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

type BookACall struct {
	st      stores.Store
	m       services.Mailer
	country models.Country
}

func NewBookACall(env *services.Env) *BookACall {
	return &BookACall{
		st:      env.BookACallStore,
		m:       env.Mailer,
		country: "Latvia",
	}
}

func (bac *BookACall) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	var (
		bookACall models.BookACall
	)
	if err := json.NewDecoder(rc).Decode(&bookACall); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	doc, err := bac.st.Create(ctx, sanitizeEntityFields(&bookACall))
	if err != nil {
		return nil, err
	}
	go services.NewBookACallEmail(bac.m, bookACall)
	go services.NewBookACallOssAdminEmail(bac.m, bookACall)

	return doc, nil
}

func (bac *BookACall) Get(ctx context.Context, urbID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	_, err := bac.st.Get(ctx, urbID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	return bac.st.Unwrap(ctx, urbID)
}

func (bac *BookACall) Update(ctx context.Context, uidID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	doc, err := bac.st.Get(ctx, uidID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	new := *doc.Data.(*models.BookACall)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	doc.Data = &new
	_, err = bac.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}

	return bac.st.Unwrap(ctx, uidID)
}

func (bac *BookACall) List(ctx context.Context, filter stores.Filter, query url.Values) ([]models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, ListBookACall, uuid.Nil, cv.User.Country) {
		return nil, nil, 0, ErrUnauthorized
	}
	return bac.st.List(ctx, filter)
}

func (bac *BookACall) NextIndex(ctx context.Context, filter stores.Filter, query url.Values) (*int, error) {
	docs, _, _, err := bac.List(ctx, filter, query)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (bac *BookACall) DeleteBookACall(ctx context.Context, uidID uuid.UUID) error {
	doc, err := bac.st.Get(ctx, uidID)
	if err != nil {
		return ErrNotFound
	}
	return bac.st.Delete(ctx, doc)
}
