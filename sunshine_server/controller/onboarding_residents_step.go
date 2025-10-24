package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/url"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/google/uuid"
)

type OnboardingResidentStep struct {
	st      stores.Store
	country models.Country
}

func NewOnboardingResidentStep(env *services.Env) *OnboardingResidentStep {
	return &OnboardingResidentStep{
		st:      env.OnboardingResidentStepStore,
		country: "Latvia",
	}
}

func (ors *OnboardingResidentStep) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var onboardingResidentStep models.OnboardingResidentStep

	if err := json.NewDecoder(rc).Decode(&onboardingResidentStep); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if _, err := ors.st.GetByIndex(ctx, fmt.Sprint(onboardingResidentStep.Index)); err == nil {
		return nil, fmt.Errorf("%w: Index", ErrDuplicate)
	}
	if !Can(ctx, CreateOnboardingResidentStep, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	doc, err := ors.st.Create(ctx, sanitizeEntityFields(&onboardingResidentStep))
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func (ors *OnboardingResidentStep) CreateAnswer(ctx context.Context, rc io.ReadCloser, uid uuid.UUID) (*models.UserAnswer, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var answer models.UserAnswer

	if err := json.NewDecoder(rc).Decode(&answer); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateOnboardingResidentStep, uid, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	answer.FieldID = uid

	if err := ors.st.DB().Save(&answer).Error; err != nil {
		return nil, err
	}

	if err := ors.st.DB().First(&answer).Error; err != nil {
		return nil, err
	}

	return &answer, nil
}

func (ors *OnboardingResidentStep) Get(ctx context.Context, orsID uuid.UUID) (*models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, GetOnboardingResidentStep, orsID, cv.User.Country) {
		return nil, nil, 0, ErrUnauthorized
	}
	var filter stores.Filter

	doc, err := ors.st.Get(ctx, orsID)
	if err != nil {
		return nil, nil, 0, ErrNotFound
	}

	step := doc.Data.(*models.OnboardingResidentStep)

	filter.MenuType = step.MenuType
	filter.OssAdminID = step.OssAdminID
	filter.Lang = step.Lang

	docs, deps, n, err := ors.st.ListSteps(ctx, filter)

	return &docs[0], deps, n, err
}

func (ors *OnboardingResidentStep) GetUserData(ctx context.Context, orsID uuid.UUID) (*models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, 0, ErrUnauthorized
	}

	var filter stores.Filter

	doc, err := ors.st.Get(ctx, orsID)
	if err != nil {
		return nil, nil, 0, ErrNotFound
	}
	if !Can(ctx, GetOnboardingResidentStep, orsID, cv.User.Country) {
		return nil, nil, 0, ErrUnauthorized
	}
	step := doc.Data.(*models.OnboardingResidentStep)

	filter.MenuType = step.MenuType
	filter.OssAdminID = step.OssAdminID
	filter.Lang = step.Lang

	docs, deps, n, err := ors.st.ListUserDataSteps(ctx, filter)

	return &docs[0], deps, n, err
}

func (ors *OnboardingResidentStep) Update(ctx context.Context, stepsResultID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	var filter stores.Filter

	doc, err := ors.st.Get(ctx, stepsResultID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateOnboardingResidentStep, stepsResultID, ors.country) {
		return nil, nil, ErrUnauthorized
	}

	new := *doc.Data.(*models.OnboardingResidentStep)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	doc.Data = &new

	_, err = ors.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}

	filter.MenuType = new.MenuType
	filter.OssAdminID = new.OssAdminID
	filter.Lang = new.Lang

	docs, deps, _, err := ors.st.ListSteps(ctx, filter)

	return &docs[0], deps, err
}

