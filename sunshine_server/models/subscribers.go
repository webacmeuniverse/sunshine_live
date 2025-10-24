package models

import (
	"acme.universe/sunshine/sunshine/config"
)

type Subscribers struct {
	Value

	Email    string `json:"email"`
	PublicIp string `json:"public_ip"`
}

func (Subscribers) IsEntity() {}

func (Subscribers) Kind() string {
	return "subscribers"
}

func (s *Subscribers) Key() string {
	return s.Email
}

func (Subscribers) TableName() string {
	return "subscribers"
}

func (Subscribers) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
