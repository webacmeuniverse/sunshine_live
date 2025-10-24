package models

import (
	"acme.universe/sunshine/sunshine/config"
)

type UserInputData struct {
	Value

	FieldID              string  `json:"field_id"`
	FieldTitle           string  `json:"field_title"`
	FieldValue           string  `json:"field_value"`
	Session              string  `json:"session"`
	UserID               string  `json:"user_id"`
	OssAdminID           string  `json:"oss_admin_id"`
	Country              string  `json:"country"`
	MenuType             string  `json:"menu_type"`
	CertFile             string  `json:"cert_file"`
	DefaultScore         float64 `json:"default_score"`
	StepDefaultScore     float64 `json:"step_default_score"`
	QuestionDefaultScore float64 `json:"question_default_score"`
	FieldDefaultScore    float64 `json:"field_default_score"`
	StepName             string  `json:"step_name"`
	QuestionName         string  `json:"question_name"`
	StepFieldsName       string  `json:"step_fields_name"`
	Lang                 string  `json:"lang"`
}

func (UserInputData) IsEntity() {}

func (UserInputData) Kind() string {
	return "user_input_data"
}

func (uid UserInputData) Key() string {
	return uid.FieldTitle
}

func (UserInputData) TableName() string {
	return "user_input_data"
}

func (UserInputData) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
