package models

import (
	"acme.universe/sunshine/sunshine/config"
)

type PlaceHolder struct {
	Value

	Index        int64  `json:"index"`
	Name         string `json:"name"`
	Require      bool   `json:"require"`
	MenuType     string `json:"menu_type"`
	OssAdminID   string `json:"oss_admin_id"`
	DefaultScore int64  `json:"default_score"`
	Placeholder  string `json:"placeholder"`
	InputType    string `json:"input_type"`
	Title        string `json:"title"`
	OptionValue  string `json:"option_value"`
	Image        string `json:"image"`
	Lang         string `json:"lang"`
}

func (PlaceHolder) IsEntity() {}

func (PlaceHolder) Kind() string {
	return "placeholder"
}

func (ph PlaceHolder) Key() string {
	return ph.Title
}

func (PlaceHolder) TableName() string {
	return "placeholder"
}

func (PlaceHolder) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
