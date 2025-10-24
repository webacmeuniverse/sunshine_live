package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"sort"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
	"github.com/google/uuid"
)

type OssEesResultTbl2 struct {
	st        stores.Store
	yearForms []models.OssEesResultTbl2YearFormula
	country   models.Country
}

func NewOssEesResultTbl2(env *services.Env) *OssEesResultTbl2 {
	return &OssEesResultTbl2{
		st:      env.OssEesResultTbl2Store,
		country: "Latvia",
	}
}

func (oert2 *OssEesResultTbl2) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		ossEesResultTbl2 models.OssEesResultTbl2
	)

	if err := json.NewDecoder(rc).Decode(&ossEesResultTbl2); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateOssEesResTbl2, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	doc, err := oert2.st.Create(ctx, sanitizeEntityFields(&ossEesResultTbl2))
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func (oert2 *OssEesResultTbl2) Get(ctx context.Context, urbID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	_, err := oert2.st.Get(ctx, urbID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, GetOssEesResTbl2, urbID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	return oert2.st.Unwrap(ctx, urbID)
}

func (oert2 *OssEesResultTbl2) Update(ctx context.Context, urbID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	doc, err := oert2.st.Get(ctx, urbID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateOssEesResTbl2, urbID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	new := *doc.Data.(*models.OssEesResultTbl2)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	doc.Data = &new

	_, err = oert2.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}
	result, deps, err := oert2.st.Unwrap(ctx, urbID)

	return result, deps, err
}

func (oert2 *OssEesResultTbl2) ListDefaults(allLangs bool, lang string) ([]models.OssEesResultTbl2, error) {
	var results []models.OssEesResultTbl2
	if allLangs {
		if err := oert2.st.DB().Order("created_at ASC").Where("is_default_template = '1'").Find(&results).Error; err != nil {
			return nil, err
		}
	} else {
		if err := oert2.st.DB().Order("created_at ASC").Where("is_default_template = '1'").Where("lang = ?", lang).Find(&results).Error; err != nil {
			return nil, err
		}
	}
	fmt.Printf("%d results found.\n", len(results))
	return results, nil
}

func (oert2 *OssEesResultTbl2) List(ctx context.Context, r io.ReadCloser) ([]models.OssEesResultTbl2, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		getReq  TepmlateRequest
		results []models.OssEesResultTbl2
	)
	if err := json.NewDecoder(r).Decode(&getReq); err != nil {
		return nil, err
	}
	if !Can(ctx, ListOssEesResTbl2, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	if getReq.IsDefaultTemplate == 0 {
		var _results []models.OssEesResultTbl2
		if err := oert2.st.DB().Order("created_at ASC").Where("oss_admin_id = ?", getReq.OssAdminID).Where("is_default_template = ?", getReq.IsDefaultTemplate).Where("lang = ?", getReq.Lang).Find(&results).Error; err != nil {
			return nil, err
		}
		for _, res := range results {
			_res := oert2.addYearFormulas(res)
			_results = append(_results, _res)
		}
		return _results, nil
	} else {
		var _results []models.OssEesResultTbl2
		if err := oert2.st.DB().Order("created_at ASC").Where("is_default_template = ?", getReq.IsDefaultTemplate).Where("lang = ?", getReq.Lang).Find(&results).Error; err != nil {
			return nil, err
		}
		for _, res := range results {
			_res := oert2.addYearFormulas(res)
			_results = append(_results, _res)
		}
		return _results, nil
	}
}

func (oert2 *OssEesResultTbl2) addYearFormulas(result models.OssEesResultTbl2) models.OssEesResultTbl2 {
	yearFormulas, err := oert2.YearFormulaList(result.ID)
	if err != nil {
		return result
	}

	oert2.yearForms = yearFormulas

	sort.Slice(oert2.yearForms, oert2.SortIndex)

	result.YearFormula = oert2.yearForms

	oert2.yearForms = []models.OssEesResultTbl2YearFormula{}

	return result
}

func (oert2 *OssEesResultTbl2) SortIndex(i, j int) bool {
	return oert2.yearForms[i].Index < oert2.yearForms[j].Index
}

func (oert2 *OssEesResultTbl2) ListByOssAdmin(ctx context.Context, ossAdminID string) ([]models.OssEesResultTbl2, error) {
	var tbls []models.OssEesResultTbl2
	if err := oert2.st.DB().Where("oss_admin_id = ?", ossAdminID).Find(&tbls).Error; err != nil {
		return nil, err
	}
	return tbls, nil
}

func (oert2 *OssEesResultTbl2) MakeDocs(results []models.OssEesResultTbl2) []models.Document {
	docs := make([]models.Document, len(results))
	for i, v := range results {
		d := models.Wrap(v)
		docs[i] = *d
	}
	return docs
}

func (oert2 *OssEesResultTbl2) DeleteOssEesResult(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	doc, err := oert2.st.Get(ctx, uid)
	if err != nil {
		return err
	}
	if !Can(ctx, DeleteOssEesResTbl2, uid, cv.User.Country) {
		return ErrUnauthorized
	}
	yearFormulas, _ := oert2.YearFormulaList(uid)
	for _, yearF := range yearFormulas {
		_ = oert2.DeleteYearFormula(ctx, yearF.ID)
	}

	return oert2.st.Delete(ctx, doc)
}

func (oert2 *OssEesResultTbl2) DeleteYearFormula(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, DeleteOssEesResTbl2, uid, cv.User.Country) {
		return ErrUnauthorized
	}
	return oert2.st.DB().Where("id = ?", uid).Delete(&models.OssEesResultTbl2YearFormula{}).Error
}

func (oert2 *OssEesResultTbl2) YearFormulaList(resultID uuid.UUID) ([]models.OssEesResultTbl2YearFormula, error) {

	var (
		yearFormulaList []models.OssEesResultTbl2YearFormula
	)
	if err := oert2.st.DB().Order("created_at ASC").Where("result_id = ?", resultID).Find(&yearFormulaList).Error; err != nil {
		return nil, err
	}
	return yearFormulaList, nil
}
