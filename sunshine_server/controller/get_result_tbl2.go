package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"io"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
	"github.com/Pramod-Devireddy/go-exprtk"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

type GetResultTbl2 struct {
	st                 stores.Store
	country            models.Country
	before, after      string
	yr, selectYr       string
	noVal, perc, chars string
}

func NewGetResultTbl2(env *services.Env) *GetResultTbl2 {
	return &GetResultTbl2{
		st:       env.GetResultTbl2Store,
		country:  "Latvia",
		before:   "Before",
		after:    "After",
		yr:       "year",
		selectYr: "selected_year",
		noVal:    "0",
		perc:     "/100",
		chars:    "(+-/*%)",
	}
}

func (grt2 *GetResultTbl2) Create(ctx context.Context, rc io.ReadCloser) (*[]models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		getReq            GetResTblRequest
		usrBaseDets       models.UserBasicDetails
		ossEssResultTbl2s []models.OssEesResultTbl2
		docs              []models.Document
	)
	if err := json.NewDecoder(rc).Decode(&getReq); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateGetResTbl2, uuid.Nil, grt2.country) {
		return nil, ErrUnauthorized
	}
	if err := grt2.st.DB().Where("id = ?", getReq.BasicDetailsID).First(&usrBaseDets).Error; err != nil {
		return nil, err
	}

	usrBaseDets.TotalYear = getReq.TotalYear

	if err := grt2.st.DB().Where("is_default_template = '0'").Where("lang = ?", usrBaseDets.Lang).Where("oss_admin_id = ?", usrBaseDets.OssAdminID).Find(&ossEssResultTbl2s).Error; err != nil {
		return nil, err
	}
	if err := grt2.RemoveExisting(ctx, &usrBaseDets); err != nil {
		return nil, err
	}

	for _, res := range ossEssResultTbl2s {
		docChan := make(chan models.Document)
		errChan := make(chan error)

		defer close(docChan)
		defer close(errChan)

		go func() {
			doc, err := grt2.CreateResult(ctx, res, usrBaseDets)
			if err != nil {
				errChan <- err
				return
			}
			docChan <- doc

		}()
		select {
		case err := <-errChan:
			println("From errors channel:", err.Error())
		case res := <-docChan:
			docs = append(docs, res)
		}
	}
	return &docs, nil
}

func (grt2 *GetResultTbl2) RemoveExisting(ctx context.Context, details *models.UserBasicDetails) error {
	var results models.GetResultTbl2
	if err := grt2.st.DB().Unscoped().Where("session = ?", details.Session).Where("oss_admin_id = ?", details.OssAdminID).Delete(&results).Error; err != nil {
		return err
	}
	return nil
}

func (grt2 *GetResultTbl2) CreateResult(ctx context.Context, res models.OssEesResultTbl2, req models.UserBasicDetails) (models.Document, error) {
	var (
		ossEssResultTbl2YearFormulas []models.OssEesResultTbl2YearFormula
		getResultTbl2                models.GetResultTbl2
		resStr                       string
		_doc                         models.Document
	)
	if err := grt2.st.DB().Order("created_at ASC").Where("lang = ?", req.Lang).Where("result_id = ?", res.ID).Find(&ossEssResultTbl2YearFormulas).Error; err != nil {
		return _doc, err
	}
	for _, formula := range ossEssResultTbl2YearFormulas {
		resStr += grt2.GenerateString(&formula, &req)
	}
	getResultTbl2.ID = uuid.New()
	getResultTbl2.TableType = res.TableType
	getResultTbl2.ResultTitle = res.ResultTitle
	getResultTbl2.Lang = res.Lang
	getResultTbl2.OssAdminID = res.OssAdminID
	getResultTbl2.Session = req.Session

	if res.TableType == grt2.before {
		for key := 1; key <= int(req.BeforeRenovationYear); key++ {
			yearValue, err := grt2.YearValue(key, int(req.BeforeRenovationYear), resStr, &getResultTbl2)
			if err != nil {
				return _doc, err
			}
			getResultTbl2.YearValue = append(getResultTbl2.YearValue, yearValue)
		}
	} else if res.TableType == grt2.after {
		for key := 1; key <= int(req.AfterRenovationYear); key++ {
			yearValue, err := grt2.YearValue(key, int(req.AfterRenovationYear), resStr, &getResultTbl2)
			if err != nil {
				return _doc, err
			}
			getResultTbl2.YearValue = append(getResultTbl2.YearValue, yearValue)
		}
	}

	doc, err := grt2.st.Create(ctx, sanitizeEntityFields(&getResultTbl2))
	if err != nil {
		return _doc, err
	}
	return *doc, nil
}

func (grt2 *GetResultTbl2) YearValue(key, year int, resStr string, res *models.GetResultTbl2) (models.YearValue, error) {
	var (
		yearValue models.YearValue
	)
	exprtkObj := exprtk.NewExprtk()
	defer exprtkObj.Delete()

	exprtkObj.SetExpression(resStr)

	exprtkObj.AddDoubleVariable(grt2.yr)
	exprtkObj.AddDoubleVariable(grt2.selectYr)

	err := exprtkObj.CompileExpression()
	if err != nil {
		yearValue.Value = grt2.noVal
	} else {
		exprtkObj.SetDoubleVariableValue(grt2.yr, float64(key))
		exprtkObj.SetDoubleVariableValue(grt2.selectYr, float64(year))
		yearValue.Value = fmt.Sprintf("%.2f", exprtkObj.GetEvaluatedValue())
	}

	yearValue.Year = fmt.Sprint(key)

	yearValue.Lang = res.Lang
	yearValue.ResultID = res.ID

	if errC := grt2.st.DB().Save(&yearValue).Error; errC != nil {
		return yearValue, errC
	}
	return yearValue, nil
}

