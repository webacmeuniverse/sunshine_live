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

type MasterTemplateStep struct {
	st         stores.Store
	ss         stores.Store
	qc         MasterTemplateQuestion
	fc         MasterTemplateField
	oc         MasterTemplateOption
	lang       string
	menuType   string
	ossAdminID string
}

func NewMasterTemplateStep(env *services.Env) *MasterTemplateStep {
	return &MasterTemplateStep{
		st:         env.MasterTemplateStepStore,
		ss:         env.OnboardingResidentStepStore,
		qc:         *NewMasterTemplateQuestion(env),
		fc:         *NewMasterTemplateField(env),
		oc:         *NewMasterTemplateOption(env),
		lang:       "en",
		menuType:   "EES Refinancability Checklist",
		ossAdminID: "ossadmin@gmail.com",
	}
}

func (mts *MasterTemplateStep) GetTemplate(ctx context.Context, filter stores.Filter) ([]models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, GetMasterTemplateStep, uuid.Nil, cv.User.Country) {
		return nil, nil, 0, ErrUnauthorized
	}
	filter.MenuType = mts.menuType
	filter.OssAdminID = mts.ossAdminID
	filter.Lang = mts.lang
	return mts.ss.ListSteps(ctx, filter)
}

func (mts *MasterTemplateStep) CreateTemplate(ctx context.Context, rc io.ReadCloser) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	var (
		getRequest MenuGetRequest
		filter     stores.Filter
	)
	if err := json.NewDecoder(rc).Decode(&getRequest); err != nil {
		return fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateMasterTemplateStep, uuid.Nil, cv.User.Country) {
		return ErrUnauthorized
	}
	filter.MenuType = getRequest.MenuType
	filter.OssAdminID = getRequest.OssAdminID
	filter.Lang = getRequest.Lang

	docs, _, _, err := mts.ss.ListSteps(ctx, filter)
	if err != nil {
		return err
	}

	fmt.Printf("%d steps\n", len(docs))
	for i, doc := range docs {
		step := doc.Data.(*models.OnboardingResidentStep)

		if err := mts.Create(ctx, step); err != nil {
			return err
		}

		fmt.Printf("\tstep %d: %d questions \n", i+1, len(step.Questions))

		for j, quiz := range step.Questions {

			if err := mts.qc.Create(ctx, &quiz); err != nil {
				return err
			}

			fmt.Printf("\t\tquiz%d: %d fields\n", j+1, len(quiz.StepFields))

			for k, field := range quiz.StepFields {

				if err := mts.fc.Create(ctx, &field); err != nil {
					return err
				}

				fmt.Printf("\t\t\tfield%d: %d options\n", k+1, len(field.Options))

				for _, opt := range field.Options {
					if err := mts.oc.Create(ctx, &opt); err != nil {
						return err
					}
				}
			}
		}
	}

	return nil
}

func (mts *MasterTemplateStep) Create(ctx context.Context, step *models.OnboardingResidentStep) error {

	masterStep := models.MasterStep{
		Index:        step.Index,
		Name:         step.Name,
		Require:      step.Require,
		MenuType:     step.MenuType,
		OssAdminID:   step.OssAdminID,
		DefaultScore: step.DefaultScore,
		Lang:         step.Lang,
	}
	if _, err := mts.st.Create(ctx, sanitizeEntityFields(&masterStep)); err != nil {
		return err
	}
	return nil
}

func (mts *MasterTemplateStep) Get(ctx context.Context, mtsID uuid.UUID) (*models.Document, error) {
	// cv := services.FromContext(ctx)
	// if !cv.Authorized() {
	// 	return nil, nil, ErrUnauthorized
	// }

	doc, err := mts.st.Get(ctx, mtsID)
	if err != nil {
		return nil, ErrNotFound
	}
	return doc, err
}

func (mts *MasterTemplateStep) List(ctx context.Context, filter stores.Filter, rc io.ReadCloser) ([]models.Document, stores.Dependencies, int, error) {
	// cv := services.FromContext(ctx)

	// if !cv.Authorized() || !Can(ctx, ListCalcMenus, uuid.Nil, cv.User.Country) {
	// 	return nil, nil, 0, ErrUnauthorized
	// }

	return mts.st.List(ctx, filter)
}

