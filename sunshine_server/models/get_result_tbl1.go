package models

import (
	"acme.universe/sunshine/sunshine/config"
)

type GetResultTbl1 struct {
	Value

	UserID           string `json:"user_id"`
	ResultTitle      string `json:"result_title"`
	CostVatXcl       string `json:"cost_vat_xcl"`
	CostVatXclInput  string `json:"cost_vat_xcl_input"`
	UnitVatXcl       string `json:"unit_vat_xcl"`
	CostVatInc       string `json:"cost_vat_inc"`
	CostVatIncInput  string `json:"cost_vat_inc_input"`
	UnitVatInc       string `json:"unit_vat_inc"`
	Vat              string `json:"vat"`
	TotalVatInc      string `json:"total_vat_inc"`
	TotalVatIncInput string `json:"total_vat_inc_input"`
	TotalVatXcl      string `json:"total_vat_xcl"`
	TotalVatXclInput string `json:"total_vat_xcl_input"`
	OssAdmin         string `json:"oss_admin"`
	TableType        string `json:"table_type"`
	Lang             string `json:"lang"`
}

func (GetResultTbl1) IsEntity() {}

func (GetResultTbl1) Kind() string {
	return "get_result_tbl1"
}

func (grt1 GetResultTbl1) Key() string {
	return grt1.UserID
}

func (GetResultTbl1) TableName() string {
	return "get_result_tbl1"
}

// Dependencies returns an array of all business sub-objects of the entity
// Dependencies() []config.Dependency
func (GetResultTbl1) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