func (grt2 *GetResultTbl2) GenerateString(formula *models.OssEesResultTbl2YearFormula, req *models.UserBasicDetails) string {
	var (
		resStr string
	)
	switch formula.FieldID { // "(+-/*%)"
	case string(grt2.chars[0]):
		resStr += formula.FieldName
	case grt2.yr:
		resStr += formula.FieldName
	case string(grt2.chars[1]):
		resStr += formula.FieldName
	case string(grt2.chars[2]):
		resStr += formula.FieldName
	case string(grt2.chars[3]):
		resStr += formula.FieldName
	case string(grt2.chars[4]):
		resStr += formula.FieldName
	case string(grt2.chars[5]):
		resStr += grt2.perc
	case string(grt2.chars[6]):
		resStr += formula.FieldName
	default:
		res := grt2.GetDigitValue(formula.FieldID, req.Lang, req.ID)
		resStr += *res
	}
	return resStr

}

func (grt2 *GetResultTbl2) GetDigitValue(fieldID string, lang string, ubdID uuid.UUID) *string {
	var (
		userResultCalcFields models.UserResultCalculation
	)
	fmt.Printf(" ... ")
	_, _err := uuid.Parse(fieldID)
	if _err != nil {
		return &fieldID
	}
	if err := grt2.st.DB().Order("created_at ASC").Where("ees_field_id = ?", fieldID).Where("lang = ?", lang).Where("user_basic_details_id = ?", ubdID).Find(&userResultCalcFields).Error; err != nil {
		return &grt2.noVal
	}

	value := userResultCalcFields.EesFieldValue
	if value == "" {
		return &grt2.noVal
	}
	return &value
}

func (grt2 *GetResultTbl2) CreateYearValue(ctx context.Context, rc io.ReadCloser, resID uuid.UUID) (*models.GetResultTbl2, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		getResultTbl2 models.GetResultTbl2
		yearValue     models.YearValue
	)
	if !Can(ctx, CreateGetResTbl2, resID, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	yearValue.ResultID = resID

	if err := json.NewDecoder(rc).Decode(&yearValue); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if err := grt2.st.DB().Save(&yearValue).Error; err != nil {
		return nil, err
	}

	if err := grt2.st.DB().Where("id = ?", yearValue.ResultID).First(&getResultTbl2).Error; err != nil {
		return nil, err
	}

	getResultTbl2.YearValue = append(getResultTbl2.YearValue, yearValue)

	return &getResultTbl2, nil
}

func (grt2 *GetResultTbl2) Get(ctx context.Context, urbID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	_, err := grt2.st.Get(ctx, urbID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, GetGetResTbl2, urbID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	return grt2.st.Unwrap(ctx, urbID)
}

func (grt2 *GetResultTbl2) Update(ctx context.Context, urbID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	doc, err := grt2.st.Get(ctx, urbID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateGetResTbl2, urbID, doc.Data.(*models.User).Country) {
		return nil, nil, ErrUnauthorized
	}
	new := *doc.Data.(*models.GetResultTbl2)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	doc.Data = &new

	_, err = grt2.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}
	result, deps, err := grt2.st.Unwrap(ctx, urbID)

	return result, deps, err
}

func (grt2 *GetResultTbl2) List(ctx context.Context, filter stores.Filter) ([]models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, ListGetResTbl2, uuid.Nil, cv.User.Country) {
		return nil, nil, 0, ErrUnauthorized
	}

	docs, deps, n, err := grt2.st.List(ctx, filter)

	return docs, deps, n, err
}

func (grt2 *GetResultTbl2) NextIndex(ctx context.Context, filter stores.Filter) (*int, error) {
	docs, _, _, err := grt2.List(ctx, filter)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (grt2 *GetResultTbl2) DeleteGetResult(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}

	doc, err := grt2.st.Get(ctx, uid)
	if err != nil {
		return err
	}
	if !Can(ctx, DeleteGetResTbl2, uid, cv.User.Country) {
		return ErrUnauthorized
	}

	getResultsTbl2, _ := grt2.YearValueList(grt2.st.DB(), doc.Data.(*models.GetResultTbl2).ID)
	for _, result := range getResultsTbl2 {
		_ = grt2.DeleteGetResultYearValue(ctx, result.ID)
	}

	return grt2.st.Delete(ctx, doc)
}

func (grt2 *GetResultTbl2) YearValueList(db *gorm.DB, resultID uuid.UUID) ([]models.YearValue, error) {

	var yearValueList []models.YearValue
	if err := grt2.st.DB().Where("result_id = ?", resultID).Find(&yearValueList).Error; err != nil {
		return nil, err
	}
	return yearValueList, nil
}

func (grt2 *GetResultTbl2) DeleteGetResultYearValue(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	yearValue := models.YearValue{
		ID: uid,
	}
	if err := grt2.st.DB().Where("id = ?", uid).First(&yearValue).Error; err != nil {
		return ErrNotFound
	}
	if !Can(ctx, DeleteGetResTbl2, uid, cv.User.Country) {
		return ErrUnauthorized
	}
	return grt2.st.DB().Delete(&yearValue).Error
}
