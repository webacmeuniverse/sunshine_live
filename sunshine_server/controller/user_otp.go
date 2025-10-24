package controller

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
	"github.com/google/uuid"
	"github.com/gorilla/sessions"
)

type UserOtp struct {
	st stores.Store
	ss sessions.Store
	ts stores.TokenStore
	m  services.Mailer
	n  stores.Notifier
	pf stores.Portfolio
	uc User

	uploadPath string
	country    models.Country
}

func NewUserOtp(env *services.Env) *UserOtp {
	return &UserOtp{
		st:         env.UserOtp,
		ss:         env.SessionStore,
		ts:         env.TokenStore,
		m:          env.Mailer,
		n:          env.Notifier,
		pf:         env.Portfolio,
		uploadPath: env.Paths.Uploads,
		uc:         *NewUser(env),
		country:    "Latvia",
	}
}

func (uo *UserOtp) SendVerification(ctx context.Context, email, name, otp string) error {

	go services.SendOtpVerification(uo.m, email, name, otp)

	return nil
}

func (uo *UserOtp) SendOTP(ctx context.Context, r io.Reader) (*models.UserOtp, error) {
	var mail EmailRequest
	if err := json.NewDecoder(r).Decode(&mail); err != nil {
		return nil, ErrBadInput
	}
	doc, _, err := uo.uc.GetByEmail(ctx, mail.Email)
	if err != nil {
		if err.Error() == "record not found" {
			return nil, errors.New(fmt.Sprintf("Did not find any user with email: %s", err.Error()))
		}
		return nil, err
	}
	if doc == nil {
		return nil, ErrNotFound
	}

	if err := uo.Deactivate(mail.Email); err != nil {
		return nil, err
	}

	otp := GeneratePassword(6, 0, 6, 0)
	userOtp := models.UserOtp{
		UserID: mail.Email,
		Token:  otp,
		Active: true,
	}

	_, err1 := uo.st.Create(ctx, sanitizeEntityFields(&userOtp))
	if err1 != nil {
		return nil, err1
	}
	uo.SendVerification(ctx, mail.Email, doc.Data.(*models.User).Name, otp)
	return &userOtp, nil
}

func (uo *UserOtp) ConfirmOTP(w http.ResponseWriter, r *http.Request) (*models.Document, error) {
	var (
		ctx     context.Context = r.Context()
		query   url.Values      = r.URL.Query()
		userOtp models.UserOtp
	)
	email := query.Get("email")
	otp := query.Get("otp")

	if err := uo.st.DB().Where("user_id = ?", email).Where("token = ?", otp).First(&userOtp).Error; err != nil {
		return nil, errors.New("User email and/or OTP not found.")
	}
	if !userOtp.Active {
		return nil, errors.New(fmt.Sprintf("OTP [%s] is not active. Did you create a newer one for user: '%s'", otp, email))
	}
	doc, _, err := uo.uc.GetByEmail(ctx, email)
	if err := uo.SignIn(w, r, doc.ID); err != nil {
		return nil, err
	}
	return doc, err
}

func (uo *UserOtp) SignIn(w http.ResponseWriter, r *http.Request, userID uuid.UUID) error {
	token, err := uo.ts.Create(r.Context(), models.SessionToken, userID)
	if err != nil {
		return errors.New("Failed to create session token")
	}

	// Remove any left-over cookie.
	w.Header().Del("Set-Cookie")

	// Encode and write session.
	s := services.Session(uo.ss, r)
	s.Values["id"] = token.ID
	s.Values["uuid"] = userID
	services.SaveSession(s, r, w)
	return nil
}

func (uo *UserOtp) Deactivate(email string) error {
	var usrOtp models.UserOtp
	if err := uo.st.DB().Where("user_id = ?", email).First(&usrOtp).Error; err != nil && err.Error() != "record not found" {
		return err
	}
	usrOtp.Active = false
	if err := uo.st.DB().Save(&usrOtp).Error; err != nil {
		return err
	}
	return nil
}
