package models

import (
	"acme.universe/sunshine/sunshine/config"
)

type SupportAPI struct {
	Value

	Email   string `json:"email"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}

func (SupportAPI) IsEntity() {}

func (SupportAPI) Kind() string {
	return "support_api"
}

func (sa SupportAPI) Key() string {
	return sa.Email
}

func (SupportAPI) TableName() string {
	return "support_api"
}

func (SupportAPI) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
