package controller

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/google/uuid"
	"github.com/gorilla/sessions"
)

type OnboardingResidentStepBackup struct {
	st      stores.Store
	qc      OnboardingResidentStepBackupQuestion
	fc      OnboardingResidentStepBackupField
	oc      StepBackupFieldOption
	ss      sessions.Store
	country models.Country
}

func NewOnboardingResidentStepBackup(env *services.Env) *OnboardingResidentStepBackup {
	return &OnboardingResidentStepBackup{
		st:      env.OnboardingResidentStepBackupStore,
		qc:      *NewOnboardingResidentStepBackupQuestion(env),
		fc:      *NewOnboardingResidentStepBackupField(env),
		oc:      *NewStepBackupFieldOption(env),
		ss:      env.SessionStore,
		country: "Latvia",
	}
}

func (orsb *OnboardingResidentStepBackup) Create(ctx context.Context, rc io.ReadCloser, r *http.Request) (*string, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		getRequest BackupRequest
		steps      []models.OnboardingResidentStep
		filter     stores.Filter
		backupTime string = time.Now().String()
		wg         sync.WaitGroup
	)

	filter.OssAdminID = getRequest.OssAdminID

	if err := json.NewDecoder(rc).Decode(&getRequest); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateOnboardResStepBackup, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}

	if err := orsb.st.DB().Where("lang = ?", getRequest.Lang).Where("menu_type = ?", getRequest.MenuType).Where("oss_admin_id = ?", getRequest.OssAdminID).Find(&steps).Error; err != nil {
		return nil, err
	}

	fmt.Printf("%d steps found\n", len(steps))

	for _, step := range steps {
		var (
			stepID uuid.UUID
		)
		stepErrChan := make(chan error)
		stepIDChan := make(chan uuid.UUID)
		defer close(stepErrChan)
		defer close(stepIDChan)

		go func() {
			defer wg.Done()
			wg.Add(1)

			filter.Lang = step.Lang
			filter.StepID = step.ID

			stepID, err := orsb.BackupSteps(ctx, step, backupTime, getRequest)
			if err != nil {
				stepErrChan <- err
				// os.Exit(1)
				return
			}

			stepIDChan <- *stepID
		}()
		select {
		case err := <-stepErrChan:
			println("From errors channel:", err.Error())
			return nil, err
		case res := <-stepIDChan:
			stepID = res
		}

		wg.Wait()

		var questions []models.ResidentStepQuestion
		if errQ := orsb.st.DB().Where("step_id = ?", step.ID).Find(&questions).Error; errQ != nil {
			errMsg := errors.New(`couldn't list question backups:${errQ}`)
			return nil, errMsg
		}
		for _, quiz := range questions {
			quizErrChan := make(chan error)
			quizIDChan := make(chan uuid.UUID)
			defer close(quizErrChan)
			defer close(quizIDChan)
			var quizID uuid.UUID

			wg.Add(1)
			go func() {
				defer wg.Done()
				quizID, err := orsb.BackupQuestions(ctx, quiz, stepID, backupTime, getRequest)
				if err != nil {
					quizErrChan <- err
				}
				quizIDChan <- *quizID
			}()

			select {
			case err := <-quizErrChan:
				println("From step questions errors channel:", err.Error())
				return nil, err
			case res := <-quizIDChan:
				quizID = res
			}

			wg.Wait()

			var fields []models.OnboardingResidentStepField
			if err := orsb.st.DB().Where("question_id = ?", quiz.ID).Find(&fields).Error; err != nil {
				return nil, err
			}
			for _, field := range fields {
				fieldErrChan := make(chan error)
				fieldIDChan := make(chan uuid.UUID)
				defer close(fieldErrChan)
				defer close(fieldIDChan)
				var fieldID uuid.UUID

				wg.Add(1)
				go func() {
					defer wg.Done()
					fieldID, err := orsb.BackupFields(ctx, field, quizID, backupTime, getRequest)
					if err != nil {
						fieldErrChan <- err
					}
					fieldIDChan <- *fieldID
				}()

				select {
				case err := <-fieldErrChan:
					println("From question fields errors channel:", err.Error())
					return nil, err
				case res := <-fieldIDChan:
					fieldID = res
				}

				wg.Wait()

				var options []models.StepFieldOption
				if err := orsb.st.DB().Where("step_field_id = ?", field.ID).Find(&options).Error; err != nil {
					return nil, err
				}
				for _, option := range options {
					optionIDChan := make(chan uuid.UUID)
					optionErrChan := make(chan error)
					defer close(optionIDChan)
					defer close(optionErrChan)
					// var optionID uuid.UUID

					wg.Add(1)
					go func() {
						defer wg.Done()

						optionID, err := orsb.BackupOptions(ctx, option, fieldID, backupTime, getRequest)
						if err != nil {
							optionErrChan <- err
						}
						optionIDChan <- *optionID
					}()
					select {
					case err := <-optionErrChan:
						return nil, err
					case res := <-optionIDChan:
						println(res.String())
					}
				}
			}
		}
	}
	wg.Wait()

	docs, _, _, err := orsb.st.ListByOssAdminID(ctx, filter)

	Log(ctx, &orsb.ss, r, []string{"onboarding_residents_step", "onboarding_residents_step_field"}, getRequest.MenuType, err.Error(), "POST")

	msg := fmt.Sprintf("BACKUP: [%v] CREATED", docs[0].Data.(*models.OnboardingResidentStepBackup).BackupTitle)

	return &msg, err
}

