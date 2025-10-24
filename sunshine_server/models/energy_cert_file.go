package models

import (
	"acme.universe/sunshine/sunshine/config"
)

type EnergyCertFile struct {
	Value

	FileName  string `json:"file_name"`
	DetailsID string `json:"details_id"`
	FileURL   string `json:"file_url"`
}

func (EnergyCertFile) IsEntity() {}

func (EnergyCertFile) Kind() string {
	return "energy_cert_file"
}

func (ecf EnergyCertFile) Key() string {
	return ecf.DetailsID
}

func (EnergyCertFile) TableName() string {
	return "energy_cert_file"
}

func (EnergyCertFile) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
