package models

import (
	"acme.universe/sunshine/sunshine/config"
)

type RenovateCalcInput struct {
	Value
	OnboardingUserData
	TableType            string                  `json:"table_type"`
	IsDefaultTemplate    int                     `json:"is_default_template"`
	TotalYear            int                     `json:"total_year"`
	BeforeRenovationYear int                     `json:"before_renovation_year"`
	AfterRenovationYear  int                     `json:"after_renovation_year"`
	CalculationInput     []UserResultCalculation `json:"calculation_input"`
	GetResTbl1           []GetResultTbl1         `json:"get_res_tbl_1"`
	GetResTbl2           []GetResultTbl2         `json:"get_result_tbl_2"`
}

func (RenovateCalcInput) IsEntity() {}

func (RenovateCalcInput) Kind() string {
	return "renovate_calc_input"
}

func (rci RenovateCalcInput) Key() string {
	return rci.UserID
}

func (RenovateCalcInput) TableName() string {
	return "renovate_calc_input"
}

// Dependencies returns an array of all business sub-objects of the entity
// Dependencies() []config.Dependency
func (RenovateCalcInput) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
