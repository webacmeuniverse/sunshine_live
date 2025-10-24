package models

import (
	"acme.universe/sunshine/sunshine/config"
)

type EnergyCertReduction struct {
	Value

	AssetID           string  `json:"asset_id"`
	UserID            string  `json:"user_id"`
	DetailsID         string  `json:"details_id"`
	RenovationMeasure string  `json:"renovation_measure"`
	Reduction         float64 `json:"reduction"`
	CostEurM2         float64 `json:"cost_eur_m2"`
}

func (EnergyCertReduction) IsEntity() {}

func (EnergyCertReduction) Kind() string {
	return "energy_cert_reduction"
}

func (ecr EnergyCertReduction) Key() string {
	return ecr.AssetID
}

func (EnergyCertReduction) TableName() string {
	return "energy_cert_reduction"
}

func (EnergyCertReduction) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
