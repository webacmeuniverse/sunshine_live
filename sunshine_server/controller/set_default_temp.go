package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"strings"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"

	"github.com/google/uuid"
)

type SetDefaultTemp struct {
	sc OnboardingResidentStep
	qc OnboardingResidentStepQuestion
	fc OnboardingResidentStepField
	oc StepFieldOption
	od OnboardingDescription

	sic StepItem
	src StepsResult

	oerc           OssEesResultTbl2
	onboardingCall bool
	eesCalcCall    bool
	stepItemCall   bool
	stepResCall    bool
	allLangs       bool
	descCall       bool

	country models.Country
}

func NewSetDefaultTemp(env *services.Env) *SetDefaultTemp {
	return &SetDefaultTemp{
		sc:      *NewOnboardingResidentStep(env),
		qc:      *NewOnboardingResidentStepQuestion(env),
		fc:      *NewOnboardingResidentStepField(env),
		oc:      *NewStepFieldOption(env),
		oerc:    *NewOssEesResultTbl2(env),
		sic:     *NewStepItem(env),
		src:     *NewStepsResultItem(env),
		od:      *NewOnboardingDescription(env),
		country: "Latvia",
	}
}

func (sdt *SetDefaultTemp) Create(ctx context.Context, rc io.ReadCloser) ([]SuccessMessage, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		getReq SetDefaultRequest
		all    string = "all"
	)
	if err := json.NewDecoder(rc).Decode(&getReq); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if strings.ToLower(getReq.Lang) == all {
		sdt.allLangs = true
	} else {
		sdt.allLangs = false
	}
	sdt.onboardingCall = true
	sdt.eesCalcCall = false
	sdt.stepItemCall = false
	sdt.stepResCall = false
	sdt.descCall = false

	if !Can(ctx, CreateSetDefTemp, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}

	steps, err := sdt.sc.ListDefaults(sdt.allLangs, getReq.MenuType, getReq.Lang)
	if err != nil {
		return nil, err
	}
	if err := sdt.DeleteExisting(ctx, getReq); err != nil {
		return nil, err
	}
	for _, step := range steps {
		stepID, err := sdt.SetStep(ctx, step, getReq)
		if err != nil {
			return nil, err
		}
		questions, err1 := sdt.qc.ListDefaults(sdt.allLangs, step.ID, getReq.MenuType, getReq.Lang)
		if err1 != nil {
			return nil, err1
		}
		for _, quiz := range questions {
			quizID, err := sdt.SetQuestion(ctx, quiz, *stepID, getReq)
			if err != nil {
				return nil, err
			}
			fields, err := sdt.fc.ListDefaults(sdt.allLangs, quiz.ID, getReq.Lang)

			for _, field := range fields {
				fieldID, err := sdt.SetField(ctx, field, *quizID, getReq)
				if err != nil {
					return nil, err
				}
				options, err1 := sdt.oc.ListDefaults(field.ID)
				if err1 != nil {
					return nil, err1
				}
				for _, opt := range options {
					if err := sdt.SetOption(ctx, opt, *fieldID, getReq); err != nil {
						return nil, err
					}
				}
			}
		}
	}
	msg1, err := sdt.CreateDescription(ctx, getReq)
	if err != nil {
		return nil, err
	}

	msg2 := SuccessMessage{Message: fmt.Sprintf("Default template set successfully for: %v", getReq.NewEmail)}
	msgs := []SuccessMessage{*msg1, msg2}
	return msgs, err
}

