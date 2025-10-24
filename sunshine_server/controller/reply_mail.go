package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"io"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/google/uuid"
)

type ReplyMail struct {
	st      stores.Store
	m       services.Mailer
	country models.Country
}

func NewReplyMail(env *services.Env) *ReplyMail {
	return &ReplyMail{
		st:      env.ReplyMailStore,
		m:       env.Mailer,
		country: "Latvia",
	}
}

func (rm *ReplyMail) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var replyMail models.ReplyMail

	if err := json.NewDecoder(rc).Decode(&replyMail); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateReplyMail, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	doc, err := rm.st.Create(ctx, sanitizeEntityFields(&replyMail))
	if err != nil {
		return nil, err
	}
	services.NewChatStartedEmail(rm.m, replyMail)

	return doc, nil
}

func (rm *ReplyMail) Get(ctx context.Context, rc io.ReadCloser) ([]models.ReplyMail, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		msgs    []models.ReplyMail
		mailReq EmailRequest
	)
	if err := json.NewDecoder(rc).Decode(&mailReq); err != nil {
		return nil, fmt.Errorf("%v: %v", ErrBadInput, err)
	}
	if !Can(ctx, GetReplyMail, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	if err := rm.st.DB().Where("sender_email = ?", mailReq.Email).Find(&msgs).Error; err != nil {
		return nil, ErrNotFound
	}

	return msgs, nil
}

func (rm *ReplyMail) Update(ctx context.Context, rmID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	doc, err := rm.st.Get(ctx, rmID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateReplyMail, rmID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	new := *doc.Data.(*models.ReplyMail)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	new.ID = rmID
	doc.Data = &new

	_, err = rm.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}
	return rm.st.Unwrap(ctx, rmID)
}

func (rm *ReplyMail) List(ctx context.Context, filter stores.Filter) ([]models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, ListReplyMail, uuid.Nil, cv.User.Country) {
		return nil, nil, 0, ErrUnauthorized
	}
	return rm.st.ListByOssAdminID(ctx, filter)
}

func (rm *ReplyMail) NextIndex(ctx context.Context, filter stores.Filter) (*int, error) {
	docs, _, _, err := rm.List(ctx, filter)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (rm *ReplyMail) DeleteReplyMail(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	doc, err := rm.st.Get(ctx, uid)
	if err != nil {
		return err
	}
	if !Can(ctx, DeleteReplyMail, uid, cv.User.Country) {
		return ErrUnauthorized
	}
	return rm.st.Delete(ctx, doc)
}

func (rm *ReplyMail) FetchReplyMail(ctx context.Context, ids []uuid.UUID) ([]models.ReplyMail, error) {
	var result []models.ReplyMail
	return result, rm.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
