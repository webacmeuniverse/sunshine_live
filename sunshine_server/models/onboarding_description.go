package models

import (
	"acme.universe/sunshine/sunshine/config"
)

type OnboardingDescription struct {
	Value

	Description       string `json:"description"`
	Lang              string `json:"lang"`
	OssAdminID        string `json:"oss_admin_id"`
	MenuType          string `json:"menu_type"`
	IsDefaultTemplate int    `json:"is_default_template"`
}

func (OnboardingDescription) Kind() string {
	return "onboarding_description"
}

func (od OnboardingDescription) Key() string {
	return od.Description
}

func (OnboardingDescription) IsEntity() {}

func (OnboardingDescription) TableName() string {
	return "onboarding_description"
}

func (OnboardingDescription) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
