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

type EnergyCertDetails struct {
	st stores.Store
}

func NewEnergyCertDetails(env *services.Env) *EnergyCertDetails {
	return &EnergyCertDetails{
		st: env.EnergyCertDetailsStore,
	}
}

func (ecd *EnergyCertDetails) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	var (
		certDetails models.EnergyCertDetails
		exist       models.EnergyCertDetails
	)
	if err := json.NewDecoder(rc).Decode(&certDetails); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if err := ecd.st.DB().Where("asset_id = ?", certDetails.AssetID).Where("user_id = ?", certDetails.UserID).First(&exist).Error; err != nil && err.Error() != "record not found" {
		return nil, err
	}
	fmt.Printf("Details ID: %v\n", exist.ID)
	if exist.ID == uuid.MustParse("00000000-0000-0000-0000-000000000000") {
		doc, err := ecd.st.Create(ctx, sanitizeEntityFields(&certDetails))
		if err != nil {
			return nil, err
		}
		return doc, nil
	}
	return models.Wrap(exist), nil
}

func (ecd *EnergyCertDetails) Update(ctx context.Context, rc io.ReadCloser, query url.Values) (*models.Document, error) {
	var newCert models.EnergyCertDetails
	id := query.Get("id")
	doc, err := ecd.st.Get(ctx, uuid.MustParse(id))
	if err != nil {
		return nil, ErrNotFound
	}
	oldCert := doc.Data.(*models.EnergyCertDetails)
	if err := json.NewDecoder(rc).Decode(&newCert); err != nil {
		return nil, err
	}
	oldCert.AssetID = newCert.AssetID
	oldCert.UserID = newCert.UserID
	oldCert.EnergyClass = newCert.EnergyClass
	oldCert.Consumption = newCert.Consumption
	oldCert.Certificate = newCert.Certificate
	return ecd.st.Update(ctx, models.Wrap(oldCert))
}

func (ecd *EnergyCertDetails) Get(ctx context.Context, query url.Values) (*models.Document, error) {
	var certDetail models.EnergyCertDetails
	assetID := query.Get("id")
	if err := ecd.st.DB().Where("asset_id = ?", assetID).First(&certDetail).Error; err != nil {
		return nil, err
	}
	return models.Wrap(certDetail), nil
}

func (ecd *EnergyCertDetails) DeleteEnergyCert(ctx context.Context, query url.Values) error {
	certID := query.Get("id")
	doc, err := ecd.st.Get(ctx, uuid.MustParse(certID))
	if err != nil {
		return ErrNotFound
	}
	return ecd.st.Delete(ctx, doc)
}
