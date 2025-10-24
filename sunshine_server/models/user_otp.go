package models

import (
	"acme.universe/sunshine/sunshine/config"
)

type UserOtp struct {
	Value

	UserID string `json:"user_id"`
	Token  string `json:"token"`
	Active bool   `json:"active"`
}

func (UserOtp) IsEntity() {}

func (UserOtp) Kind() string {
	return "user_otp"
}

func (uo UserOtp) Key() string {
	return uo.UserID
}

func (UserOtp) TableName() string {
	return "user_otp"
}

func (UserOtp) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
