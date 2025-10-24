package models

import (
	"acme.universe/sunshine/sunshine/config"
)

type UserResult struct {
	Value

	UserPublicIP string `json:"user_public_ip"`
	Session      string `json:"session"`
	SelectedOss  string `json:"selected_oss"`
	Country      string `json:"country"`
	Lang         string `json:"lang"`

	CostVatXcl        string `json:"cost_vat_xcl"`
	UnitVatXcl        string `json:"unit_vat_xcl"`
	CostVatInc        string `json:"cost_vat_inc"`
	UnitVatInc        string `json:"unit_vat_inc"`
	Vat               string `json:"vat"`
	TotalVatInc       string `json:"total_vat_inc"`
	TotalVatXcl       string `json:"total_vat_xcl"`
	TableType         string `json:"table_type"`
	IsDefaultTemplate int    `json:"is_default_template"`
}

func (UserResult) IsEntity() {}

func (UserResult) Kind() string {
	return "user_result"
}

func (ur UserResult) Key() string {
	return ur.UserPublicIP
}

func (UserResult) TableName() string {
	return "user_result"
}

func (UserResult) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