func (orsb *OnboardingResidentStepBackup) BackupSteps(ctx context.Context, step models.OnboardingResidentStep, bkTime string, getReq BackupRequest) (*uuid.UUID, error) {

	stepBackup := models.OnboardingResidentStepBackup{
		BackupTime:   bkTime,
		BackupTitle:  getReq.Title,
		MenuType:     getReq.MenuType,
		Index:        step.Index,
		Name:         step.Name,
		Require:      step.Require,
		OssAdminID:   step.OssAdminID,
		DefaultScore: step.DefaultScore,
		Lang:         step.Lang,
		Value: models.Value{
			CreatedAt: step.CreatedAt,
			UpdatedAt: step.UpdatedAt,
		},
	}

	doc, err := orsb.st.Create(ctx, sanitizeEntityFields(&stepBackup))
	if err != nil {
		return nil, err
	}
	return &doc.ID, nil
}

func (orsb *OnboardingResidentStepBackup) BackupQuestions(ctx context.Context, quiz models.ResidentStepQuestion, stepID uuid.UUID, bkTime string, getReq BackupRequest) (*uuid.UUID, error) {
	quizBackup := models.ResidentStepQuestionBackup{
		BackupTime:   bkTime,
		MenuType:     getReq.MenuType,
		BackupTitle:  getReq.Title,
		StepID:       stepID,
		Index:        quiz.Index,
		Name:         quiz.Name,
		DefaultScore: quiz.DefaultScore,
		Lang:         quiz.Lang,
		Value: models.Value{
			CreatedAt: quiz.CreatedAt,
			UpdatedAt: quiz.UpdatedAt,
		},
	}

	quizID, err := orsb.qc.Create(ctx, quizBackup)
	if err != nil {
		return nil, err
	}

	return quizID, nil
}

func (orsb *OnboardingResidentStepBackup) BackupFields(ctx context.Context, field models.OnboardingResidentStepField, quizID uuid.UUID, bkTime string, getReq BackupRequest) (*uuid.UUID, error) {
	backupField := models.OnboardingResidentStepFieldBackup{
		BackupTime:   bkTime,
		MenuType:     getReq.MenuType,
		BackupTitle:  getReq.Title,
		Index:        field.Index,
		QuestionID:   quizID,
		Name:         field.Name,
		Placeholder:  field.Placeholder,
		InputType:    field.InputType,
		Require:      field.Require,
		DefaultScore: field.DefaultScore,
		Lang:         field.Lang,
		Value: models.Value{
			CreatedAt: field.CreatedAt,
			UpdatedAt: field.UpdatedAt,
		},
	}

	id, err := orsb.fc.Create(ctx, backupField)
	if err != nil {
		return nil, err
	}

	fmt.Printf("backup field ID: %v\n", id)
	return id, nil
}

