package models

import (
	"acme.universe/sunshine/sunshine/config"
)

type SendMail struct {
	Value

	Name    string `json:"name"`
	Email   string `json:"email"`
	Subject string `json:"subject"`
	Details string `json:"details"`
	PdfFile string `json:"pdf_file"`
	// PdfFile map[string]Attachment `json:"_pdf_file,omitempty" gorm:"-"`
}

func (SendMail) IsEntity() {}

func (SendMail) Kind() string {
	return "send_mail"
}

func (sm SendMail) Key() string {
	return sm.PdfFile
}

func (SendMail) TableName() string {
	return "send_mail"
}

func (SendMail) Dependencies() []config.Dependency {
	return []config.Dependency{}
}
