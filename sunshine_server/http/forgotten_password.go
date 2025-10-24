package http

import (
	"io"
	"net/http"
	"strings"
	"unicode"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/sentry"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"gopkg.in/go-playground/validator.v9"
)

type authfp struct {
	m  services.Mailer
	us stores.Store
	ts stores.TokenStore

	validate *validator.Validate
}

func newAuthfp(env *services.Env) *authfp {
	return &authfp{
		m:  env.Mailer,
		us: env.UserStore,
		ts: env.TokenStore,

		validate: env.Validator,
	}
}

func (a *authfp) declare(w http.ResponseWriter, r *http.Request) {
	var (
		body, _ = io.ReadAll(r.Body)
		email   = strings.TrimFunc(string(body), isSpaceOrQuote)
	)

	if a.validate.Var(email, "required,email") != nil {
		http.Error(w, "not an email", http.StatusBadRequest)
		return
	}

	doc, err := a.us.GetByIndex(r.Context(), email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	token, err := a.ts.Create(r.Context(), models.ResetPwdToken, doc.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		sentry.Report(err, "Failed to create ResetPwdToken", sentry.CaptureRequest(r))
		return
	}

	user := doc.Data.(*models.User)

	sendMail := models.SendMail{
		Name:    user.Name,
		Email:   user.Email,
		Subject: "Forgotten Password",
		Details: token.ID.String(),
	}

	go services.ForgottenPasswordEmailCustom(a.m, sendMail, token.ID)
}

func (a *authfp) confirm(w http.ResponseWriter, r *http.Request) {
	var id = mustExtractUUID(r)

	if _, err := a.ts.Get(r.Context(), models.ResetPwdToken, id); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
}

func (a *authfp) change(w http.ResponseWriter, r *http.Request) {
	var (
		id       = mustExtractUUID(r)
		body, _  = io.ReadAll(r.Body)
		password = strings.TrimFunc(string(body), isSpaceOrQuote)
	)
	token, err := a.ts.Get(r.Context(), models.ResetPwdToken, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	udoc, err := a.us.Get(r.Context(), token.UserID)
	if err != nil {
		http.Error(w, "invalid token", http.StatusBadRequest)
		return
	}

	if err := a.ts.Invalidate(r.Context(), models.ResetPwdToken, id); err != nil {
		// can't invalidate the token which means something is wrong
		// it's better to fail than leave a gaping security hole
		http.Error(w, "invalid token", http.StatusInternalServerError)
		sentry.Report(err, "Failed to invalidate token", sentry.CaptureRequest(r))
		return
	}

	if err := udoc.Data.(*models.User).SetPassword(password); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		sentry.Report(err, "Failed to set user password", sentry.CaptureRequest(r))
		return
	}

	if _, err := a.us.Update(r.Context(), udoc); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		sentry.Report(err, "Failed to update user", sentry.CaptureRequest(r))
		return
	}
}

func isSpaceOrQuote(r rune) bool {
	return unicode.IsSpace(r) || unicode.Is(unicode.Quotation_Mark, r)
}
