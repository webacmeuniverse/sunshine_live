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

type EnergyCertCategory struct {
	st stores.Store
}

func NewEnergyCertCategory(env *services.Env) *EnergyCertCategory {
	return &EnergyCertCategory{
		st: env.EnergyCertCategoryStore,
	}
}

func (ecc *EnergyCertCategory) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	var (
		certCategory models.EnergyCertCategory
	)
	if err := json.NewDecoder(rc).Decode(&certCategory); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	doc, err := ecc.st.Create(ctx, sanitizeEntityFields(&certCategory))
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func (ecc *EnergyCertCategory) Update(ctx context.Context, rc io.ReadCloser, query url.Values) (*models.Document, error) {
	var (
		id           string = query.Get("id")
		certCategory models.EnergyCertCategory
	)
	if err := json.NewDecoder(rc).Decode(&certCategory); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	doc, err := ecc.st.Get(ctx, uuid.MustParse(id))
	if err != nil {
		return nil, err
	}
	certCat := doc.Data.(*models.EnergyCertCategory)
	certCat.UserID = certCategory.UserID
	certCat.AssetID = certCategory.AssetID
	certCat.DetailsID = certCategory.DetailsID
	certCat.Category = certCategory.Category
	certCat.Consumption = certCategory.Consumption
	return ecc.st.Update(ctx, models.Wrap(certCat))
}

func (ecc *EnergyCertCategory) Get(ctx context.Context, query url.Values) ([]models.EnergyCertCategory, error) {
	assetID := query.Get("id")
	var certCategories []models.EnergyCertCategory
	if err := ecc.st.DB().Order("created_at asc").Where("asset_id = ?", assetID).Find(&certCategories).Error; err != nil {
		return nil, err
	}
	return certCategories, nil
}

func (ecc *EnergyCertCategory) DeleteEnergyCategory(ctx context.Context, query url.Values) error {
	id := query.Get("id")
	doc, err := ecc.st.Get(ctx, uuid.MustParse(id))
	if err != nil {
		return ErrNotFound
	}
	return ecc.st.Delete(ctx, doc)
}
