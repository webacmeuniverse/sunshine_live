package models

import (
	"acme.universe/sunshine/sunshine/config"

	"github.com/google/uuid"
)

type OrganizationRating struct {
	Value

	OrganizationID uuid.UUID `json:"organization_id"`
	UserID         uuid.UUID `json:"user_id"`
	Quality        float64   `json:"quality"`
	Speed          float64   `json:"speed"`
	Communication  float64   `json:"communication"`
}

func (OrganizationRating) Kind() string {
	return "organization_rating"
}

func (or OrganizationRating) Key() string {
	return or.OrganizationID.String()
}

func (OrganizationRating) IsEntity() {}

func (OrganizationRating) TableName() string {
	return "organization_rating"
}

func (OrganizationRating) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