func (orsb *OnboardingResidentStepBackup) BackupOptions(ctx context.Context, option models.StepFieldOption, fieldID uuid.UUID, bkTime string, getReq BackupRequest) (*uuid.UUID, error) {
	optionBackup := models.StepFieldOptionBackup{
		BackupTime:   bkTime,
		MenuType:     getReq.MenuType,
		BackupTitle:  getReq.Title,
		StepFieldID:  fieldID,
		Title:        option.Title,
		OptionValue:  option.OptionValue,
		Image:        option.Image,
		DefaultScore: option.DefaultScore,
		Value: models.Value{
			CreatedAt: option.CreatedAt,
			UpdatedAt: option.UpdatedAt,
		},
	}

	if err := orsb.oc.Create(ctx, optionBackup); err != nil {
		return nil, err
	}
	return &optionBackup.ID, nil
}

func (orsb *OnboardingResidentStepBackup) Get(ctx context.Context, r *http.Request, query url.Values) ([]BackupListing, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		stepBackups []models.OnboardingResidentStepBackup
		filter      stores.Filter
	)

	filter.OssAdminID = query.Get("oss_admin_id")
	filter.MenuType = query.Get("menu_type")
	filter.Lang = query.Get("lang")

	if !Can(ctx, GetOnboardingResidentStepBackup, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}

	if strings.ToLower(filter.MenuType) == "all" {
		if err := orsb.st.DB().Where("oss_admin_id = ?", filter.OssAdminID).Where("lang = ?", filter.Lang).Order("created_at DESC").Find(&stepBackups).Error; err != nil {
			return nil, err
		}
		return orsb.ListBackupListings(stepBackups, filter.OssAdminID), nil
	}
	if err := orsb.st.DB().Where("oss_admin_id = ?", filter.OssAdminID).Where("menu_type = ?", filter.MenuType).Where("lang = ?", filter.Lang).Order("created_at DESC").Find(&stepBackups).Error; err != nil {
		return nil, err
	}

	Log(ctx, &orsb.ss, r, []string{"onboarding_residents_step", "onboarding_residents_step_field"}, filter.MenuType, "nil", "GET")

	return orsb.ListBackupListings(stepBackups, filter.OssAdminID), nil
}

func (orsb *OnboardingResidentStepBackup) ListBackupListings(stepBackups []models.OnboardingResidentStepBackup, OssAdminID string) []BackupListing {
	var (
		backupDates    []string
		backupListings []BackupListing
	)
	fmt.Printf("%d backup docs found\n", len(stepBackups))

	// go through all steps backed up and save the time
	for _, backup := range stepBackups {
		backupDates = append(backupDates, backup.BackupTime)
	}

	dates := orsb.RemoveDuplicateTimes(backupDates)

	for _, date := range dates {
		var (
			_steps    []models.OnboardingResidentStepBackup
			questions []models.ResidentStepQuestionBackup
			fields    []models.OnboardingResidentStepFieldBackup
			options   []models.StepFieldOptionBackup
			stepNo    int
			quizNo    int
			fieldNo   int
			optionNo  int
		)
		orsb.st.DB().Model(&_steps).Where("backup_time = ?", date).Count(&stepNo)
		orsb.st.DB().Model(&questions).Where("backup_time = ?", date).Count(&quizNo)
		orsb.st.DB().Model(&fields).Where("backup_time = ?", date).Count(&fieldNo)
		orsb.st.DB().Model(&options).Where("backup_time = ?", date).Count(&optionNo)

		backupListing := BackupListing{
			Steps:      stepNo,
			BackupTime: date,
			OssAdminID: OssAdminID,
			Questions:  quizNo,
			Fields:     fieldNo,
			Options:    optionNo,
		}

		for _, step := range stepBackups {
			if step.BackupTime == date {
				backupListing.BackupTitle = step.BackupTitle
				backupListing.MenuType = step.MenuType
			}
		}
		backupListings = append(backupListings, backupListing)
	}
	return backupListings
}