func (sdt *SetDefaultTemp) CreateEss(ctx context.Context, rc io.ReadCloser) (msgs []SuccessMessage, err error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		getReq  SetDefaultRequest
		subObjs []models.OssEesResultTbl2YearFormula
		all     string = "all"
	)
	if err = json.NewDecoder(rc).Decode(&getReq); err != nil {
		err = fmt.Errorf("%w: %v", ErrBadInput, err)
		return
	}
	if !Can(ctx, CreateEesSetDefTemp, uuid.Nil, cv.User.Country) {
		err = ErrUnauthorized
		return
	}
	if strings.ToLower(getReq.Lang) == all {
		sdt.allLangs = true
	} else {
		sdt.allLangs = false
	}
	sdt.eesCalcCall = true
	sdt.onboardingCall = false
	sdt.stepItemCall = false
	sdt.stepResCall = false
	sdt.descCall = false

	results, err := sdt.oerc.ListDefaults(sdt.allLangs, getReq.Lang)
	if err != nil {
		return
	}

	if err = sdt.DeleteExisting(ctx, getReq); err != nil {
		return
	}

	for _, res := range results {
		newRes, err := sdt.SetEesStep(ctx, res, getReq)
		if err != nil {
			return nil, err
		}
		if err := sdt.oerc.st.DB().Where("result_id = ?", res.ID).Find(&subObjs).Error; err != nil {
			return nil, err
		}
		for _, _form := range subObjs {
			if err := sdt.SetEesYearFormula(ctx, _form, newRes.ID); err != nil {
				return nil, err
			}
		}
	}
	msg0, err0 := sdt.CreateDescription(ctx, getReq)
	if err0 != nil {
		err = err0
		return
	}
	msg1, err1 := sdt.CreateStep(ctx, getReq)
	if err1 != nil {
		err = err1
		return
	}
	msg2, err2 := sdt.CreateStepResult(ctx, getReq)
	if err2 != nil {
		return nil, err2
	}
	msg3 := SuccessMessage{Message: fmt.Sprintf("Ees default template set successfully for: %v", getReq.NewEmail)}
	msg := []SuccessMessage{*msg0, *msg1, *msg2, msg3}
	return msg, err
}

func (sdt *SetDefaultTemp) CreateStep(ctx context.Context, req SetDefaultRequest) (*SuccessMessage, error) {
	var (
		stepFields []models.StepField
	)
	sdt.stepItemCall = true
	sdt.onboardingCall = false
	sdt.eesCalcCall = false
	sdt.stepResCall = false
	sdt.descCall = false

	steps, err := sdt.sic.ListDefaults(sdt.allLangs, req.Lang)
	if err != nil {
		return nil, err
	}
	if err := sdt.DeleteExisting(ctx, req); err != nil {
		return nil, err
	}
	for _, step := range steps {
		newStep, err := sdt.SetStepItem(ctx, step, req)
		if err != nil {
			return nil, err
		}
		if err := sdt.sic.st.DB().Where("step_id = ?", step.ID).Find(&stepFields).Error; err != nil {
			return nil, err
		}
		for _, field := range stepFields {
			if err := sdt.SetStepField(ctx, field, req, newStep.ID); err != nil {
				return nil, err
			}
		}
	}
	msg := SuccessMessage{Message: fmt.Sprintf("Step default template set successfully for: %v", req.NewEmail)}
	return &msg, nil
}

// func (sdt *SetDefaultTemp) ListDefDescs(allLangs bool, menuType, lang string) ([]models.OnboardingDescription, error) {
// 	var descriptions []models.OnboardingDescription
// 	if allLangs {
// 		if err := sdt.oerc.st.DB().Where("menu_type = ?", menuType).Where("is_default_template = '1'").Find(&descriptions).Error; err != nil {
// 			return nil, err
// 		}
// 	}
// 	if err := sdt.oerc.st.DB().Where("menu_type = ?", menuType).Where("lang = ?", lang).Where("is_default_template = '1'").Find(&descriptions).Error; err != nil {
// 		return nil, err
// 	}
// 	return descriptions, nil
// }

func (sdt *SetDefaultTemp) CreateDescription(ctx context.Context, req SetDefaultRequest) (msg *SuccessMessage, err error) {
	sdt.descCall = true
	sdt.stepResCall = false
	sdt.onboardingCall = false
	sdt.eesCalcCall = false
	sdt.stepItemCall = false

	defaults, err := sdt.od.ListDefaults(sdt.allLangs, req.MenuType, req.Lang)
	if err != nil {
		return
	}
	if err = sdt.DeleteExisting(ctx, req); err != nil {
		return
	}
	for _, def := range defaults {
		err := sdt.SetDescription(ctx, def, req)
		if err != nil {
			return nil, err
		}
	}
	msg = &SuccessMessage{Message: fmt.Sprintf("Onboarding Descriptions default template set successfully for: %v", req.NewEmail)}
	return
}

