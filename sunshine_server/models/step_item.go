package models

import (
	"acme.universe/sunshine/sunshine/config"
	"github.com/google/uuid"
)

type StepItem struct {
	Value

	Index             int         `json:"index"`
	Name              string      `json:"name" validate:"required"`
	Require           bool        `json:"require"`
	OssAdminID        string      `json:"oss_admin_id"`
	Lang              string      `json:"lang"`
	IsDefaultTemplate int         `json:"is_default_template"`
	StepFields        []StepField `json:"step_fields" gorm:"foreignkey:StepName"`
}

func (StepItem) IsEntity() {}

func (StepItem) Kind() string {
	return "step"
}

func (c StepItem) Key() string {
	return c.Name
}

func (StepItem) TableName() string {
	return "step"
}

func (c StepItem) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

// // Dependencies returns an array of all business sub-objects of the entity
// Dependencies() []config.Dependency

type StepField struct {
	Value

	StepID              uuid.UUID `json:"step_id"`
	Index               int       `json:"index"`
	Name                string    `json:"name"`
	Require             bool      `json:"require"`
	Placeholder         string    `json:"placeholder"`
	TextNumber          string    `json:"text_number"`
	Lang                string    `json:"lang"`
	IsDefaultTemplateID string    `json:"is_default_template_id"`
	IsDefaultTemplate   int       `json:"is_default_template"`
}

func (StepField) TableName() string {
	return "field"
}

func (u StepField) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

func (StepField) IsEntity() {}

func (StepField) Kind() string {
	return "step_field_item"
}

func (c StepField) Key() string {
	return c.Name
}
