package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"sync"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
	"github.com/Pramod-Devireddy/go-exprtk"
	"github.com/google/uuid"
)

type GetResultTbl1 struct {
	st stores.Store
	cs stores.Store

	costVatXcl  string
	costVatInc  string
	totalVatXcl string
	totalVatInc string

	expresionFailed string
	noCalc          string
	noValue         string
	perc            string
	chars           string
	notFound        string

	basicDetails     models.UserBasicDetails
	stepsResultArr   []models.StepsResult
	getResultTbl1    models.GetResultTbl1
	getResultTbl1Arr []models.GetResultTbl1
	docs             []models.Document

	wg         sync.WaitGroup
	errorsChan chan error
	docsChan   chan models.Document
	calc       exprtk.GoExprtk
	country    models.Country
}

func NewGetResultTbl1(env *services.Env) *GetResultTbl1 {

	return &GetResultTbl1{
		st:              env.GetResultTbl1Store,
		cs:              env.UserCalculationStore,
		costVatInc:      "COST_VAT_INC",
		costVatXcl:      "COST_VAT_XCL",
		totalVatInc:     "TOTAL_VAT_INC",
		totalVatXcl:     "TOTAL_VAT_XCL",
		calc:            exprtk.NewExprtk(),
		country:         "Latvia",
		expresionFailed: "failed to compile the expression",
		noCalc:          "Not able to calculate, Bad inputs",
		noValue:         "0",
		perc:            "/100",
		chars:           "(+-/*)%",
		notFound:        "record not found",
	}
}

func (grt1 *GetResultTbl1) Create(ctx context.Context, rc io.ReadCloser) (*[]models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	grt1.errorsChan = make(chan error)
	grt1.docsChan = make(chan models.Document)
	defer close(grt1.errorsChan)
	defer close(grt1.docsChan)
	var (
		getResult []models.GetResultTbl1
		docs      []models.Document
		getReq    GetResTblRequest
		baseDets  models.UserBasicDetails
	)
	grt1.getResultTbl1Arr = getResult
	grt1.docs = docs

	if err := json.NewDecoder(rc).Decode(&getReq); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateGetResTbl1, uuid.Nil, grt1.country) {
		return nil, ErrUnauthorized
	}
	if err := grt1.st.DB().Where("id = ?", getReq.BasicDetailsID).First(&baseDets).Error; err != nil {
		return nil, err
	}
	grt1.basicDetails = baseDets
	grt1.basicDetails.TotalYear = getReq.TotalYear

	if errFind2 := grt1.st.DB().Order("created_at ASC").Where("oss_admin_id = ?", grt1.basicDetails.OssAdminID).Find(&grt1.stepsResultArr).Error; errFind2 != nil {
		return nil, errFind2
	}
	for _, stepResult := range grt1.stepsResultArr {

		if err := grt1.AppendDocs(stepResult); err != nil {
			return nil, err
		}
	}

	for i, result := range grt1.getResultTbl1Arr {
		grt1.wg.Add(1)

		go func(result models.GetResultTbl1, i int) {
			defer grt1.wg.Done()
			if err := grt1.DeleteExisting(&result); err != nil && err.Error() != grt1.notFound {
				grt1.errorsChan <- err
			}
			result.ID = uuid.New()
			doc, err := grt1.st.Create(ctx, sanitizeEntityFields(&result))
			if err != nil {
				grt1.errorsChan <- err
				return
			}
			grt1.docsChan <- *doc
		}(result, i)

		select {
		case err := <-grt1.errorsChan:
			return nil, err
		case res := <-grt1.docsChan:
			grt1.docs = append(grt1.docs, res)
		}
		grt1.wg.Wait()
	}
	return &grt1.docs, nil
}

func (grt1 *GetResultTbl1) AppendDocs(stepResult models.StepsResult) error {

	costVatI, errI := grt1.ResultSubList(grt1.costVatInc, stepResult.ID)
	if errI != nil {
		return errI
	}
	costVatX, err := grt1.ResultSubList(grt1.costVatXcl, stepResult.ID)
	if err != nil {
		return err
	}
	totalVatI, errIII := grt1.ResultSubList(grt1.totalVatInc, stepResult.ID)
	if errIII != nil {
		return errIII
	}
	totalVatX, errII := grt1.ResultSubList(grt1.totalVatXcl, stepResult.ID)
	if errII != nil {
		return errII
	}

	stepResult.CostVatXcl = costVatX
	stepResult.CostVatInc = costVatI
	stepResult.TotalVatInc = totalVatI
	stepResult.TotalVatXcl = totalVatX

	CostVI, errStep := grt1.Calculate(stepResult, grt1.costVatInc)
	if errStep != nil {
		return errStep
	}

	CostVX, errStep := grt1.Calculate(stepResult, grt1.costVatXcl)
	if errStep != nil {
		return errStep
	}
	TotalVI, errStep := grt1.Calculate(stepResult, grt1.totalVatInc)
	if errStep != nil {
		return errStep
	}
	TotalVX, errStep := grt1.Calculate(stepResult, grt1.totalVatXcl)
	if errStep != nil {
		return errStep
	}

	grt1.getResultTbl1.ID = uuid.New()

	grt1.getResultTbl1.UserID = grt1.basicDetails.UserID

	grt1.getResultTbl1.ResultTitle = stepResult.ResultTitle
	grt1.getResultTbl1.UnitVatInc = stepResult.UnitVatInc
	grt1.getResultTbl1.UnitVatXcl = stepResult.UnitVatXcl
	grt1.getResultTbl1.Vat = stepResult.Vat
	grt1.getResultTbl1.OssAdmin = stepResult.OssAdminID

	grt1.getResultTbl1.CostVatInc = grt1.CalcFinale(*CostVI)
	grt1.getResultTbl1.CostVatIncInput = *CostVI

	grt1.getResultTbl1.CostVatXcl = grt1.CalcFinale(*CostVX)
	grt1.getResultTbl1.CostVatXclInput = *CostVX

	grt1.getResultTbl1.TotalVatInc = grt1.CalcFinale(*TotalVI)
	grt1.getResultTbl1.TotalVatIncInput = *TotalVI

	grt1.getResultTbl1.TotalVatXcl = grt1.CalcFinale(*TotalVX)
	grt1.getResultTbl1.TotalVatXclInput = *TotalVX

	grt1.getResultTbl1.TableType = stepResult.TableType
	grt1.getResultTbl1.Lang = stepResult.Lang

	grt1.getResultTbl1Arr = append(grt1.getResultTbl1Arr, grt1.getResultTbl1)
	return nil
}