func (sdt *SetDefaultTemp) CreateStepResult(ctx context.Context, req SetDefaultRequest) (*SuccessMessage, error) {
	var (
		subObjs []models.ResultSubObject
	)
	sdt.stepResCall = true
	sdt.onboardingCall = false
	sdt.eesCalcCall = false
	sdt.stepItemCall = false

	results, err := sdt.src.ListDefaults(sdt.allLangs, req.Lang)
	if err != nil {
		return nil, err
	}
	if err := sdt.DeleteExisting(ctx, req); err != nil {
		return nil, err
	}
	for _, res := range results {
		newRes, err := sdt.SetStepResult(ctx, res, req)
		if err != nil {
			return nil, err
		}
		if err := sdt.src.st.DB().Where("result_id = ?", res.ID).Find(&subObjs).Error; err != nil {
			return nil, err
		}
		for _, sub := range subObjs {
			if err := sdt.SetResultSubObj(ctx, sub, newRes.ID); err != nil {
				return nil, err
			}
		}
	}
	msg := SuccessMessage{Message: fmt.Sprintf("StepResult default template set successfully for: %v", req.NewEmail)}
	return &msg, nil
}

func (sdt *SetDefaultTemp) DeleteExisting(ctx context.Context, req SetDefaultRequest) error {
	if sdt.onboardingCall {
		if err := sdt.DeleteOnboardingCall(ctx, req); err != nil {
			return err
		}
	} else if sdt.eesCalcCall {
		if err := sdt.DeleteEesCalcCall(ctx, req); err != nil {
			return err
		}
	} else if sdt.stepItemCall {
		if err := sdt.DeleteStepItemCall(ctx, req); err != nil {
			return err
		}
	} else if sdt.stepResCall {
		if err := sdt.DeleteStepResCall(ctx, req); err != nil {
			return err
		}
	} else if sdt.descCall {
		if err := sdt.DeleteDescCall(ctx, req); err != nil {
			return err
		}
	}
	return nil //errors.New("Bad request to delete existing items.")
}

func (sdt *SetDefaultTemp) DeleteDescCall(ctx context.Context, req SetDefaultRequest) (err error) {
	var descriptions []models.OnboardingDescription
	if sdt.allLangs {
		if err = sdt.od.st.DB().Where("oss_admin_id = ?", req.NewEmail).Where("is_default_template = '0'").Unscoped().Delete(&descriptions).Error; err != nil {
			return
		}
	}
	if err = sdt.od.st.DB().Where("oss_admin_id = ?", req.NewEmail).Where("lang = ?", req.Lang).Where("is_default_template = '0'").Unscoped().Delete(&descriptions).Error; err != nil {
		return
	}
	return
}

func (sdt *SetDefaultTemp) DeleteStepResCall(ctx context.Context, req SetDefaultRequest) error {
	var (
		stepResults []models.StepsResult
		resSubObjs  []models.ResultSubObject
	)
	if sdt.allLangs {
		if err := sdt.src.st.DB().Where("oss_admin_id = ?", req.NewEmail).Where("is_default_template = '0'").Find(&stepResults).Error; err != nil {
			return err
		}
	} else {
		if err := sdt.src.st.DB().Where("oss_admin_id = ?", req.NewEmail).Where("is_default_template = '0'").Where("lang = ?", req.Lang).Find(&stepResults).Error; err != nil {
			return err
		}
	}
	for _, res := range stepResults {
		if err := sdt.src.st.DB().Where("result_id = ?", res.ID).Find(&resSubObjs).Error; err != nil {
			return err
		}
		for _, obj := range resSubObjs {
			if err := sdt.sic.st.DB().Unscoped().Delete(&obj).Error; err != nil {
				return err
			}
		}
		if err := sdt.sic.st.DB().Unscoped().Delete(&res).Error; err != nil {
			return err
		}
	}
	return nil
}

