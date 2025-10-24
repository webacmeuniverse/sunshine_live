package models

import (
	"acme.universe/sunshine/sunshine/config"
)

type OssEesResultBasic struct {
	Value

	Name    string `json:"name"`
	Surname string `json:"Surname"`
	Email   string `json:"email"`
	Country string `json:"country"`
	City    string `json:"city"`

	Fields []StepFieldOption `json:"fields"`
}

func (OssEesResultBasic) IsEntity() {}

func (OssEesResultBasic) Kind() string {
	return "oss_ees_result_basic"
}

func (oerb OssEesResultBasic) Key() string {
	return oerb.Name
}

func (OssEesResultBasic) TableName() string {
	return "oss_ees_result_basic"
}

func (OssEesResultBasic) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
