package models

import (
	"acme.universe/sunshine/sunshine/config"
	"github.com/google/uuid"
)

type StepItemBackup struct {
	Value

	BackupTime  string `json:"backup_time"`
	BackupTitle string `json:"backup_title"`

	Index      int               `json:"index"`
	Name       string            `json:"name" validate:"required"`
	Require    bool              `json:"require"`
	OssAdminID string            `json:"oss_admin_id"`
	Lang       string            `json:"lang"`
	StepFields []StepFieldBackup `json:"step_fields" gorm:"foreignkey:StepName"`
}

func (StepItemBackup) IsEntity() {}

func (StepItemBackup) Kind() string {
	return "step_backup"
}

func (sib StepItemBackup) Key() string {
	return sib.BackupTitle
}

func (StepItemBackup) TableName() string {
	return "step_backup"
}

func (sib StepItemBackup) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

// // Dependencies returns an array of all business sub-objects of the entity
// Dependencies() []config.Dependency

type StepFieldBackup struct {
	Value

	BackupTime  string `json:"backup_time"`
	BackupTitle string `json:"backup_title"`

	StepID      uuid.UUID `json:"step_id"`
	Index       int       `json:"index"`
	Name        string    `json:"name"`
	Require     bool      `json:"require"`
	Placeholder string    `json:"placeholder"`
	TextNumber  string    `json:"text_number"`
	Lang        string    `json:"lang"`
}

func (StepFieldBackup) TableName() string {
	return "field_backup"
}

func (sfb StepFieldBackup) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

func (StepFieldBackup) IsEntity() {}

func (StepFieldBackup) Kind() string {
	return "step_field_item_backup"
}

func (sfb StepFieldBackup) Key() string {
	return sfb.BackupTitle
}

type StepsResultBackup struct {
	Value

	BackupTime  string `json:"backup_time"`
	BackupTitle string `json:"backup_title"`

	ResultTitle string            `json:"result_title"`
	CostVatXcl  []ResultSubObject `json:"cost_vat_xcl"`
	UnitVatXcl  string            `json:"unit_vat_xcl"`
	CostVatInc  []ResultSubObject `json:"cost_vat_inc"`
	UnitVatInc  string            `json:"unit_vat_inc"`
	Vat         string            `json:"vat"`
	TotalVatInc []ResultSubObject `json:"total_vat_inc"`
	TotalVatXcl []ResultSubObject `json:"total_vat_xcl"`
	OssAdminID  string            `json:"oss_admin_id"`
	Lang        string            `json:"lang"`
	TableType   string            `json:"table_type"`
}

func (StepsResultBackup) IsEntity() {}

func (StepsResultBackup) Kind() string {
	return "step_result_backup"
}

func (srb StepsResultBackup) Key() string {
	return srb.BackupTitle
}

func (StepsResultBackup) TableName() string {
	return "step_result_backup"
}

func (StepsResultBackup) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

type ResultSubObjectBackup struct {
	ID          uuid.UUID `json:"id"`
	BackupTime  string    `json:"backup_time"`
	BackupTitle string    `json:"backup_title"`
	ResultID    uuid.UUID `json:"result_id"`
	CostType    string    `json:"cost_type"`
	FieldID     string    `json:"field_id"`
	FieldName   string    `json:"field_name"`
	Index       int       `json:"index"`
	Lang        string    `json:"lang"`
}

func (ResultSubObjectBackup) IsEntity() {}

func (ResultSubObjectBackup) Kind() string {
	return "result_sub_item_backup"
}

func (rsob ResultSubObjectBackup) Key() string {
	return rsob.BackupTitle
}

func (ResultSubObjectBackup) TableName() string {
	return "result_sub_object_backup"
}

func (ResultSubObjectBackup) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

type OssEesResultBackup struct {
	Value

	BackupTime  string `json:"backup_time"`
	BackupTitle string `json:"backup_title"`

	ResultTitle       string                 `json:"result_title"`
	OssAdminID        string                 `json:"oss_admin_id"`
	Lang              string                 `json:"lang"`
	TableType         string                 `json:"table_type"`
	IsDefaultTemplate int                    `json:"is_default_template"`
	YearFormula       []OssEesResultYFBackup `json:"year_formula"`
}

func (OssEesResultBackup) IsEntity() {}

func (OssEesResultBackup) Kind() string {
	return "oss_ees_result_backup"
}

func (oerb OssEesResultBackup) Key() string {
	return oerb.BackupTitle
}

func (OssEesResultBackup) TableName() string {
	return "oss_ees_result_backup"
}

func (OssEesResultBackup) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

type OssEesResultYFBackup struct {
	Value

	BackupTime  string `json:"backup_time"`
	BackupTitle string `json:"backup_title"`

	ResultID  uuid.UUID `json:"result_id"`
	FieldID   string    `json:"field_id"`
	FieldName string    `json:"field_name"`
	Lang      string    `json:"lang"`
}

func (OssEesResultYFBackup) IsEntity() {}

func (OssEesResultYFBackup) Kind() string {
	return "oss_ees_result_yf_backup"
}

func (oeryfb OssEesResultYFBackup) Key() string {
	return oeryfb.BackupTitle
}

func (OssEesResultYFBackup) TableName() string {
	return "oss_ees_result_yf_backup"
}

func (OssEesResultYFBackup) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