func (ors *OnboardingResidentStep) List(ctx context.Context, filter stores.Filter, rc io.ReadCloser) ([]models.Document, stores.Dependencies, int, error) {
	var (
		getRequest TepmlateRequest
		steps      []models.OnboardingResidentStep
		deps       stores.Dependencies
	)

	if err := json.NewDecoder(rc).Decode(&getRequest); err != nil {
		return nil, nil, 0, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	if getRequest.IsDefaultTemplate == 0 {
		if err := ors.st.DB().Order("created_at ASC").Where("oss_admin_id = ?", getRequest.OssAdminID).Where("is_default_template = ?", getRequest.IsDefaultTemplate).Where("menu_type = ?", getRequest.MenuType).Where("lang = ?", getRequest.Lang).Find(&steps).Error; err != nil {
			return nil, nil, 0, err
		}
		_steps := ors.AddQuestions(steps)
		docs := ors.MakeDocs(_steps)
		return docs, deps, len(docs), nil
	} else {
		if err := ors.st.DB().Order("created_at ASC").Where("is_default_template = ?", getRequest.IsDefaultTemplate).Where("menu_type = ?", getRequest.MenuType).Where("lang = ?", getRequest.Lang).Find(&steps).Error; err != nil {
			return nil, nil, 0, err
		}
		_steps := ors.AddQuestions(steps)
		docs := ors.MakeDocs(_steps)
		return docs, deps, len(docs), nil
	}
}

func (ors *OnboardingResidentStep) ListDefaults(allLangs bool, menuType, lang string) ([]models.OnboardingResidentStep, error) {
	var steps []models.OnboardingResidentStep
	if allLangs {
		if err := ors.st.DB().Order("created_at ASC").Where("is_default_template = '1'").Where("menu_type = ?", menuType).Find(&steps).Error; err != nil {
			return nil, err
		}
		return steps, nil
	}
	if err := ors.st.DB().Order("created_at ASC").Where("is_default_template = '1'").Where("menu_type = ?", menuType).Where("lang = ?", lang).Find(&steps).Error; err != nil {
		return nil, err
	}
	return steps, nil
}

func (ors *OnboardingResidentStep) AddQuestions(steps []models.OnboardingResidentStep) []models.OnboardingResidentStep {
	for i, step := range steps {
		var questions []models.ResidentStepQuestion
		if err := ors.st.DB().Where("step_id = ?", step.ID).Find(&questions).Error; err != nil {
			return nil
		}
		_questions := ors.AddFields(questions)
		steps[i].Questions = _questions
	}
	return steps
}

func (ors *OnboardingResidentStep) AddFields(questions []models.ResidentStepQuestion) []models.ResidentStepQuestion {
	for i, quiz := range questions {
		var fields []models.OnboardingResidentStepField
		if err := ors.st.DB().Where("question_id = ?", quiz.ID).Find(&fields).Error; err != nil {
			return nil
		}
		_fields := ors.AddOptions(fields)
		questions[i].StepFields = _fields
	}
	return questions
}

func (ors *OnboardingResidentStep) AddOptions(fields []models.OnboardingResidentStepField) []models.OnboardingResidentStepField {
	for i, field := range fields {
		var options []models.StepFieldOption
		if err := ors.st.DB().Where("step_field_id = ?", field.ID).Find(&options).Error; err != nil {
			return nil
		}
		fields[i].Options = options
	}
	return fields
}

func (ors *OnboardingResidentStep) MakeDocs(steps []models.OnboardingResidentStep) []models.Document {
	docs := make([]models.Document, len(steps))
	for i, v := range steps {
		d := models.Wrap(v)
		docs[i] = *d
	}
	return docs
}

func (ors *OnboardingResidentStep) NextIndex(ctx context.Context, filter stores.Filter, rc io.ReadCloser, query url.Values) (*int, error) {
	docs, _, _, err := ors.List(ctx, filter, rc)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (ors *OnboardingResidentStep) DeleteOnboardingResident(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}

	doc, err := ors.st.Get(ctx, uid)
	if err != nil {
		return err
	}
	if !Can(ctx, DeleteOnboardingResidentStep, uid, ors.country) {
		return ErrUnauthorized
	}
	return ors.st.Delete(ctx, doc)
}

func (ors *OnboardingResidentStep) FetchOnboardingResident(ctx context.Context, ids []uuid.UUID) ([]models.OnboardingResidentStep, error) {
	var result []models.OnboardingResidentStep
	return result, ors.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
