package models

import (
	"acme.universe/sunshine/sunshine/config"
	"github.com/google/uuid"
)

type GeneralQuestion struct {
	Value

	StepID     uuid.UUID   `json:"step_id"`
	Index      int         `json:"index"`
	Name       string      `json:"name" validate:"required"`
	Lang       string      `json:"lang"`
	StepFields []StepField `json:"step_fields" gorm:"foreignkey:step_name"`
}

func (GeneralQuestion) IsEntity() {}

func (GeneralQuestion) Kind() string {
	return "general_question"
}

func (gq GeneralQuestion) Key() string {
	return gq.Name
}

func (GeneralQuestion) TableName() string {
	return "general_question"
}

func (gq GeneralQuestion) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
