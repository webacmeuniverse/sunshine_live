package services

import (
	"fmt"
	"log"
	"net/mail"
	"strings"

	"acme.universe/sunshine/sunshine/models"
	gomail "gopkg.in/gomail.v2"

	"github.com/google/uuid"
	"github.com/matcornic/hermes/v2"
)

const (
	bookACallIntro2   = "Thank you for booking a call with SUNSHINE TEAM! Our OSS  will contact you soon."
	welcomeIntro      = "Welcome to Sunshine! We're very excited to have you on board."
	otpVerification   = "Below is your 6 digit OTP verification code. Please use it for your confirmation and delete it immediately."
	newMessageIntro   = "You have a new message from a client, find the details below."
	defaultCredsIntro = "Here are your default sunshine sccount access credentials. Make arrangements to change the password and keep it secret."
	fpIntro           = "You have received this email because a password reset request for your account was received."
	fpOutro           = "If you did not request a password reset, no further action is required on your part."
	fpInstructions    = "Click the button below to reset your password:"
	cuInstructions    = "Click the button below to confirm your account. This validation link expires in 48 hours:"
	cuOutro           = `
Data Privacy

You have received this email because you would like to register to the SunSHiNE Platform.

The information transmitted is intended for the person or entity to which it is addressed and may contain confidential, privileged or copyrighted material. If you receive this in error, please contact the sender and delete the material from any computer.

We work hard to keep your personal data secure, which includes regularly reviewing our privacy notice. When there’s an important change we’ll remind you to take a look, so you’re aware how we use your data and what your options are. Please review the latest privacy notice.
`
)

func NewUserEmail(mailer Mailer, user models.User, token uuid.UUID) {
	var err = mailer.Send(
		[]mail.Address{{Name: user.Name, Address: user.Email}},
		"Welcome to SUNShINE!",
		hermes.Email{
			Body: hermes.Body{
				Name:   user.Name,
				Intros: []string{welcomeIntro},
				Actions: []hermes.Action{
					{
						Instructions: cuInstructions,
						Button: hermes.Button{
							Color:     "#DC4D2F",
							TextColor: "#FFFFFF",
							Text:      "Confirm your account",
							Link: fmt.Sprintf(
								"%s/confirm_user/%s",
								mailer.URL(),
								token,
							),
						},
					},
				},
				Outros: strings.SplitAfter(cuOutro, "\n"),
			},
		},
	)
	log.Printf("Sending email for user %s on create: %v", user.Email, err)
}

func ForgottenPasswordEmail(mailer Mailer, user models.User, token uuid.UUID) {
	var err = mailer.Send(
		[]mail.Address{{Name: user.Name, Address: user.Email}},
		"Forgotten Password",
		hermes.Email{
			Body: hermes.Body{
				Name:   user.Name,
				Intros: []string{fpIntro},
				Actions: []hermes.Action{
					{
						Instructions: fpInstructions,
						Button: hermes.Button{
							Color:     "#DC4D2F",
							TextColor: "#FFFFFF",
							Text:      "Reset your password",
							Link: fmt.Sprintf(
								"%s/reset_password/%s",
								mailer.URL(),
								token,
							),
						},
					},
				},
				Outros: []string{fpOutro},
			},
		},
	)
	log.Printf("Sending email for forgotten password with token %s: %v", token, err)
}

func SendOtpVerification(mailer Mailer, email, name, otp string) {
	var err = mailer.Send(
		[]mail.Address{{Name: name, Address: email}},
		"OTP Verification Code From Sunshine!",
		hermes.Email{
			Body: hermes.Body{
				Name:   name,
				Intros: []string{otpVerification},
				Actions: []hermes.Action{
					{
						Instructions: otp,
					},
				},
				Outros: []string{cuOutro},
			},
		},
	)
	log.Printf("Sending otp verification for user %s | ERRORS: %v", name, err)
}

func NewBookACallEmail(mailer Mailer, bookACall models.BookACall) {
	var err = mailer.Send(
		[]mail.Address{{Name: bookACall.Name, Address: bookACall.Email}},
		"Request to Book a Call from SUNShINE is Received!",
		hermes.Email{
			Body: hermes.Body{
				Name:   bookACall.Name,
				Intros: []string{bookACallIntro2},
				Dictionary: []hermes.Entry{
					{Key: "Name", Value: bookACall.Name},
					{Key: "Last Name", Value: bookACall.LastName},
					{Key: "Email", Value: bookACall.Email},
					{Key: "Phone Number", Value: bookACall.PhoneNumber},
					{Key: "Description", Value: bookACall.Description},
					{Key: "Menu Type:", Value: bookACall.MenuType},
					{Key: "Oss Admin:", Value: bookACall.OssAdminID},
				},
				Outros: []string{cuOutro},
			},
		},
	)
	log.Printf("Sending email for user %s after booking call | ERRORS: %v", bookACall.Email, err)
}

