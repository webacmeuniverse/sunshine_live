package models

import (
	"acme.universe/sunshine/sunshine/config"
	"github.com/google/uuid"
)

type StepsResult struct {
	Value

	ResultTitle       string            `json:"result_title"`
	CostVatXcl        []ResultSubObject `json:"cost_vat_xcl"`
	UnitVatXcl        string            `json:"unit_vat_xcl"`
	CostVatInc        []ResultSubObject `json:"cost_vat_inc"`
	UnitVatInc        string            `json:"unit_vat_inc"`
	Vat               string            `json:"vat"`
	TotalVatInc       []ResultSubObject `json:"total_vat_inc"`
	TotalVatXcl       []ResultSubObject `json:"total_vat_xcl"`
	OssAdminID        string            `json:"oss_admin_id"`
	Lang              string            `json:"lang"`
	TableType         string            `json:"table_type"`
	IsDefaultTemplate int               `json:"is_default_template"`
}

func (StepsResult) IsEntity() {}

func (StepsResult) Kind() string {
	return "steps_result"
}

func (c StepsResult) Key() string {
	return c.Vat
}

func (StepsResult) TableName() string {
	return "steps_result"
}

func (StepsResult) Dependencies() []config.Dependency {
	return []config.Dependency{}
}

type ResultSubObject struct {
	ID                uuid.UUID `json:"id"`
	ResultID          uuid.UUID `json:"result_id"`
	CostType          string    `json:"cost_type"`
	FieldID           string    `json:"field_id"`
	FieldName         string    `json:"field_name"`
	Index             int       `json:"index"`
	Lang              string    `json:"lang"`
	IsDefaultTemplate int       `json:"is_default_template"`
}

func (ResultSubObject) IsEntity() {}

func (ResultSubObject) Kind() string {
	return "result_sub_item"
}

func (rso ResultSubObject) Key() string {
	return rso.ResultID.String()
}

func (ResultSubObject) TableName() string {
	return "result_sub_object"
}

func (ResultSubObject) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
