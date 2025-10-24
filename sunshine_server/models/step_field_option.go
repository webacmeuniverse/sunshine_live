package models

import (
	"acme.universe/sunshine/sunshine/config"
	"github.com/google/uuid"
)

type StepFieldOption struct {
	Value

	StepFieldID       uuid.UUID `json:"step_field_id"`
	Title             string    `json:"title"`
	OptionValue       string    `json:"option_value"`
	DefaultScore      float64   `json:"default_score"`
	Image             string    `json:"image"`
	IsDefaultTemplate int       `json:"is_default_template"`
}

func (StepFieldOption) IsEntity() {}

func (StepFieldOption) Kind() string {
	return "step_field_option"
}

func (sfo StepFieldOption) Key() string {
	return sfo.Title
}

func (StepFieldOption) TableName() string {
	return "step_field_option"
}

func (StepFieldOption) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
