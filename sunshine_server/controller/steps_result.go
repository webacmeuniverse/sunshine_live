package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/url"
	"strconv"
	"time"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/google/uuid"
)

type StepsResult struct {
	st                 stores.Store
	country            models.Country
	cvi, cvx, tvi, tvx string
}

func NewStepsResultItem(env *services.Env) *StepsResult {
	return &StepsResult{
		st:      env.StepsResultStore,
		country: "Latvia",
		cvi:     "COST_VAT_INC",
		cvx:     "COST_VAT_XCL",
		tvi:     "TOTAL_VAT_INC",
		tvx:     "TOTAL_VAT_XCL",
	}
}

func (sr *StepsResult) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var stepsResult models.StepsResult

	if err := json.NewDecoder(rc).Decode(&stepsResult); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if _, err := sr.st.GetByIndex(ctx, string(stepsResult.ID.String())); err == nil {
		return nil, fmt.Errorf("%w: id", ErrDuplicate)
	}
	if !Can(ctx, CreateStepsResult, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	doc, err := sr.st.Create(ctx, sanitizeEntityFields(&stepsResult))
	if err != nil {
		return nil, err
	}
	var resultSubitem []models.ResultSubObject

	doc.Data.(*models.StepsResult).CostVatInc = resultSubitem
	doc.Data.(*models.StepsResult).CostVatXcl = resultSubitem

	return doc, nil
}

func (sr *StepsResult) Get(ctx context.Context, stepsResultID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	_, err := sr.st.Get(ctx, stepsResultID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, GetStepsResult, stepsResultID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	return sr.st.Unwrap(ctx, stepsResultID)
}

func (sr *StepsResult) GetSubItem(ctx context.Context, subID uuid.UUID) (*models.ResultSubObject, error) {
	var subItem models.ResultSubObject
	if err := sr.st.DB().Where("id = ?", subID).First(&subItem).Error; err != nil {
		return nil, err
	}
	return &subItem, nil
}

func (sr *StepsResult) Update(ctx context.Context, stepsResultID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	doc, err := sr.st.Get(ctx, stepsResultID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateStepsResult, stepsResultID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	new := *doc.Data.(*models.StepsResult)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	doc.Data = &new

	_, err = sr.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}
	result, deps, err := sr.st.Unwrap(ctx, stepsResultID)

	return result, deps, err
}

func (sr *StepsResult) List(ctx context.Context, filter stores.Filter, query url.Values) ([]models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, 0, ErrUnauthorized
	}
	var (
		steps []models.StepsResult
		deps  stores.Dependencies
	)
	defTemp, _ := strconv.Atoi(query.Get("is_default_template"))
	OssAdminID := query.Get("oss_admin_id")
	Lang := query.Get("lang")
	if !Can(ctx, CreateStepsResult, uuid.Nil, cv.User.Country) {
		return nil, nil, 0, ErrUnauthorized
	}
	if defTemp == 0 {
		if err := sr.st.DB().Order("created_at ASC").Where("oss_admin_id = ?", OssAdminID).Where("is_default_template = ?", defTemp).Where("lang = ?", Lang).Find(&steps).Error; err != nil {
			return nil, nil, 0, err
		}
		docs, err := sr.MakeDocs(steps)
		if err != nil {
			return nil, nil, 0, err
		}
		n := len(docs)
		return docs, deps, n, nil
	} else {
		if err := sr.st.DB().Order("created_at ASC").Where("is_default_template = ?", defTemp).Where("lang = ?", Lang).Find(&steps).Error; err != nil {
			return nil, nil, 0, err
		}
		docs, err := sr.MakeDocs(steps)
		if err != nil {
			return nil, nil, 0, err
		}
		n := len(docs)
		return docs, deps, n, nil
	}
}

