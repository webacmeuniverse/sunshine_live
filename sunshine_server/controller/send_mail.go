package controller

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/url"
	"os"
	"path"
	"strings"
	"sync"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/google/uuid"
)

type SendMail struct {
	st         stores.Store
	m          services.Mailer
	uploadPath string
	country    models.Country
}

func NewSendMail(env *services.Env) *SendMail {
	return &SendMail{
		st:         env.SendMailStore,
		m:          env.Mailer,
		uploadPath: env.Paths.PdfUploads,
		country:    "Latvia",
	}
}

func (sm *SendMail) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	wg := sync.WaitGroup{}
	var (
		sendMail models.SendMail
		fName    string
		filePath string
	)
	if err := json.NewDecoder(rc).Decode(&sendMail); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	dec, errD := base64.StdEncoding.DecodeString(sendMail.PdfFile)
	if errD != nil {
		return nil, errD
	}
	fName = fmt.Sprintf("%s.pdf", strings.Split(sendMail.Email, "@")[0])

	filePath = path.Join(path.Join("data/pdfs/", fName))

	f, errC := os.Create(filePath)
	if errC != nil {
		return nil, errC
	}
	defer f.Close()
	if _, errF := f.Write(dec); errF != nil {
		return nil, errF
	}
	if errS := f.Sync(); errS != nil {
		return nil, errS
	}

	sendMail.PdfFile = filePath

	doc, err := sm.st.Create(ctx, sanitizeEntityFields(&sendMail))
	if err != nil {
		return nil, err
	}

	wg.Add(1)
	go func() {
		defer wg.Done()
		services.NewSendPdfEmail(sm.m, sendMail)
	}()

	wg.Wait()
	return doc, nil
}

func (sm *SendMail) Get(ctx context.Context, smID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	_, err := sm.st.Get(ctx, smID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	return sm.st.Unwrap(ctx, smID)
}

func (sm *SendMail) Update(ctx context.Context, smID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	doc, err := sm.st.Get(ctx, smID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	new := *doc.Data.(*models.SendMail)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	doc.Data = &new

	_, err = sm.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}

	return sm.st.Unwrap(ctx, smID)
}

func (sm *SendMail) List(ctx context.Context, filter stores.Filter, query url.Values) ([]models.Document, stores.Dependencies, int, error) {
	return sm.st.List(ctx, filter)
}

func (sm *SendMail) NextIndex(ctx context.Context, filter stores.Filter, query url.Values) (*int, error) {
	docs, _, _, err := sm.List(ctx, filter, query)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (sm *SendMail) DeleteSendMail(ctx context.Context, smID uuid.UUID) error {
	doc, err := sm.st.Get(ctx, smID)
	if err != nil {
		return ErrNotFound
	}

	return sm.st.Delete(ctx, doc)
}

func (sm *SendMail) UploadFile(ctx context.Context, uid uuid.UUID, form RequestForm) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, UploadUser, uid, cv.User.Country) {
		return ErrUnauthorized
	}

	err := uploadPdfFile(ctx, sm.st, form, uuid.New(), sm.uploadPath)
	if err != nil {
		return err
	}
	return nil
}
