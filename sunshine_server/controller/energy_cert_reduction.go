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

type EnergyCertReduction struct {
	st stores.Store
}

func NewEnergyCertReduction(env *services.Env) *EnergyCertReduction {
	return &EnergyCertReduction{
		st: env.EnergyCertReductionStore,
	}
}

func (ecr *EnergyCertReduction) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	var (
		certReduction models.EnergyCertReduction
	)
	if err := json.NewDecoder(rc).Decode(&certReduction); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	doc, err := ecr.st.Create(ctx, sanitizeEntityFields(&certReduction))
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func (ecr *EnergyCertReduction) Update(ctx context.Context, rc io.ReadCloser, query url.Values) (*models.Document, error) {
	var (
		certReduction models.EnergyCertReduction
		id            string = query.Get("id")
	)
	if err := json.NewDecoder(rc).Decode(&certReduction); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	doc, err := ecr.st.Get(ctx, uuid.MustParse(id))
	if err != nil {
		return nil, err
	}
	certRed := doc.Data.(*models.EnergyCertReduction)
	certRed.AssetID = certReduction.AssetID
	certRed.UserID = certReduction.UserID
	certRed.DetailsID = certReduction.DetailsID
	certRed.RenovationMeasure = certReduction.RenovationMeasure
	certRed.Reduction = certReduction.Reduction
	certRed.CostEurM2 = certReduction.CostEurM2
	return ecr.st.Update(ctx, models.Wrap(certRed))
}

func (ecr *EnergyCertReduction) Get(ctx context.Context, query url.Values) ([]models.EnergyCertReduction, error) {
	var certReductions []models.EnergyCertReduction
	assetID := query.Get("id")

	if err := ecr.st.DB().Order("created_at asc").Where("asset_id = ?", assetID).Find(&certReductions).Error; err != nil {
		return nil, err
	}
	return certReductions, nil
}

func (ecc *EnergyCertReduction) DeleteEnergyReduction(ctx context.Context, query url.Values) error {
	id := query.Get("id")
	doc, err := ecc.st.Get(ctx, uuid.MustParse(id))
	if err != nil {
		return ErrNotFound
	}
	return ecc.st.Delete(ctx, doc)
}
