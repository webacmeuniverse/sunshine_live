package models

import (
	"acme.universe/sunshine/sunshine/config"
	"github.com/google/uuid"
)

type OnboardingResidentStep struct {
	Value

	Index             int64                  `json:"index"`
	Name              string                 `json:"name"`
	Require           bool                   `json:"require"`
	MenuType          string                 `json:"menu_type"`
	OssAdminID        string                 `json:"oss_admin_id"`
	DefaultScore      float64                `json:"default_score"`
	Lang              string                 `json:"lang"`
	IsDefaultTemplate int                    `json:"is_default_template"`
	Questions         []ResidentStepQuestion `json:"questions" gorm:"foreignkey:step_id"`
}

func (OnboardingResidentStep) IsEntity() {}

func (OnboardingResidentStep) Kind() string {
	return "onboarding_resident_step"
}

func (ors OnboardingResidentStep) Key() string {
	return ors.Name
}

func (OnboardingResidentStep) TableName() string {
	return "onboarding_residents_step"
}

func (OnboardingResidentStep) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

type ResidentStepQuestion struct {
	Value

	StepID            uuid.UUID                     `json:"step_id"`
	Index             int                           `json:"index"`
	Name              string                        `json:"name" validate:"required"`
	DefaultScore      float64                       `json:"default_score"`
	Lang              string                        `json:"lang"`
	IsDefaultTemplate int                           `json:"is_default_template"`
	StepFields        []OnboardingResidentStepField `json:"step_fields" gorm:"foreignkey:step_name"`
}

func (ResidentStepQuestion) IsEntity() {}

func (ResidentStepQuestion) Kind() string {
	return "resident_step_question"
}

func (rsq ResidentStepQuestion) Key() string {
	return rsq.Name
}

func (ResidentStepQuestion) TableName() string {
	return "resident_step_question"
}

func (ResidentStepQuestion) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

type OnboardingResidentStepField struct {
	Value

	Index             int64             `json:"index"`
	QuestionID        uuid.UUID         `json:"question_id"`
	Name              string            `json:"name"`
	Placeholder       string            `json:"placeholder"`
	InputType         string            `json:"input_type"`
	Require           bool              `json:"require"`
	DefaultScore      float64           `json:"default_score"`
	Lang              string            `json:"lang"`
	IsDefaultTemplate int               `json:"is_default_template"`
	Options           []StepFieldOption `json:"options"`
	Answers           []UserAnswer      `json:"answers"`
}

func (OnboardingResidentStepField) IsEntity() {}

func (OnboardingResidentStepField) Kind() string {
	return "onboarding_resident_step_field"
}

func (ors OnboardingResidentStepField) Key() string {
	return ors.Name
}

func (OnboardingResidentStepField) TableName() string {
	return "onboarding_residents_step_field"
}

func (OnboardingResidentStepField) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
