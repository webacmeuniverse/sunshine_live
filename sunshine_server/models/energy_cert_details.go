package models

import (
	"acme.universe/sunshine/sunshine/config"
)

type EnergyCertDetails struct {
	Value

	AssetID     string  `json:"asset_id"`
	UserID      string  `json:"user_id"`
	EnergyClass string  `json:"energy_class"`
	Consumption float64 `json:"consumption"`
	Certificate string  `json:"certificate"`
}

func (EnergyCertDetails) IsEntity() {}

func (EnergyCertDetails) Kind() string {
	return "energy_cert_details"
}

func (ecd EnergyCertDetails) Key() string {
	return ecd.AssetID
}

func (EnergyCertDetails) TableName() string {
	return "energy_cert_details"
}

func (EnergyCertDetails) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
