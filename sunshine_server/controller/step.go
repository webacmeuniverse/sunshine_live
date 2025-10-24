package controller

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/url"
	"strconv"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

type StepItem struct {
	st      stores.Store
	country models.Country
}

func NewStepItem(env *services.Env) *StepItem {
	return &StepItem{
		st:      env.StepStore,
		country: "Latvia",
	}
}

func (c *StepItem) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var step models.StepItem

	if err := json.NewDecoder(rc).Decode(&step); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateStepItem, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	doc, err := c.st.Create(ctx, sanitizeEntityFields(&step))
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func (c *StepItem) Get(ctx context.Context, stepID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	_, err := c.st.Get(ctx, stepID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, GetStepField, stepID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}

	return c.st.Unwrap(ctx, stepID)
}

func (c *StepItem) Update(ctx context.Context, stepID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	doc, err := c.st.Get(ctx, stepID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateStepItem, stepID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	new := *doc.Data.(*models.StepItem)

	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	doc.Data = &new

	_, err = c.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}
	result, deps, err := c.st.Unwrap(ctx, stepID)

	return result, deps, err
}

func (c *StepItem) List(ctx context.Context, filter stores.Filter, query url.Values) ([]models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, 0, ErrUnauthorized
	}
	var (
		deps       stores.Dependencies
		OssAdminID string = query.Get("oss_admin_id")
		Lang       string = query.Get("lang")
	)
	defTemp, err := strconv.Atoi(query.Get("is_default_template"))

	if err != nil {
		return nil, nil, 0, errors.New(fmt.Sprintf("is_default_template param has to be int: %s", err.Error()))
	}

	if defTemp == 0 {
		var steps []models.StepItem
		if err := c.st.DB().Where("is_default_template = ?", defTemp).Where("oss_admin_id = ?", OssAdminID).Where("lang = ?", Lang).Order("index ASC").Find(&steps).Error; err != nil {
			return nil, nil, 0, err
		}
		fmt.Printf("%d Documents found\n", len(steps))
		_steps := c.AddFields(steps)
		docs := c.MakeDocs(_steps)
		return docs, deps, len(docs), nil
	} else {
		var steps []models.StepItem
		if err := c.st.DB().Where("is_default_template = ?", defTemp).Where("lang = ?", Lang).Order("index ASC").Find(&steps).Error; err != nil {
			return nil, nil, 0, err
		}
		_steps := c.AddFields(steps)
		docs := c.MakeDocs(_steps)
		return docs, deps, len(docs), nil
	}
}

func (si *StepItem) AddFields(steps []models.StepItem) []models.StepItem {
	for i, step := range steps {
		var fields []models.StepField
		if err := si.st.DB().Where("step_id = ?", step.ID).Find(&fields).Error; err != nil {
			return nil
		}
		steps[i].StepFields = fields
	}
	return steps
}

func (si *StepItem) MakeDocs(steps []models.StepItem) []models.Document {
	docs := make([]models.Document, len(steps))
	for i, v := range steps {
		d := models.Wrap(v)
		docs[i] = *d
	}
	return docs
}

func (si *StepItem) ListByOss(ctx context.Context, ossAdminID, lang string) ([]models.StepItem, error) {
	var steps []models.StepItem
	if err := si.st.DB().Where("oss_admin_id = ?", ossAdminID).Where("lang = ?", lang).Find(&steps).Error; err != nil {
		return nil, err
	}
	return steps, nil
}

func (c *StepItem) ListDefaults(allLangs bool, lang string) ([]models.StepItem, error) {
	var steps []models.StepItem
	if allLangs {
		if err := c.st.DB().Order("created_at ASC").Where("is_default_template = '1'").Find(&steps).Error; err != nil {
			return nil, err
		}
		return steps, nil
	}
	if err := c.st.DB().Order("created_at ASC").Where("is_default_template = '1'").Where("lang = ?", lang).Find(&steps).Error; err != nil {
		return nil, err
	}
	return steps, nil
}

func (c *StepItem) ListDefaultFields(stepID uuid.UUID, lang string) ([]models.StepField, error) {
	var fields []models.StepField
	if err := c.st.DB().Order("created_at ASC").Where("step_id = ?", stepID).Where("is_default_template = '1'").Where("lang = ?", lang).Find(&fields).Error; err != nil {
		return nil, err
	}
	return fields, nil
}

func (c *StepItem) NextIndex(ctx context.Context, filter stores.Filter, query url.Values) (*int, error) {
	docs, _, _, err := c.List(ctx, filter, query)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (c *StepItem) StepFieldsList(db *gorm.DB, stepID uuid.UUID) ([]models.StepField, error) {

	var stepFields []models.StepField
	if err := c.st.DB().Order("index ASC").Where("step_id = ?", stepID).Find(&stepFields).Error; err != nil {
		return nil, err
	}
	return stepFields, nil
}

func (si *StepItem) AddStepField(ctx context.Context, rc io.ReadCloser, uid uuid.UUID) (*models.StepField, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var stepfield models.StepField

	if err := json.NewDecoder(rc).Decode(&stepfield); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateStepField, uid, cv.User.Country) {
		return nil, ErrUnauthorized
	}

	stepfield.StepID = uid

	field, err := si.SaveStepField(ctx, stepfield)
	if err != nil {
		return nil, err
	}

	return field, nil
}

func (si *StepItem) SaveStepField(ctx context.Context, field models.StepField) (*models.StepField, error) {
	doc, err := si.st.Create(ctx, sanitizeEntityFields(&field))
	if err != nil {
		return nil, err
	}
	field.IsDefaultTemplateID = doc.Data.(*models.StepField).ID.String()
	_, _err := si.st.Update(ctx, models.Wrap(&field))
	return doc.Data.(*models.StepField), _err
}

func (si *StepItem) DeleteStep(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	doc, err := si.st.Get(ctx, uid)
	if err != nil {
		return err
	}
	new := *doc.Data.(*models.StepItem)
	fields, err := si.StepFieldsList(si.st.DB(), new.ID)
	if err != nil {
		return err
	}
	if !Can(ctx, DeleteStepItem, uid, cv.User.Country) {
		return ErrUnauthorized
	}
	for _, f := range fields {
		si.DeleteField(ctx, f.ID)
	}

	return si.st.Delete(ctx, doc)

}

func (c *StepItem) DeleteField(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	stepField := models.StepField{
		Value: models.Value{
			ID: uid,
		},
	}
	if !Can(ctx, DeleteStepField, uid, cv.User.Country) {
		return ErrUnauthorized
	}

	return c.st.DB().Unscoped().Delete(&stepField).Error
}

func (si *StepItem) UpdateField(ctx context.Context, uid uuid.UUID, r io.Reader) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	new := models.StepField{}
	if err := json.NewDecoder(r).Decode(&new); err != nil {
		return fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	old := models.StepField{}
	if err := si.st.DB().Where("id = ?", uid).First(&old).Error; err != nil {
		return fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	new.ID = old.ID
	new.StepID = old.StepID

	return si.st.DB().Save(&new).Error
}

func (c *StepItem) FetchStepItems(ctx context.Context, ids []uuid.UUID) ([]models.StepItem, error) {
	var result []models.StepItem
	return result, c.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
