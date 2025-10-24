package models

import (
	"acme.universe/sunshine/sunshine/config"
	"github.com/google/uuid"
)

type OssEesResultTbl2 struct {
	Value

	ResultTitle       string                        `json:"result_title"`
	OssAdminID        string                        `json:"oss_admin_id"`
	Lang              string                        `json:"lang"`
	TableType         string                        `json:"table_type"`
	IsDefaultTemplate int                           `json:"is_default_template"`
	YearFormula       []OssEesResultTbl2YearFormula `json:"year_formula"`
}

func (OssEesResultTbl2) IsEntity() {}

func (OssEesResultTbl2) Kind() string {
	return "oss_ees_result2"
}

func (oert1 OssEesResultTbl2) Key() string {
	return oert1.ResultTitle
}

func (OssEesResultTbl2) TableName() string {
	return "oss_ees_result_tbl2"
}

// Dependencies returns an array of all business sub-objects of the entity
// Dependencies() []config.Dependency
func (OssEesResultTbl2) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

type OssEesResultTbl2YearFormula struct {
	Value

	ResultID  uuid.UUID `json:"result_id"`
	FieldID   string    `json:"field_id"`
	FieldName string    `json:"field_name"`
	Lang      string    `json:"lang"`
	Index     int64     `json:"index"`
}

func (OssEesResultTbl2YearFormula) IsEntity() {}

func (OssEesResultTbl2YearFormula) Kind() string {
	return "oss_ees_result2_year_formula"
}

func (oert1 OssEesResultTbl2YearFormula) Key() string {
	return oert1.FieldName
}

func (OssEesResultTbl2YearFormula) TableName() string {
	return "oss_ees_result_tbl2_year_formula"
}

// Dependencies returns an array of all business sub-objects of the entity
// Dependencies() []config.Dependency
func (OssEesResultTbl2YearFormula) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