func (grt1 *GetResultTbl1) ResultSubList(costType string, stepID uuid.UUID) ([]models.ResultSubObject, error) {

	var resultSublist []models.ResultSubObject
	if err := grt1.st.DB().Order("index ASC").Where("cost_type = ?", costType).Where("result_id = ?", stepID).Find(&resultSublist).Error; err != nil {
		return nil, err
	}
	return resultSublist, nil
}

func (grt1 *GetResultTbl1) StepsResult() (*[]models.StepsResult, error) {

	if err1 := grt1.st.DB().Find(&grt1.stepsResultArr).Error; err1 != nil {
		return nil, err1
	}

	for i, res := range grt1.stepsResultArr {
		costVatI, errI := grt1.ResultSubList(grt1.costVatInc, res.ID)
		if errI != nil {
			return nil, errI
		}
		costVatX, err := grt1.ResultSubList(grt1.costVatXcl, res.ID)
		if err != nil {
			return nil, err
		}
		totalVatI, errIII := grt1.ResultSubList(grt1.totalVatInc, res.ID)
		if errIII != nil {
			return nil, errIII
		}
		totalVatX, errII := grt1.ResultSubList(grt1.totalVatXcl, res.ID)
		if errII != nil {
			return nil, errII
		}
		res.CostVatXcl = costVatX
		res.CostVatInc = costVatI
		res.TotalVatInc = totalVatI
		res.TotalVatXcl = totalVatX
		grt1.stepsResultArr[i] = res
	}
	return &grt1.stepsResultArr, nil
}

func (grt1 *GetResultTbl1) GenerateString(costArr []models.ResultSubObject) *string {
	var (
		buf string
	)

	for i, cost := range costArr {
		if cost.Index >= i {
			switch cost.FieldID {
			case string(grt1.chars[0]):
				buf += cost.FieldName
				continue
			case string(grt1.chars[1]):
				buf += cost.FieldName
				continue
			case string(grt1.chars[2]):
				buf += cost.FieldName
				continue
			case string(grt1.chars[3]):
				buf += cost.FieldName
				continue
			case string(grt1.chars[4]):
				buf += cost.FieldName
				continue
			case string(grt1.chars[5]):
				buf += cost.FieldName
				continue
			case string(grt1.chars[6]):
				buf += grt1.perc
				continue
			default:
				buf += *grt1.GetStringValue(cost.FieldID, cost.Index, i)
				continue
			}
		}
	}
	return &buf
}

func (grt1 *GetResultTbl1) GetStringValue(fieldID string, idx, iter int) *string {
	var (
		calculationInput models.UserResultCalculation
	)
	_, _err := uuid.Parse(fieldID)
	if _err != nil {
		return &fieldID
	}

	if err := grt1.st.DB().Order("created_at ASC").Where("user_basic_details_id = ?", grt1.basicDetails.ID).Where("ees_field_id = ?", fieldID).First(&calculationInput).Error; err != nil {
		return &grt1.noValue
	}
	value := calculationInput.EesFieldValue
	if value == "" {
		return &grt1.noValue
	}
	return &value
}

func (grt1 *GetResultTbl1) Calculate(step models.StepsResult, _step string) (*string, error) {
	switch _step {
	case grt1.costVatInc:
		res := *grt1.GenerateString(step.CostVatInc)
		return &res, nil

	case grt1.costVatXcl:
		res := *grt1.GenerateString(step.CostVatXcl)
		return &res, nil

	case grt1.totalVatInc:
		res := *grt1.GenerateString(step.TotalVatInc)
		return &res, nil

	case grt1.totalVatXcl:
		res := *grt1.GenerateString(step.TotalVatXcl)
		return &res, nil

	default:
		return &grt1.noCalc, nil
	}
}

func (grt1 *GetResultTbl1) DeleteExisting(result *models.GetResultTbl1) error {
	var (
		getResultTbl1 models.GetResultTbl1
	)

	if err := grt1.st.DB().Order("created_at ASC").Where("user_id = ?", result.UserID).Where("lang = ?", result.Lang).Where("result_title = ?", result.ResultTitle).First(&getResultTbl1).Error; err != nil {
		return err
	}

	if err1 := grt1.st.DB().Unscoped().Delete(&getResultTbl1).Error; err1 != nil {
		return err1
	}

	return nil
}

func (grt1 *GetResultTbl1) CalcFinale(mathStr string) string {
	grt1.calc.SetExpression(mathStr)

	err := grt1.calc.CompileExpression()
	if err != nil {
		if err.Error() == grt1.expresionFailed {
			return grt1.noValue
		}
		return grt1.noValue
	}
	return fmt.Sprintf("%.2f", grt1.calc.GetEvaluatedValue())
}
