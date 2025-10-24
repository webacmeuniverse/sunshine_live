package controller

import (
	"context"
	"encoding/json"
	"io"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
	"github.com/google/uuid"
)

type Subscribers struct {
	st       stores.Store
	notFound string
}

func NewSubscribers(env *services.Env) *Subscribers {
	return &Subscribers{
		st:       env.Subscribers,
		notFound: "record not found",
	}
}

func (ss *Subscribers) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	var subscriber models.Subscribers

	if err := json.NewDecoder(rc).Decode(&subscriber); err != nil {
		return nil, err
	}

	if err := ss.st.DB().Unscoped().Where("email = ?", subscriber.Email).Delete(&subscriber).Error; err != nil {
		return nil, err
	}

	doc, err := ss.st.Create(ctx, &subscriber)
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func (ss *Subscribers) List(ctx context.Context, filter stores.Filter) ([]models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, ListSubscribers, uuid.Nil, cv.User.Country) {
		return nil, nil, 0, ErrUnauthorized
	}
	return ss.st.List(ctx, filter)
}
