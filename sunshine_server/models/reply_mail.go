package models

import (
	"acme.universe/sunshine/sunshine/config"
)

type ReplyMail struct {
	Value

	Topic       string `json:"topic"`
	Message     string `json:"message"`
	SenderName  string `json:"sender_name"`
	SenderEmail string `json:"sender_email"`
	OssAdminID  string `json:"oss_admin_id"`
}

func (ReplyMail) IsEntity() {}

func (ReplyMail) Kind() string {
	return "reply_mail"
}

func (rm ReplyMail) Key() string {
	return rm.Message
}

func (ReplyMail) TableName() string {
	return "reply_mail"
}

func (ReplyMail) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
