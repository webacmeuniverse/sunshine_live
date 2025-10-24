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

type OssEesResultTbl2YearFormula struct {
	st      stores.Store
	country models.Country
}

func NewOssEesResultTbl2YearFormula(env *services.Env) *OssEesResultTbl2YearFormula {
	return &OssEesResultTbl2YearFormula{
		st:      env.OssEesResultTbl2YearFormulaStore,
		country: "Latvia",
	}
}

func (oert2yf *OssEesResultTbl2YearFormula) Create(ctx context.Context, rc io.ReadCloser, uid uuid.UUID) (*models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		ossEesResultTbl2yf models.OssEesResultTbl2YearFormula
	)

	if err := json.NewDecoder(rc).Decode(&ossEesResultTbl2yf); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateOssEesYearFormula, uid, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	ossEesResultTbl2yf.ResultID = uid

	doc, err := oert2yf.st.Create(ctx, sanitizeEntityFields(&ossEesResultTbl2yf))
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func (oert2yf *OssEesResultTbl2YearFormula) List(ctx context.Context, filter stores.Filter) ([]models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)

	if !cv.Authorized() {
		return nil, nil, 0, ErrUnauthorized
	}

	docs, deps, n, err := oert2yf.st.List(ctx, filter)

	return docs, deps, n, err
}

func (oert2yf *OssEesResultTbl2YearFormula) NextIndex(ctx context.Context, filter stores.Filter) (*int, error) {
	docs, _, _, err := oert2yf.List(ctx, filter)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (oert2 *OssEesResultTbl2YearFormula) AddResultSubitems(ctx context.Context, rc io.ReadCloser, resID uuid.UUID) ([]models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		getReq         []InsertManyRequest
		resultSubItems []models.OssEesResultTbl2YearFormula
		results        []models.Document
	)
	if err := json.NewDecoder(rc).Decode(&getReq); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateOssEesYearFormula, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	for _, req := range getReq {
		yearForm := models.OssEesResultTbl2YearFormula{
			ResultID:  resID,
			FieldID:   req.FieldID,
			FieldName: req.FieldName,
			Lang:      req.Lang,
		}
		_res, err := oert2.AddIndex(yearForm)
		if err != nil {
			return nil, err
		}
		if err := oert2.SaveSubitem(*_res); err != nil {
			return nil, err
		}
		fmt.Printf("saved sub-item: %v\n", _res)
		results = append(results, *models.Wrap(_res))
	}
	msg := SuccessMessage{Message: fmt.Sprintf("%d Result sub-items saved.", len(resultSubItems))}
	println(msg.Message)
	return results, nil
}

func (oert2 *OssEesResultTbl2YearFormula) AddIndex(res models.OssEesResultTbl2YearFormula) (*models.OssEesResultTbl2YearFormula, error) {
	var (
		yearForms []models.OssEesResultTbl2YearFormula
	)

	if err := oert2.st.DB().Where("result_id = ?", res.ResultID).Find(&yearForms).Error; err != nil {
		return nil, err
	}

	res.Index = int64(len(yearForms))

	return &res, nil

}

func (oert2 *OssEesResultTbl2YearFormula) SaveSubitem(res models.OssEesResultTbl2YearFormula) error {
	println("saving sub-item")
	if err := oert2.st.DB().Save(&res).Error; err != nil {
		return err
	}
	println("sub-item saved.")
	return nil
}

func (oert2yf *OssEesResultTbl2YearFormula) DeleteOssEesResultYearFormula(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	doc, err := oert2yf.st.Get(ctx, uid)
	if err != nil {
		return err
	}
	if !Can(ctx, DeleteOssEesYearFormula, uid, cv.User.Country) {
		return ErrUnauthorized
	}

	return oert2yf.st.Delete(ctx, doc)
}