func (sr *StepsResult) ListDefaults(allLangs bool, lang string) ([]models.StepsResult, error) {
	var steps []models.StepsResult
	if allLangs {
		if err := sr.st.DB().Order("created_at ASC").Where("is_default_template = '1'").Find(&steps).Error; err != nil {
			return nil, err
		}
		return steps, nil
	}
	if err := sr.st.DB().Order("created_at ASC").Where("is_default_template = '1'").Where("lang = ?", lang).Find(&steps).Error; err != nil {
		return nil, err
	}
	return sr.ListSteps(steps)
}

func (sr *StepsResult) ListSteps(steps []models.StepsResult) ([]models.StepsResult, error) {
	stepsRes := make([]models.StepsResult, len(steps))
	for i, res := range steps {
		costVatX, err := sr.ResultSubList(sr.cvx, res.ID)
		if err != nil {
			return nil, err
		}
		costVatI, errI := sr.ResultSubList(sr.cvi, res.ID)
		if err != nil {
			return nil, errI
		}
		totalVatX, errI := sr.ResultSubList(sr.tvx, res.ID)
		if err != nil {
			return nil, errI
		}
		totalVatI, errI := sr.ResultSubList(sr.tvi, res.ID)
		if err != nil {
			return nil, errI
		}
		res.CostVatXcl = costVatX
		res.CostVatInc = costVatI
		res.TotalVatInc = totalVatI
		res.TotalVatXcl = totalVatX
		stepsRes[i] = res
	}
	return stepsRes, nil
}

func (sr *StepsResult) MakeDocs(steps []models.StepsResult) ([]models.Document, error) {
	docs := make([]models.Document, len(steps))
	for i, res := range steps {
		costVatX, err := sr.ResultSubList(sr.cvx, res.ID)
		if err != nil {
			return nil, err
		}
		costVatI, errI := sr.ResultSubList(sr.cvi, res.ID)
		if err != nil {
			return nil, errI
		}
		totalVatX, errI := sr.ResultSubList(sr.tvx, res.ID)
		if err != nil {
			return nil, errI
		}
		totalVatI, errI := sr.ResultSubList(sr.tvi, res.ID)
		if err != nil {
			return nil, errI
		}
		res.CostVatXcl = costVatX
		res.CostVatInc = costVatI
		res.TotalVatInc = totalVatI
		res.TotalVatXcl = totalVatX

		d := models.Wrap(res)
		docs[i] = *d
	}
	return docs, nil
}

func (sr *StepsResult) ListByOssAdmin(ctx context.Context, ossAdminID string) ([]models.StepsResult, error) {
	var steps []models.StepsResult

	if err := sr.st.DB().Where("oss_admin_id = ?", ossAdminID).Find(&steps).Error; err != nil {
		return nil, err
	}
	for i, res := range steps {
		costVatX, err := sr.ResultSubList(sr.cvx, res.ID)
		if err != nil {
			return nil, err
		}
		costVatI, errI := sr.ResultSubList(sr.cvi, res.ID)
		if err != nil {
			return nil, errI
		}
		totalVatX, errI := sr.ResultSubList(sr.tvx, res.ID)
		if err != nil {
			return nil, errI
		}
		totalVatI, errI := sr.ResultSubList(sr.tvi, res.ID)
		if err != nil {
			return nil, errI
		}
		res.CostVatXcl = costVatX
		res.CostVatInc = costVatI
		res.TotalVatInc = totalVatI
		res.TotalVatXcl = totalVatX
		steps[i] = res
	}
	return steps, nil
}

