package models

import (
	"acme.universe/sunshine/sunshine/config"
	"github.com/google/uuid"
)

type OnboardingResidentStepBackup struct {
	Value

	BackupTime   string                       `json:"backup_time"`
	BackupTitle  string                       `json:"backup_title"`
	Index        int64                        `json:"index"`
	Name         string                       `json:"name"`
	Require      bool                         `json:"require"`
	MenuType     string                       `json:"menu_type"`
	OssAdminID   string                       `json:"oss_admin_id"`
	DefaultScore float64                      `json:"default_score"`
	Lang         string                       `json:"lang"`
	Questions    []ResidentStepQuestionBackup `json:"questions" gorm:"foreignkey:step_id"`
}

func (OnboardingResidentStepBackup) IsEntity() {}

func (OnboardingResidentStepBackup) Kind() string {
	return "onboarding_resident_step_backup"
}

func (orsb OnboardingResidentStepBackup) Key() string {
	return orsb.BackupTime
}

func (OnboardingResidentStepBackup) TableName() string {
	return "onboarding_residents_step_backup"
}

func (OnboardingResidentStepBackup) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

type ResidentStepQuestionBackup struct {
	Value

	BackupTime   string                              `json:"backup_time"`
	BackupTitle  string                              `json:"backup_title"`
	MenuType     string                              `json:"menu_type"`
	StepID       uuid.UUID                           `json:"step_id"`
	Index        int                                 `json:"index"`
	Name         string                              `json:"name" validate:"required"`
	DefaultScore float64                             `json:"default_score"`
	Lang         string                              `json:"lang"`
	StepFields   []OnboardingResidentStepFieldBackup `json:"step_fields" gorm:"foreignkey:step_name"`
}

func (ResidentStepQuestionBackup) IsEntity() {}

func (ResidentStepQuestionBackup) Kind() string {
	return "resident_step_question_backup"
}

func (rsqb ResidentStepQuestionBackup) Key() string {
	return rsqb.BackupTime
}

func (ResidentStepQuestionBackup) TableName() string {
	return "resident_step_question_backup"
}

func (ResidentStepQuestionBackup) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

type OnboardingResidentStepFieldBackup struct {
	Value

	BackupTime   string                  `json:"backup_time"`
	BackupTitle  string                  `json:"backup_title"`
	MenuType     string                  `json:"menu_type"`
	Index        int64                   `json:"index"`
	QuestionID   uuid.UUID               `json:"question_id"`
	Name         string                  `json:"name"`
	Placeholder  string                  `json:"placeholder"`
	InputType    string                  `json:"input_type"`
	Require      bool                    `json:"require"`
	DefaultScore float64                 `json:"default_score"`
	Lang         string                  `json:"lang"`
	Options      []StepFieldOptionBackup `json:"options"`
}

func (OnboardingResidentStepFieldBackup) IsEntity() {}

func (OnboardingResidentStepFieldBackup) Kind() string {
	return "onboarding_resident_step_field_backup"
}

func (orsb OnboardingResidentStepFieldBackup) Key() string {
	return orsb.BackupTime
}

func (OnboardingResidentStepFieldBackup) TableName() string {
	return "onboarding_residents_step_field_backup"
}

func (OnboardingResidentStepFieldBackup) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

type StepFieldOptionBackup struct {
	Value

	BackupTime   string    `json:"backup_time"`
	BackupTitle  string    `json:"backup_title"`
	MenuType     string    `json:"menu_type"`
	StepFieldID  uuid.UUID `json:"step_field_id"`
	Title        string    `json:"title"`
	OptionValue  string    `json:"option_value"`
	DefaultScore float64   `json:"default_score"`
	Image        string    `json:"image"`
}

func (StepFieldOptionBackup) IsEntity() {}

func (StepFieldOptionBackup) Kind() string {
	return "step_field_option_backup"
}

func (sfob StepFieldOptionBackup) Key() string {
	return sfob.BackupTime
}

func (StepFieldOptionBackup) TableName() string {
	return "step_field_option_backup"
}

func (StepFieldOptionBackup) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