func (sdt *SetDefaultTemp) DeleteStepItemCall(ctx context.Context, req SetDefaultRequest) error {
	var (
		stepItems []models.StepItem
	)
	if sdt.allLangs {
		if err := sdt.sic.st.DB().Where("oss_admin_id = ?", req.NewEmail).Where("is_default_template = '0'").Find(&stepItems).Error; err != nil {
			return err
		}
	} else {
		if err := sdt.oerc.st.DB().Where("oss_admin_id = ?", req.NewEmail).Where("is_default_template = '0'").Where("lang = ?", req.Lang).Find(&stepItems).Error; err != nil {
			return err
		}
	}
	for _, step := range stepItems {
		var stepFields []models.StepField
		if err := sdt.sic.st.DB().Where("step_id = ?", step.ID).Find(&stepFields).Error; err != nil {
			return err
		}
		for _, field := range stepFields {
			if err := sdt.sic.st.Delete(ctx, models.Wrap(field)); err != nil {
				return err
			}
		}
		if err := sdt.sic.st.Delete(ctx, models.Wrap(step)); err != nil {
			return err
		}
	}
	return nil
}

func (sdt *SetDefaultTemp) DeleteEesCalcCall(ctx context.Context, req SetDefaultRequest) error {
	var (
		eesSteps []models.OssEesResultTbl2
	)
	if sdt.allLangs {
		if err := sdt.oerc.st.DB().Where("oss_admin_id = ?", req.NewEmail).Where("is_default_template = '0'").Find(&eesSteps).Error; err != nil {
			return err
		}
	} else {
		if err := sdt.oerc.st.DB().Where("oss_admin_id = ?", req.NewEmail).Where("is_default_template = '0'").Where("lang = ?", req.Lang).Find(&eesSteps).Error; err != nil {
			return err
		}
	}
	for _, step := range eesSteps {
		var eesStepFields []models.OssEesResultTbl2YearFormula
		if err := sdt.oerc.st.DB().Where("result_id = ?", step.ID).Find(&eesStepFields).Error; err != nil {
			return err
		}
		for _, field := range eesStepFields {
			if err := sdt.oerc.st.Delete(ctx, models.Wrap(field)); err != nil {
				return err
			}
		}
		if err := sdt.oerc.st.Delete(ctx, models.Wrap(step)); err != nil {
			return err
		}
	}
	return nil
}

func (sdt *SetDefaultTemp) DeleteOnboardingCall(ctx context.Context, req SetDefaultRequest) error {
	var (
		steps []models.OnboardingResidentStep
	)
	if sdt.allLangs {
		if err := sdt.sc.st.DB().Where("oss_admin_id = ?", req.NewEmail).Where("menu_type = ?", req.MenuType).Where("is_default_template = '0'").Find(&steps).Error; err != nil {
			return err
		}
	} else {
		if err := sdt.sc.st.DB().Where("oss_admin_id = ?", req.NewEmail).Where("menu_type = ?", req.MenuType).Where("is_default_template = '0'").Where("lang = ?", req.Lang).Find(&steps).Error; err != nil {
			return err
		}
	}
	for _, step := range steps {
		var questions []models.ResidentStepQuestion
		if err := sdt.qc.st.DB().Where("step_id = ?", step.ID).Find(&questions).Error; err != nil {
			return err
		}
		for _, quiz := range questions {
			var fields []models.OnboardingResidentStepField
			if err := sdt.fc.st.DB().Where("question_id = ?", quiz.ID).Find(&fields).Error; err != nil {
				return err
			}
			for _, field := range fields {
				var options []models.StepFieldOption
				if err := sdt.oc.st.DB().Where("step_field_id = ?", field.ID).Find(&options).Error; err != nil {
					return err
				}
				for _, opt := range options {
					if err := sdt.oc.st.Delete(ctx, models.Wrap(opt)); err != nil {
						return err
					}
				}
				if err := sdt.fc.st.Delete(ctx, models.Wrap(field)); err != nil {
					return err
				}
			}
			if err := sdt.qc.st.Delete(ctx, models.Wrap(quiz)); err != nil {
				return err
			}
		}
		if err := sdt.sc.st.Delete(ctx, models.Wrap(step)); err != nil {
			return err
		}
	}
	return nil
}

