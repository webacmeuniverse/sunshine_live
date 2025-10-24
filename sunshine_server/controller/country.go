package controller

import (
	"context"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
	"github.com/google/uuid"
)

type Country struct {
	st         stores.Store
	notifier   stores.Notifier
	uploadPath string
}

func NewCountry(env *services.Env) *Country {
	return &Country{
		st:         env.CountryStore,
		notifier:   env.Notifier,
		uploadPath: env.Paths.Uploads,
	}
}

func (c *Country) SetVat(ctx context.Context, country models.Country, vat int) (*models.CountryVat, error) {
	var ctrv models.CountryVat
	if !Can(ctx, SetVat, uuid.Nil, country) {
		return nil, ErrUnauthorized
	}
	return &ctrv, c.st.DB().Model(&ctrv).Where("country = ?", country).Update("vat", vat).Error
}

func (c *Country) GetCountry(ctx context.Context, country models.Country) (*models.CountryVat, error) {
	var ctrv models.CountryVat
	if !Can(ctx, GetCountry, uuid.Nil, country) {
		return nil, ErrUnauthorized
	}
	return &ctrv, c.st.DB().Where("country = ?", country).First(&ctrv).Error
}
