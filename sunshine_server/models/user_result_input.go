package models

import (
	"acme.universe/sunshine/sunshine/config"
	"github.com/google/uuid"
)

type UserBasicDetails struct {
	Value

	UserPublicIP         string `json:"user_public_ip"`
	Session              string `json:"session"`
	OssAdminID           string `json:"oss_admin_id"`
	Country              string `json:"country"`
	UserID               string `json:"user_id"`
	Lang                 string `json:"lang"`
	BeforeRenovationYear int64  `json:"before_renovation_year"`
	AfterRenovationYear  int64  `json:"after_renovation_year"`
	IsDefaultTemplate    int    `json:"is_default_template"`
	TableType            string `json:"table_type"`
	TotalYear            int    `json:"total_year"`
	SelectedYear         int    `json:"selected_year"`

	CalculationInput []UserResultCalculation `json:"calculation_input"`
}

func (UserBasicDetails) IsEntity() {}

func (UserBasicDetails) Kind() string {
	return "user_basic_details"
}

func (ubd UserBasicDetails) Key() string {
	return ubd.UserID
}

func (UserBasicDetails) TableName() string {
	return "user_basic_details"
}

func (UserBasicDetails) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

type UserResultCalculation struct {
	Value

	EesFieldID         string    `json:"ees_field_id"`
	EesFieldValue      string    `json:"ees_field_value"`
	EesFieldTitle      string    `json:"ees_field_title"`
	Session            string    `json:"session"`
	Lang               string    `json:"lang"`
	TableType          string    `json:"table_type"`
	UserBasicDetailsID uuid.UUID `json:"user_basic_details_id"`
}

func (UserResultCalculation) IsEntity() {}

func (UserResultCalculation) Kind() string {
	return "user_result_calculation"
}

func (urc UserResultCalculation) Key() string {
	return urc.EesFieldID
}

func (UserResultCalculation) TableName() string {
	return "user_result_calc_field"
}

func (UserResultCalculation) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
