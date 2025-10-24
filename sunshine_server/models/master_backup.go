package models

import (
	"acme.universe/sunshine/sunshine/config"
	"github.com/google/uuid"
)

type MasterStep struct {
	Value

	Index        int64            `json:"index"`
	Name         string           `json:"name"`
	Require      bool             `json:"require"`
	MenuType     string           `json:"menu_type"`
	OssAdminID   string           `json:"oss_admin_id"`
	DefaultScore float64          `json:"default_score"`
	Lang         string           `json:"lang"`
	Questions    []MasterQuestion `json:"questions" gorm:"foreignkey:step_id"`
}

func (MasterStep) IsEntity() {}

func (MasterStep) Kind() string {
	return "master_step"
}

func (ms MasterStep) Key() string {
	return ms.Name
}

func (MasterStep) TableName() string {
	return "master_step"
}

func (MasterStep) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

type MasterQuestion struct {
	Value

	StepID       uuid.UUID     `json:"step_id"`
	Index        int           `json:"index"`
	Name         string        `json:"name" validate:"required"`
	DefaultScore float64       `json:"default_score"`
	Lang         string        `json:"lang"`
	StepFields   []MasterField `json:"step_fields" gorm:"foreignkey:step_name"`
}

func (MasterQuestion) IsEntity() {}

func (MasterQuestion) Kind() string {
	return "master_question"
}

func (ms MasterQuestion) Key() string {
	return ms.Name
}

func (MasterQuestion) TableName() string {
	return "master_question"
}

func (MasterQuestion) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

type MasterField struct {
	Value

	Index        int64          `json:"index"`
	QuestionID   uuid.UUID      `json:"question_id"`
	Name         string         `json:"name"`
	Placeholder  string         `json:"placeholder"`
	InputType    string         `json:"input_type"`
	Require      bool           `json:"require"`
	DefaultScore float64        `json:"default_score"`
	Lang         string         `json:"lang"`
	Options      []MasterOption `json:"options"`
	Answers      []UserAnswer   `json:"answers"`
}

func (MasterField) IsEntity() {}

func (MasterField) Kind() string {
	return "master_field"
}

func (mf MasterField) Key() string {
	return mf.Name
}

func (MasterField) TableName() string {
	return "master_field"
}

func (MasterField) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

type MasterOption struct {
	Value

	StepFieldID  uuid.UUID `json:"step_field_id"`
	Title        string    `json:"title"`
	OptionValue  string    `json:"option_value"`
	DefaultScore float64   `json:"default_score"`
	Image        string    `json:"image"`
}

func (MasterOption) IsEntity() {}

func (MasterOption) Kind() string {
	return "master_option"
}

func (mo MasterOption) Key() string {
	return mo.Title
}

func (MasterOption) TableName() string {
	return "master_option"
}

func (MasterOption) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