func (mts *MasterTemplateStep) NextIndex(ctx context.Context, filter stores.Filter, rc io.ReadCloser) (*int, error) {
	docs, _, _, err := mts.List(ctx, filter, rc)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (mts *MasterTemplateStep) DeleteMasterStep(ctx context.Context, uid uuid.UUID) error {
	// cv := services.FromContext(ctx)
	// if !Can(ctx, DeleteCalcMenu, uid, cv.User.Country) {
	// 	return ErrUnauthorized
	// }

	doc, err := mts.st.Get(ctx, uid)
	if err != nil {
		return ErrNotFound
	}

	return mts.st.Delete(ctx, doc)
}

func (mts *MasterTemplateStep) FetchMasterSteps(ctx context.Context, ids []uuid.UUID) ([]models.MasterStep, error) {
	var result []models.MasterStep
	return result, mts.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}

type MasterTemplateQuestion struct {
	st stores.Store
}

func NewMasterTemplateQuestion(env *services.Env) *MasterTemplateQuestion {
	return &MasterTemplateQuestion{
		st: env.MasterTemplateQuestionStore,
	}
}

func (mtq *MasterTemplateQuestion) Create(ctx context.Context, quiz *models.ResidentStepQuestion) error {

	masterQuiz := models.MasterQuestion{
		StepID:       quiz.StepID,
		Index:        quiz.Index,
		Name:         quiz.Name,
		DefaultScore: quiz.DefaultScore,
		Lang:         quiz.Lang,
	}
	if _, err := mtq.st.Create(ctx, sanitizeEntityFields(&masterQuiz)); err != nil {
		return err
	}
	return nil
}

func (mtq *MasterTemplateQuestion) Get(ctx context.Context, mtqID uuid.UUID) (*models.Document, error) {
	// cv := services.FromContext(ctx)
	// if !cv.Authorized() {
	// 	return nil, nil, ErrUnauthorized
	// }

	doc, err := mtq.st.Get(ctx, mtqID)
	if err != nil {
		return nil, ErrNotFound
	}
	return doc, err
}

func (mtq *MasterTemplateQuestion) List(ctx context.Context, filter stores.Filter, rc io.ReadCloser) ([]models.Document, stores.Dependencies, int, error) {
	// cv := services.FromContext(ctx)

	// if !cv.Authorized() || !Can(ctx, ListCalcMenus, uuid.Nil, cv.User.Country) {
	// 	return nil, nil, 0, ErrUnauthorized
	// }

	return mtq.st.List(ctx, filter)
}

func (mtq *MasterTemplateQuestion) NextIndex(ctx context.Context, filter stores.Filter, rc io.ReadCloser) (*int, error) {
	docs, _, _, err := mtq.List(ctx, filter, rc)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (mtq *MasterTemplateQuestion) DeleteMasterQuestion(ctx context.Context, uid uuid.UUID) error {
	// cv := services.FromContext(ctx)
	// if !Can(ctx, DeleteCalcMenu, uid, cv.User.Country) {
	// 	return ErrUnauthorized
	// }

	doc, err := mtq.st.Get(ctx, uid)
	if err != nil {
		return ErrNotFound
	}

	return mtq.st.Delete(ctx, doc)
}

func (mtq *MasterTemplateQuestion) FetchMasterQuestions(ctx context.Context, ids []uuid.UUID) ([]models.MasterQuestion, error) {
	var result []models.MasterQuestion
	return result, mtq.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}

type MasterTemplateField struct {
	st stores.Store
}

func NewMasterTemplateField(env *services.Env) *MasterTemplateField {
	return &MasterTemplateField{
		st: env.MasterTemplateFieldStore,
	}
}

func (mtf *MasterTemplateField) Create(ctx context.Context, field *models.OnboardingResidentStepField) error {

	masterField := models.MasterField{
		Index:        field.Index,
		QuestionID:   field.QuestionID,
		Name:         field.Name,
		Placeholder:  field.Placeholder,
		InputType:    field.InputType,
		Require:      field.Require,
		DefaultScore: field.DefaultScore,
		Lang:         field.Lang,
	}
	if _, err := mtf.st.Create(ctx, sanitizeEntityFields(&masterField)); err != nil {
		return err
	}

	return nil
}

func (mtf *MasterTemplateField) Get(ctx context.Context, mtfID uuid.UUID) (*models.Document, error) {
	// cv := services.FromContext(ctx)
	// if !cv.Authorized() {
	// 	return nil, nil, ErrUnauthorized
	// }

	doc, err := mtf.st.Get(ctx, mtfID)
	if err != nil {
		return nil, ErrNotFound
	}
	return doc, err
}

func (mtf *MasterTemplateField) List(ctx context.Context, filter stores.Filter, rc io.ReadCloser) ([]models.Document, stores.Dependencies, int, error) {
	// cv := services.FromContext(ctx)

	// if !cv.Authorized() || !Can(ctx, ListCalcMenus, uuid.Nil, cv.User.Country) {
	// 	return nil, nil, 0, ErrUnauthorized
	// }

	return mtf.st.List(ctx, filter)
}

func (mtf *MasterTemplateField) NextIndex(ctx context.Context, filter stores.Filter, rc io.ReadCloser) (*int, error) {
	docs, _, _, err := mtf.List(ctx, filter, rc)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (mtf *MasterTemplateField) DeleteMasterField(ctx context.Context, uid uuid.UUID) error {
	// cv := services.FromContext(ctx)
	// if !Can(ctx, DeleteCalcMenu, uid, cv.User.Country) {
	// 	return ErrUnauthorized
	// }

	doc, err := mtf.st.Get(ctx, uid)
	if err != nil {
		return ErrNotFound
	}

	return mtf.st.Delete(ctx, doc)
}

func (mtf *MasterTemplateField) FetchMasterFields(ctx context.Context, ids []uuid.UUID) ([]models.MasterField, error) {
	var result []models.MasterField
	return result, mtf.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}

type MasterTemplateOption struct {
	st stores.Store
}

func NewMasterTemplateOption(env *services.Env) *MasterTemplateOption {
	return &MasterTemplateOption{
		st: env.MasterTemplateOptionStore,
	}
}

func (mto *MasterTemplateOption) Create(ctx context.Context, opt *models.StepFieldOption) error {

	masterOption := models.MasterOption{
		StepFieldID:  opt.StepFieldID,
		Title:        opt.Title,
		OptionValue:  opt.OptionValue,
		DefaultScore: opt.DefaultScore,
		Image:        opt.Image,
	}
	if _, err := mto.st.Create(ctx, sanitizeEntityFields(&masterOption)); err != nil {
		return err
	}
	return nil
}

func (mto *MasterTemplateOption) Get(ctx context.Context, mtoID uuid.UUID) (*models.Document, error) {
	// cv := services.FromContext(ctx)
	// if !cv.Authorized() {
	// 	return nil, nil, ErrUnauthorized
	// }

	doc, err := mto.st.Get(ctx, mtoID)
	if err != nil {
		return nil, ErrNotFound
	}
	return doc, err
}

func (mto *MasterTemplateOption) List(ctx context.Context, filter stores.Filter, rc io.ReadCloser) ([]models.Document, stores.Dependencies, int, error) {
	// cv := services.FromContext(ctx)

	// if !cv.Authorized() || !Can(ctx, ListCalcMenus, uuid.Nil, cv.User.Country) {
	// 	return nil, nil, 0, ErrUnauthorized
	// }

	return mto.st.List(ctx, filter)
}

func (mto *MasterTemplateOption) NextIndex(ctx context.Context, filter stores.Filter, rc io.ReadCloser) (*int, error) {
	docs, _, _, err := mto.List(ctx, filter, rc)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (mto *MasterTemplateOption) DeleteMasterOption(ctx context.Context, uid uuid.UUID) error {
	// cv := services.FromContext(ctx)
	// if !Can(ctx, DeleteCalcMenu, uid, cv.User.Country) {
	// 	return ErrUnauthorized
	// }

	doc, err := mto.st.Get(ctx, uid)
	if err != nil {
		return ErrNotFound
	}

	return mto.st.Delete(ctx, doc)
}

func (mto *MasterTemplateOption) FetchMasterOptions(ctx context.Context, ids []uuid.UUID) ([]models.MasterOption, error) {
	var result []models.MasterOption
	return result, mto.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
