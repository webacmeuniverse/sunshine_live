package models

import (
	"acme.universe/sunshine/sunshine/config"
	"github.com/google/uuid"
)

type UserAnswer struct {
	Value

	Answer  string    `json:"answer"`
	FieldID uuid.UUID `json:"field_id"`
}

func (UserAnswer) IsEntity() {}

func (UserAnswer) Kind() string {
	return "user_answer"
}

func (ua UserAnswer) Key() string {
	return ua.Answer
}

func (UserAnswer) TableName() string {
	return "user_answer"
}

func (UserAnswer) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
