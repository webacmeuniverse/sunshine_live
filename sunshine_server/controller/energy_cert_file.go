package controller

import (
	"context"
	"os"
	"path/filepath"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
	"github.com/google/uuid"
)

type EnergyCertFile struct {
	st       stores.Store
	notifier stores.Notifier
}

func NewEnergyCertFile(env *services.Env) *EnergyCertFile {
	return &EnergyCertFile{
		st:       env.EnergyCertFileStore,
		notifier: env.Notifier,
	}
}

func (ecf *EnergyCertFile) Create(ctx context.Context, detailsID uuid.UUID, form RequestForm) error {
	fileName := form.FileHeader.Filename
	uploadPath := filepath.Join("/uploads", detailsID.String())
	path, _ := os.Getwd()
	dirPath := filepath.Join(path, uploadPath)
	certFile := models.EnergyCertFile{
		DetailsID: detailsID.String(),
		FileURL:   uploadPath + "/" + fileName,
		FileName:  fileName,
	}
	if err := ecf.DeleteExisting(&certFile); err != nil {
		return err
	}
	println("dir path:", dirPath)
	if err := os.Mkdir(dirPath, os.ModePerm); err != nil {
		return err
	}
	println("file-name:", fileName)
	doc, err := ecf.st.Create(ctx, &certFile)
	if err != nil {
		return err
	}
	// if !a.can(ctx, UploadAsset, *doc.Data.(*models.Asset)) {
	// 	return ErrUnauthorized
	// }
	if err := uploadFile(ctx, ecf.st, ecf.notifier, form, doc, dirPath); err != nil {
		return err
	}
	return nil
}

func (ecf *EnergyCertFile) Get(ctx context.Context, detailsID uuid.UUID) (*models.Document, error) {
	certFile, err := ecf.GetCert(detailsID.String())
	if err != nil {
		return nil, err
	}
	return models.Wrap(certFile), nil
}

func (ecf *EnergyCertFile) GetCert(detailsID string) (*models.EnergyCertFile, error) {
	var certFile models.EnergyCertFile
	if err := ecf.st.DB().Where("details_id = ?", detailsID).First(&certFile).Error; err != nil {
		return nil, err
	}
	return &certFile, nil
}

func (ecf *EnergyCertFile) GetFile(ctx context.Context, detailsID uuid.UUID, filename string) (*os.File, error) {
	path, err := os.Getwd()
	if err != nil {
		return nil, err
	}
	dirPath := filepath.Join(path, "uploads", detailsID.String())
	return os.Open(filepath.Join(dirPath, filename))
}

func (ecf *EnergyCertFile) DeleteExisting(cert *models.EnergyCertFile) error {
	path, _ := os.Getwd()
	dirPath := filepath.Join(path, "uploads", cert.DetailsID)
	if err := os.RemoveAll(dirPath); err != nil {
		return err
	}
	// if _, err := os.Stat(uploadPath); errors.Is(err, os.ErrNotExist) || errors.Is(err, os.ErrExist) {}
	return ecf.st.DB().Unscoped().Where("details_id = ?", cert.DetailsID).Delete(models.EnergyCertFile{}).Error
}

func (ecf *EnergyCertFile) DeleteEnergyCertFile(ctx context.Context, detailsID uuid.UUID) error {
	cert, err := ecf.GetCert(detailsID.String())
	if err != nil {
		return ErrNotFound
	}
	path, _ := os.Getwd()
	dirPath := filepath.Join(path, "uploads", detailsID.String())
	// fmt.Printf("energy cert file to delete: %v\n", dirPath)
	if err := os.RemoveAll(dirPath); err != nil {
		return err
	}
	// println("file deleted")
	return ecf.st.Delete(ctx, models.Wrap(cert))
}