func (sdt *SetDefaultTemp) SetStepItem(ctx context.Context, step models.StepItem, getReq SetDefaultRequest) (*models.StepItem, error) {
	stepItem := models.StepItem{
		Index:             step.Index,
		Name:              step.Name,
		Require:           step.Require,
		OssAdminID:        getReq.NewEmail,
		Lang:              step.Lang,
		IsDefaultTemplate: 0,
		Value: models.Value{
			CreatedAt: step.CreatedAt,
			UpdatedAt: step.UpdatedAt,
		},
	}
	doc, err := sdt.sic.st.Create(ctx, sanitizeEntityFields(&stepItem))
	return doc.Data.(*models.StepItem), err
}

func (sdt *SetDefaultTemp) SetStepField(ctx context.Context, field models.StepField, getReq SetDefaultRequest, stepID uuid.UUID) error {
	newField := models.StepField{
		StepID:              stepID,
		Index:               field.Index,
		Name:                field.Name,
		Require:             field.Require,
		Placeholder:         field.Placeholder,
		TextNumber:          field.TextNumber,
		Lang:                field.Lang,
		IsDefaultTemplate:   0,
		IsDefaultTemplateID: field.ID.String(),
		Value: models.Value{
			CreatedAt: field.CreatedAt,
			UpdatedAt: field.UpdatedAt,
		},
	}
	_, err := sdt.sic.st.Create(ctx, sanitizeEntityFields(&newField))
	if err != nil {
		return err
	}
	return nil
}

func (sdt *SetDefaultTemp) SetStepResult(ctx context.Context, res models.StepsResult, getReq SetDefaultRequest) (*models.StepsResult, error) {
	result := models.StepsResult{
		ResultTitle:       res.ResultTitle,
		CostVatXcl:        res.CostVatXcl,
		UnitVatXcl:        res.UnitVatXcl,
		CostVatInc:        res.CostVatInc,
		UnitVatInc:        res.UnitVatInc,
		Vat:               res.Vat,
		TotalVatInc:       res.TotalVatInc,
		TotalVatXcl:       res.TotalVatXcl,
		OssAdminID:        getReq.NewEmail,
		Lang:              res.Lang,
		TableType:         res.TableType,
		IsDefaultTemplate: 0,
		Value: models.Value{
			CreatedAt: res.CreatedAt,
			UpdatedAt: res.UpdatedAt,
		},
	}
	doc, err := sdt.src.st.Create(ctx, sanitizeEntityFields(&result))
	if err != nil {
		return nil, err
	}
	return doc.Data.(*models.StepsResult), nil
}

func (sdt *SetDefaultTemp) SetResultSubObj(ctx context.Context, subObj models.ResultSubObject, resID uuid.UUID) error {
	newObj := models.ResultSubObject{
		ResultID:          resID,
		CostType:          subObj.CostType,
		FieldID:           subObj.FieldID,
		FieldName:         subObj.FieldName,
		Index:             subObj.Index,
		Lang:              subObj.Lang,
		IsDefaultTemplate: 0,
	}
	return sdt.src.st.DB().Save(&newObj).Error
}

func (sdt *SetDefaultTemp) SetDescription(ctx context.Context, descr models.OnboardingDescription, req SetDefaultRequest) (err error) {
	description := models.OnboardingDescription{
		Description:       descr.Description,
		Lang:              descr.Lang,
		OssAdminID:        req.NewEmail,
		MenuType:          req.MenuType,
		IsDefaultTemplate: 0,

		Value: models.Value{
			CreatedAt: descr.CreatedAt,
			UpdatedAt: descr.UpdatedAt,
		},
	}
	_, err = sdt.od.st.Create(ctx, sanitizeEntityFields(&description))
	if err != nil {
		return
	}
	return
}

func (sdt *SetDefaultTemp) SetEesStep(ctx context.Context, step models.OssEesResultTbl2, getReq SetDefaultRequest) (*models.OssEesResultTbl2, error) {
	stepItem := models.OssEesResultTbl2{
		ResultTitle:       step.ResultTitle,
		OssAdminID:        getReq.NewEmail,
		Lang:              step.Lang,
		TableType:         step.TableType,
		IsDefaultTemplate: 0,

		Value: models.Value{
			CreatedAt: step.CreatedAt,
			UpdatedAt: step.UpdatedAt,
		},
	}
	doc, err := sdt.oerc.st.Create(ctx, sanitizeEntityFields(&stepItem))
	if err != nil {
		return nil, err
	}
	return doc.Data.(*models.OssEesResultTbl2), nil
}