func NewBookACallOssAdminEmail(mailer Mailer, bookACall models.BookACall) {
	bookACallOss := fmt.Sprintf("Below are  the details of %s who has booked a call for %s Menu.\n", bookACall.Name, bookACall.MenuType)

	var err = mailer.Send(
		[]mail.Address{{Name: bookACall.OssAdminID, Address: bookACall.OssAdminID}},
		"OSS Admin! Request to Book A Call from Sunshine Received.",
		hermes.Email{
			Body: hermes.Body{
				Name:   bookACall.OssAdminID,
				Intros: []string{bookACallOss},
				Dictionary: []hermes.Entry{
					{Key: "User Name:", Value: bookACall.Name},
					{Key: "Last Name:", Value: bookACall.LastName},
					{Key: "User Email:", Value: bookACall.Email},
					{Key: "User Phone Number:", Value: bookACall.PhoneNumber},
					{Key: "Description Provided:", Value: bookACall.Description},
					{Key: "Menu Type:", Value: bookACall.MenuType},
					{Key: "Oss Admin:", Value: bookACall.OssAdminID},
				},
				Outros: []string{cuOutro},
			},
		},
	)
	log.Printf("Sending email for oss admin %s after booking call | ERRORS: %v", bookACall.OssAdminID, err)
}

func NewChatStartedEmail(mailer Mailer, replyMail models.ReplyMail) {
	topic := fmt.Sprintf("%v Sent you a new message about %v\n", replyMail.SenderName, replyMail.Topic)
	var err = mailer.Send(
		[]mail.Address{{Name: replyMail.OssAdminID, Address: replyMail.OssAdminID}},
		topic,
		hermes.Email{
			Body: hermes.Body{
				Name:   replyMail.OssAdminID,
				Intros: []string{newMessageIntro},
				Dictionary: []hermes.Entry{
					{Key: "Topic: ", Value: replyMail.Topic},
					{Key: "Message:", Value: replyMail.Message},
					{Key: "User Name:", Value: replyMail.SenderName},
					{Key: "User Email:", Value: replyMail.SenderEmail},
				},
				Outros: []string{cuOutro},
			},
		},
	)
	log.Printf("Sending email to oss admin for a new message from %s| ERRORS: %v", replyMail.SenderName, err)
}

func NewSendPdfEmail(mailer Mailer, sendMail models.SendMail) {
	sendMailBody := fmt.Sprintf("<h4>Hello %s!</h4><p>%v</p>.<i>Find attached the pdf details<i><p><b>Thank You and Welcome to Sunshine %s!</b></p>", sendMail.Name, sendMail.Details, sendMail.Name)

	msg := gomail.NewMessage()
	msg.SetHeader("From", "Sunshine-Mail-Service <sunshine.acmeuniverse@gmail.com>")
	msg.SetHeader("To", sendMail.Email)
	msg.SetHeader("Subject", sendMail.Subject)
	msg.SetBody("text/html", sendMailBody)
	msg.Attach(sendMail.PdfFile)
	msg.FormatAddress(sendMail.Email, sendMail.Name)

	n := gomail.NewDialer("smtp.gmail.com", 587, "sunshine.acmeuniverse@gmail.com", "pnhfgauqhsfulmcb")

	err := n.DialAndSend(msg)

	log.Printf("Sending email for user %s after registering | ERRORS: %v", sendMail.Email, err)
}

func ForgottenPasswordEmailCustom(mailer Mailer, sendMail models.SendMail, token uuid.UUID) {
	link := fmt.Sprintf("%s/reset_password/%s", mailer.URL(), token)
	data := TemplateData{sendMail.Name, link}

	msg := gomail.NewMessage()
	msg.SetHeader("From", "Sunshine-Mail-Service <sunshine.acmeuniverse@gmail.com>")
	msg.SetHeader("To", sendMail.Email)
	msg.SetHeader("Subject", sendMail.Subject)
	msg.SetBody("text/html", GetPassResetHtml(data))
	msg.FormatAddress(sendMail.Email, sendMail.Name)

	n := gomail.NewDialer("smtp.gmail.com", 587, "sunshine.acmeuniverse@gmail.com", "pnhfgauqhsfulmcb")

	err := n.DialAndSend(msg)

	log.Printf("Sending email for user %s for password reset | ERRORS: %v", sendMail.Email, err)
}

func NewUserEmailCustom(mailer Mailer, user models.User, token uuid.UUID) {
	link := fmt.Sprintf("%s/confirm_user/%s", mailer.URL(), token)
	data := TemplateData{user.Name, link}

	msg := gomail.NewMessage()
	msg.SetHeader("From", "Sunshine-Mail-Service <sunshine.acmeuniverse@gmail.com>")
	msg.SetHeader("To", user.Email)
	msg.SetHeader("Subject", "Welcome to SUNShINE!")
	msg.SetBody("text/html", GetConfirmEmailHTML(data))
	msg.FormatAddress(user.Email, user.Name)

	n := gomail.NewDialer("smtp.gmail.com", 587, "sunshine.acmeuniverse@gmail.com", "pnhfgauqhsfulmcb")

	err := n.DialAndSend(msg)

	log.Printf("Sending email for user %s for email confirmation | ERRORS: %v", user.Email, err)
}
