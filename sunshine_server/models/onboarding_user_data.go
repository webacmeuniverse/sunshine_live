package models

import (
	"time"

	"acme.universe/sunshine/sunshine/config"
)

type OnboardingUserData struct {
	Value

	Session     string          `json:"session"`
	Lang        string          `json:"lang"`
	IP          string          `json:"ip"`
	MenuType    string          `json:"menu_type"`
	PostCode    string          `json:"post_code"`
	OssAdminID  string          `json:"oss_admin_id"`
	UserID      string          `json:"user_id"`
	Name        string          `json:"name"`
	Surname     string          `json:"surname"`
	Email       string          `json:"email"`
	Password    string          `json:"password"`
	PhoneNumber string          `json:"phone_number"`
	City        string          `json:"city"`
	Country     string          `json:"country"`
	OrgType     string          `json:"org_type"`
	OrgName     string          `json:"org_name"`
	RegNumber   string          `json:"reg_number"`
	VatNumber   string          `json:"vat_number"`
	LegalRepOrg string          `json:"legal_rep_org"`
	Website     string          `json:"website"`
	Address     string          `json:"address"`
	RegDate     time.Time       `json:"reg_date"`
	DataInputs  []UserInputData `json:"data_inputs"`
}

func (OnboardingUserData) IsEntity() {}

func (OnboardingUserData) Kind() string {
	return "onboarding_user_data"
}

func (oud OnboardingUserData) Key() string {
	return oud.Email
}

func (OnboardingUserData) TableName() string {
	return "onboarding_user_data"
}

func (OnboardingUserData) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