func (sdt *SetDefaultTemp) SetEesYearFormula(ctx context.Context, yrForm models.OssEesResultTbl2YearFormula, resID uuid.UUID) error {
	newForm := models.OssEesResultTbl2YearFormula{
		ResultID:  resID,
		FieldID:   yrForm.FieldID,
		FieldName: yrForm.FieldName,
		Lang:      yrForm.Lang,

		Value: models.Value{
			CreatedAt: yrForm.CreatedAt,
			UpdatedAt: yrForm.UpdatedAt,
		},
	}
	if _, err := sdt.oerc.st.Create(ctx, sanitizeEntityFields(&newForm)); err != nil {
		return err
	}
	return nil
}

func (sdt *SetDefaultTemp) SetStep(ctx context.Context, step models.OnboardingResidentStep, getReq SetDefaultRequest) (*uuid.UUID, error) {

	newStep := models.OnboardingResidentStep{
		MenuType:          getReq.MenuType,
		Index:             step.Index,
		Name:              step.Name,
		Require:           step.Require,
		OssAdminID:        getReq.NewEmail,
		DefaultScore:      step.DefaultScore,
		Lang:              step.Lang,
		IsDefaultTemplate: 0,
		Value: models.Value{
			CreatedAt: step.CreatedAt,
			UpdatedAt: step.UpdatedAt,
		},
	}

	doc, err := sdt.sc.st.Create(ctx, sanitizeEntityFields(&newStep))
	if err != nil {
		return nil, err
	}
	return &doc.ID, nil
}

func (sdt *SetDefaultTemp) SetQuestion(ctx context.Context, quiz models.ResidentStepQuestion, stepID uuid.UUID, getReq SetDefaultRequest) (*uuid.UUID, error) {
	newQuiz := models.ResidentStepQuestion{
		StepID:            stepID,
		Index:             quiz.Index,
		Name:              quiz.Name,
		DefaultScore:      quiz.DefaultScore,
		Lang:              quiz.Lang,
		IsDefaultTemplate: 0,
		Value: models.Value{
			CreatedAt: quiz.CreatedAt,
			UpdatedAt: quiz.UpdatedAt,
		},
	}

	doc, err := sdt.qc.st.Create(ctx, sanitizeEntityFields(&newQuiz))
	if err != nil {
		return nil, err
	}
	return &doc.ID, nil
}

func (sdt *SetDefaultTemp) SetField(ctx context.Context, field models.OnboardingResidentStepField, quizID uuid.UUID, getReq SetDefaultRequest) (*uuid.UUID, error) {
	newField := models.OnboardingResidentStepField{
		Index:             field.Index,
		QuestionID:        quizID,
		Name:              field.Name,
		Placeholder:       field.Placeholder,
		InputType:         field.InputType,
		Require:           field.Require,
		DefaultScore:      field.DefaultScore,
		IsDefaultTemplate: 0,
		Lang:              field.Lang,
		Value: models.Value{
			CreatedAt: field.CreatedAt,
			UpdatedAt: field.UpdatedAt,
		},
	}
	if err := sdt.oerc.st.DB().Save(&newField).Error; err != nil {
		return nil, err
	}
	if err := sdt.oerc.st.DB().First(&newField).Error; err != nil {
		return nil, err
	}
	return &newField.ID, nil
}

func (sdt *SetDefaultTemp) SetOption(ctx context.Context, option models.StepFieldOption, fieldID uuid.UUID, getReq SetDefaultRequest) error {
	newOption := models.StepFieldOption{
		StepFieldID:       fieldID,
		Title:             option.Title,
		OptionValue:       option.OptionValue,
		Image:             option.Image,
		DefaultScore:      option.DefaultScore,
		IsDefaultTemplate: 0,
		Value: models.Value{
			CreatedAt: option.CreatedAt,
			UpdatedAt: option.UpdatedAt,
		},
	}

	if _, err := sdt.oc.st.Create(ctx, sanitizeEntityFields(&newOption)); err != nil {
		return err
	}
	return nil
}