func (orsb *OnboardingResidentStepBackup) RemoveDuplicateTimes(timeSlice []string) []string {
	allKeys := make(map[string]bool)
	list := []string{}
	for _, item := range timeSlice {
		if _, value := allKeys[item]; !value {
			allKeys[item] = true
			list = append(list, item)
		}
	}
	return list
}

func (orsb *OnboardingResidentStepBackup) Update(ctx context.Context, stepsBackupID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	// cv := services.FromContext(ctx)
	// if !cv.Authorized() {
	// 	return nil, nil, ErrUnauthorized
	// }

	doc, err := orsb.st.Get(ctx, stepsBackupID)
	if err != nil {
		return nil, nil, ErrNotFound
	}

	// if !Can(ctx, UpdateCalcMenu, stepID, doc.Data.(*models.User).Country) {
	// 	return nil, nil, ErrUnauthorized
	// }

	new := *doc.Data.(*models.OnboardingResidentStepBackup)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	doc.Data = &new

	_, err = orsb.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}

	result, deps, err := orsb.st.Unwrap(ctx, stepsBackupID)

	_doc, errS := orsb.StepBackupQuestionsList(*result.Data.(*models.OnboardingResidentStepBackup))
	if errS != nil {
		return nil, nil, errS
	}

	return &_doc, deps, err
}

func (orsb *OnboardingResidentStepBackup) Restore(ctx context.Context, r *http.Request, filter stores.Filter, rc io.ReadCloser) (*string, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		getRequest        BackupListingRequest
		existingSteps     []models.OnboardingResidentStep
		existingQuestions []models.ResidentStepQuestion
		existingFields    []models.OnboardingResidentStepField
		existingOptions   []models.StepFieldOption
	)
	if err := json.NewDecoder(rc).Decode(&getRequest); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, RestoreOnboardingResidentStepBackup, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	filter.OssAdminID = getRequest.OssAdminID
	filter.BackupTime = getRequest.BackupTime
	filter.MenuType = getRequest.MenuType
	filter.Lang = getRequest.Lang

	docs, _, _, err := orsb.st.ListBackups(ctx, filter)

	if err := orsb.st.DB().Where("oss_admin_id = ?", getRequest.OssAdminID).Where("menu_type = ?", getRequest.MenuType).Where("lang = ?", getRequest.Lang).Find(&existingSteps).Error; err != nil {
		return nil, err
	}

	for _, step := range existingSteps {
		if err := orsb.st.DB().Where("step_id = ?", step.ID).Find(&existingQuestions).Error; err != nil {
			return nil, err
		}
		if err := orsb.st.DB().Unscoped().
			Where("id = ?", step.ID).
			Delete(&models.OnboardingResidentStep{}).Error; err != nil {
			return nil, err
		}
	}

	for _, quiz := range existingQuestions {
		if err := orsb.st.DB().Where("question_id = ?", quiz.ID).Find(&existingFields).Error; err != nil {
			return nil, err
		}
		if err := orsb.st.DB().Unscoped().
			Where("id = ?", quiz.ID).
			Delete(&models.ResidentStepQuestion{}).Error; err != nil {
			return nil, err
		}
	}

	for _, field := range existingFields {
		if err := orsb.st.DB().Where("step_field_id = ?", field.ID).Find(&existingOptions).Error; err != nil {
			return nil, err
		}
		if err := orsb.st.DB().Unscoped().
			Where("id = ?", field.ID).
			Delete(&models.OnboardingResidentStepField{}).Error; err != nil {
			return nil, err
		}
	}

	for _, opt := range existingOptions {
		if err := orsb.st.DB().Unscoped().
			Where("id = ?", opt.ID).
			Delete(&models.StepFieldOption{}).Error; err != nil {
			return nil, err
		}
	}

	if err := orsb.updateAll(ctx, docs); err != nil {
		return nil, err
	}

	Log(ctx, &orsb.ss, r, []string{"onboarding_residents_step", "onboarding_residents_step_field"}, getRequest.MenuType, err.Error(), "PUT")

	success := fmt.Sprintf("Restore done successfully for backup: %v\n", docs[0].Data.(*models.OnboardingResidentStepBackup).BackupTitle)
	return &success, err
}