func (sr *StepsResult) NextIndex(ctx context.Context, filter stores.Filter, query url.Values) (*int, error) {
	docs, _, _, err := sr.List(ctx, filter, query)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (sr *StepsResult) DeleteStepsResult(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	doc, err := sr.st.Get(ctx, uid)
	if err != nil {
		return err
	}
	if !Can(ctx, DeleteStepsResult, uid, cv.User.Country) {
		return ErrUnauthorized
	}
	return sr.st.Delete(ctx, doc)
}

func (sr *StepsResult) DeleteField(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	field := models.ResultSubObject{
		ID: uid,
	}
	if err := sr.st.DB().Where("id = ?", uid).First(&field).Error; err != nil {
		return err
	}
	doc := models.Document{
		ID:        field.ID,
		Kind:      field.Kind(),
		Data:      field,
		Timestamp: time.Now(),
	}
	if !Can(ctx, DeleteStepsResult, uid, cv.User.Country) {
		return ErrUnauthorized
	}
	return sr.st.Delete(ctx, &doc)
}

func (sr *StepsResult) ResultSubList(costType string, stepID uuid.UUID) ([]models.ResultSubObject, error) {
	var resultSublist []models.ResultSubObject
	if err := sr.st.DB().Order("created_at ASC").Where("cost_type = ?", costType).Where("result_id = ?", stepID).Find(&resultSublist).Error; err != nil && err.Error() != "record not found" {
		return nil, err
	}
	return resultSublist, nil
}

func (sr *StepsResult) AddResultSubitems(ctx context.Context, rc io.ReadCloser) ([]models.ResultSubObject, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		resultSubItems []models.ResultSubObject
		results        []models.ResultSubObject
	)
	if err := json.NewDecoder(rc).Decode(&resultSubItems); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateStepsResult, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	for _, res := range resultSubItems {
		_res, err := sr.AddIndex(res)
		if err != nil {
			return nil, err
		}
		if err := sr.SaveSubitem(*_res); err != nil {
			return nil, err
		}
		results = append(results, res)
	}
	msg := SuccessMessage{Message: fmt.Sprintf("%d Result sub-items saved.", len(resultSubItems))}
	println(msg.Message)
	return results, nil
}

func (sr *StepsResult) AddIndex(res models.ResultSubObject) (*models.ResultSubObject, error) {
	switch res.CostType {
	case sr.cvi:
		subObjs, err := sr.ResultSubList(sr.cvi, res.ResultID)
		if err != nil {
			return nil, err
		}
		res.Index = len(subObjs)
		return &res, nil
	case sr.cvx:
		subObjs, err := sr.ResultSubList(sr.cvx, res.ResultID)
		if err != nil {
			return nil, err
		}
		res.Index = len(subObjs)
		return &res, nil
	case sr.tvi:
		subObjs, err := sr.ResultSubList(sr.tvi, res.ResultID)
		if err != nil {
			return nil, err
		}
		res.Index = len(subObjs)
		return &res, nil
	case sr.tvx:
		subObjs, err := sr.ResultSubList(sr.tvx, res.ResultID)
		if err != nil {
			return nil, err
		}
		res.Index = len(subObjs)
		return &res, nil
	default:
		return &res, nil
	}
}

func (sr *StepsResult) AddResultSubitem(ctx context.Context, rc io.ReadCloser, uid uuid.UUID) (*models.ResultSubObject, error) {
	var resultSubitem models.ResultSubObject

	if err := json.NewDecoder(rc).Decode(&resultSubitem); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	resultSubitem.ResultID = uid
	if err := sr.SaveSubitem(resultSubitem); err != nil {
		return nil, err
	}
	return &resultSubitem, nil
}

func (sr *StepsResult) SaveSubitem(res models.ResultSubObject) error {
	if err := sr.st.DB().Save(&res).Error; err != nil {
		return err
	}
	return nil
}

func (sr StepsResult) SaveResultSubitem(subItem models.ResultSubObject, stepID uuid.UUID) error {
	subItem.ResultID = stepID
	if err := sr.st.DB().Save(&subItem).Error; err != nil {
		return err
	}
	return nil
}

func (sr *StepsResult) FetchStepsResultItems(ctx context.Context, ids []uuid.UUID) ([]models.StepsResult, error) {
	var result []models.StepsResult
	return result, sr.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
