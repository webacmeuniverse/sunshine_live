package models

import (
	"acme.universe/sunshine/sunshine/config"
)

type BookACall struct {
	Value

	Name        string `json:"name"`
	LastName    string `json:"last_name"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phone_number"`
	OssAdminID  string `json:"oss_admin_id"`
	MenuType    string `json:"menu_type"`
	Description string `json:"description"`
}

func (BookACall) IsEntity() {}

func (BookACall) Kind() string {
	return "book_a_call"
}

func (bac BookACall) Key() string {
	return bac.Email
}

func (BookACall) TableName() string {
	return "book_a_call"
}

func (BookACall) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