func (orsb *OnboardingResidentStepBackup) updateAll(ctx context.Context, docs []models.Document) error {
	for _, doc := range docs {
		step := doc.Data.(*models.OnboardingResidentStepBackup)

		_stepID, errS := orsb.updateStep(step)
		if errS != nil {
			return errS
		}
		for _, quiz := range step.Questions {
			_quizID, errQ := orsb.updateQuestion(&quiz, _stepID)
			if errQ != nil {
				return errQ
			}
			for _, field := range quiz.StepFields {
				_fieldID, errF := orsb.updateField(&field, _quizID)
				if errF != nil {
					return errF
				}
				for _, option := range field.Options {
					if err := orsb.updateOption(&option, _fieldID); err != nil {
						return err
					}
				}
			}
		}
	}
	return nil
}

func (orsb *OnboardingResidentStepBackup) updateStep(stepBackup *models.OnboardingResidentStepBackup) (*uuid.UUID, error) {
	step := models.OnboardingResidentStep{
		Index:        stepBackup.Index,
		Name:         stepBackup.Name,
		Require:      stepBackup.Require,
		MenuType:     stepBackup.MenuType,
		OssAdminID:   stepBackup.OssAdminID,
		DefaultScore: stepBackup.DefaultScore,
		Lang:         stepBackup.Lang,
		Value: models.Value{
			CreatedAt: stepBackup.CreatedAt,
			UpdatedAt: stepBackup.UpdatedAt,
		},
	}
	err := orsb.st.DB().Save(&step).Error
	if err != nil {
		return nil, err
	}
	return &step.ID, nil
}

func (orsb *OnboardingResidentStepBackup) updateQuestion(quizBackup *models.ResidentStepQuestionBackup, stepID *uuid.UUID) (*uuid.UUID, error) {
	quiz := models.ResidentStepQuestion{
		StepID:       *stepID,
		Index:        quizBackup.Index,
		DefaultScore: quizBackup.DefaultScore,
		Name:         quizBackup.Name,
		Lang:         quizBackup.Lang,
		Value: models.Value{
			CreatedAt: quizBackup.CreatedAt,
			UpdatedAt: quizBackup.UpdatedAt,
		},
	}
	_ = orsb.st.DB().Save(&quiz).Error
	return &quiz.ID, nil
}

func (orsb *OnboardingResidentStepBackup) updateField(fieldBackup *models.OnboardingResidentStepFieldBackup, quizID *uuid.UUID) (*uuid.UUID, error) {
	field := models.OnboardingResidentStepField{
		Index:        fieldBackup.Index,
		QuestionID:   *quizID,
		Name:         fieldBackup.Name,
		Placeholder:  fieldBackup.Placeholder,
		InputType:    fieldBackup.InputType,
		Require:      fieldBackup.Require,
		DefaultScore: fieldBackup.DefaultScore,
		Lang:         fieldBackup.Lang,
		Value: models.Value{
			CreatedAt: fieldBackup.CreatedAt,
			UpdatedAt: fieldBackup.UpdatedAt,
		},
	}
	_ = orsb.st.DB().Save(&field).Error
	return &field.ID, nil
}

