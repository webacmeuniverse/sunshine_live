package models

import (
	"acme.universe/sunshine/sunshine/config"
	"github.com/google/uuid"
)

type GetResultTbl2 struct {
	Value

	ResultTitle       string      `json:"result_title"`
	Lang              string      `json:"lang"`
	IsDefaultTemplate int         `json:"is_default_template"`
	OssAdminID        string      `json:"oss_admin_id"`
	TableType         string      `json:"table_type"`
	Session           string      `json:"session"`
	Index             int64       `json:"index"`
	YearValue         []YearValue `json:"year_value"`
}

func (GetResultTbl2) IsEntity() {}

func (GetResultTbl2) Kind() string {
	return "get_result_tbl2"
}

func (grt1 GetResultTbl2) Key() string {
	return grt1.ResultTitle
}

func (GetResultTbl2) TableName() string {
	return "get_result_tbl2"
}

// Dependencies returns an array of all business sub-objects of the entity
// Dependencies() []config.Dependency
func (GetResultTbl2) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

type YearValue struct {
	ID       uuid.UUID `json:"id"`
	ResultID uuid.UUID `json:"result_id"`
	Year     string    `json:"year"`
	Value    string    `json:"value"`
	Lang     string    `json:"lang"`
}

func (YearValue) IsEntity() {}

func (YearValue) Kind() string {
	return "year_value"
}

func (yv YearValue) Key() string {
	return yv.Year
}

func (YearValue) TableName() string {
	return "year_values"
}

// Dependencies returns an array of all business sub-objects of the entity
// Dependencies() []config.Dependency
func (YearValue) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
