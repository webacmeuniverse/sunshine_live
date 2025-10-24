package models

import (
	"acme.universe/sunshine/sunshine/config"
	"github.com/google/uuid"
)

type OnboardingHousingStep struct {
	Value

	Index      int64                 `json:"index"`
	Name       string                `json:"name"`
	Require    bool                  `json:"require"`
	MenuType   string                `json:"menu_type"`
	OssAdminID string                `json:"oss_admin_id"`
	Lang       string                `json:"lang"`
	Questions  []HousingStepQuestion `json:"questions"`
}

func (OnboardingHousingStep) IsEntity() {}

func (OnboardingHousingStep) Kind() string {
	return "onboarding_housing_step"
}

func (ors OnboardingHousingStep) Key() string {
	return ors.Name
}

func (OnboardingHousingStep) TableName() string {
	return "onboarding_housing_step"
}

func (OnboardingHousingStep) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

type HousingStepQuestion struct {
	Value

	StepID         uuid.UUID                    `json:"step_id"`
	Index          int                          `json:"index"`
	Name           string                       `json:"name" validate:"required"`
	Lang           string                       `json:"lang"`
	QuestionFields []OnboardingHousingStepField `json:"question_fields" gorm:"foreignkey:question_id"`
}

func (HousingStepQuestion) IsEntity() {}

func (HousingStepQuestion) Kind() string {
	return "housing_step_question"
}

func (hsq HousingStepQuestion) Key() string {
	return hsq.Name
}

func (HousingStepQuestion) TableName() string {
	return "housing_step_question"
}

func (HousingStepQuestion) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

type OnboardingHousingStepField struct {
	Value

	Index       int64             `json:"index"`
	QuestionID  uuid.UUID         `json:"question_id"`
	Name        string            `json:"name"`
	Placeholder string            `json:"placeholder"`
	InputType   string            `json:"input_type"`
	Require     bool              `json:"require"`
	Lang        string            `json:"lang"`
	Options     []StepFieldOption `json:"options"`
}

func (OnboardingHousingStepField) IsEntity() {}

func (OnboardingHousingStepField) Kind() string {
	return "onboarding_housing_step_field"
}

func (ohsf OnboardingHousingStepField) Key() string {
	return ohsf.Name
}

func (OnboardingHousingStepField) TableName() string {
	return "onboarding_housing_step_field"
}

func (OnboardingHousingStepField) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