func (orsb *OnboardingResidentStepBackup) updateOption(optionBackup *models.StepFieldOptionBackup, fieldID *uuid.UUID) error {
	option := models.StepFieldOption{
		StepFieldID:  *fieldID,
		Title:        optionBackup.Title,
		OptionValue:  optionBackup.OptionValue,
		Image:        optionBackup.Image,
		DefaultScore: optionBackup.DefaultScore,
		Value: models.Value{
			CreatedAt: optionBackup.CreatedAt,
			UpdatedAt: optionBackup.UpdatedAt,
		},
	}
	return orsb.st.DB().Save(&option).Error
}

func (orsb *OnboardingResidentStepBackup) MakeDocs(steps []models.OnboardingResidentStepBackup, docs []models.Document) ([]models.Document, error) {

	for _, step := range steps {
		doc, err := orsb.StepBackupQuestionsList(step)
		if err != nil {
			return nil, err
		}
		docs = append(docs, doc)
	}
	return docs, nil

}

func (orsb *OnboardingResidentStepBackup) StepBackupQuestionsList(step models.OnboardingResidentStepBackup) (models.Document, error) {

	var (
		_doc      models.Document
		questions []models.ResidentStepQuestionBackup
	)
	if err := orsb.st.DB().Order("created_at ASC").Where("step_id = ?", step.ID).Find(&questions).Error; err != nil {
		return _doc, err
	}
	for i, quiz := range questions {
		if err := orsb.AddStepBackupQuestionFields(&quiz); err != nil {
			return _doc, err
		}
		questions[i] = quiz
	}
	step.Questions = questions

	doc := models.Document{
		ID:        step.ID,
		Kind:      step.Kind(),
		Data:      step,
		Timestamp: step.UpdatedAt,
	}

	return doc, nil
}

// AddStepBackupQuestionFields nested objects to document
func (orsb *OnboardingResidentStepBackup) AddStepBackupQuestionFields(question *models.ResidentStepQuestionBackup) error {
	var stepBackupQuestionFields []models.OnboardingResidentStepFieldBackup

	if err := orsb.st.DB().Order("created_at ASC").Where("question_id = ?", question.ID).Find(&stepBackupQuestionFields).Error; err != nil {
		return err
	}
	for i, field := range stepBackupQuestionFields {
		options, err := orsb.AddStepBackupFieldOptions(&field)
		if err != nil {
			return err
		}
		field.Options = options
		stepBackupQuestionFields[i] = field
	}
	question.StepFields = stepBackupQuestionFields
	return nil
}

// AddStepFieldOptions nested objects to document
func (orsb *OnboardingResidentStepBackup) AddStepBackupFieldOptions(stepField *models.OnboardingResidentStepFieldBackup) ([]models.StepFieldOptionBackup, error) {
	var stepBackupFieldOptions []models.StepFieldOptionBackup

	if err := orsb.st.DB().Order("created_at ASC").Where("step_field_id = ?", stepField.ID).Find(&stepBackupFieldOptions).Error; err != nil {
		return nil, err
	}
	return stepBackupFieldOptions, nil
}

func (orsb *OnboardingResidentStepBackup) DeleteOnboardingResidentBackup(ctx context.Context, uid uuid.UUID) error {
	// cv := services.FromContext(ctx)
	// if !Can(ctx, DeleteCalcMenu, uid, cv.User.Country) {
	// 	return ErrUnauthorized
	// }

	doc, err := orsb.st.Get(ctx, uid)
	if err != nil {
		return err
	}

	return orsb.st.Delete(ctx, doc)
}

func (orsb *OnboardingResidentStepBackup) FetchOnboardingResidentBackup(ctx context.Context, ids []uuid.UUID) ([]models.OnboardingResidentStepBackup, error) {
	var result []models.OnboardingResidentStepBackup
	return result, orsb.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
