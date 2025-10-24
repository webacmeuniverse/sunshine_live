package models

import (
	"acme.universe/sunshine/sunshine/config"
)

type EnergyCertCategory struct {
	Value

	UserID      string  `json:"user_id"`
	AssetID     string  `json:"asset_id"`
	DetailsID   string  `json:"details_id"`
	Category    string  `json:"category"`
	Consumption float64 `json:"consumption"`
}

func (EnergyCertCategory) IsEntity() {}

func (EnergyCertCategory) Kind() string {
	return "energy_cert_category"
}

func (ecc EnergyCertCategory) Key() string {
	return ecc.AssetID
}

func (EnergyCertCategory) TableName() string {
	return "energy_cert_category"
}

func (EnergyCertCategory) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
