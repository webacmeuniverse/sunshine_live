package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/google/uuid"
	"github.com/gorilla/sessions"
)

type EesCalcBackup struct {
	sbc    *StepBackup
	sfbc   *StepFieldBackup
	srbc   *StepsResultBackup
	oert2b *OssEesResultTbl2
	rsobc  *ResultSubObjectBackup

	sc    *StepItem
	sfc   *StepFieldOption
	src   *StepsResult // steps-result and result-sub-object controller
	oert2 *OssEesResultTbl2

	bkTime  string
	bkTitle string
	c_v_i   string
	c_v_x   string
	t_v_i   string
	t_v_x   string

	ss *sessions.Store
}

type StepBackup struct {
	st stores.Store
}

type StepFieldBackup struct {
	st stores.Store
}

type StepsResultBackup struct {
	st stores.Store
}

type OssEesTbl2Backup struct {
	st stores.Store
}

type ResultSubObjectBackup struct {
	st stores.Store
}

func NewStepBackup(env *services.Env) *StepBackup {
	return &StepBackup{
		st: env.StepBackupStore,
	}
}

func NewStepFieldBackup(env *services.Env) *StepFieldBackup {
	return &StepFieldBackup{
		st: env.StepFieldBackupStore,
	}
}

func NewStepsResultBackup(env *services.Env) *StepsResultBackup {
	return &StepsResultBackup{
		st: env.StepsResultBackupStore,
	}
}

func NewOssEesTbl2Backup(env *services.Env) *OssEesTbl2Backup {
	return &OssEesTbl2Backup{
		st: env.OssEesTable2Store,
	}
}

func NewResultSubObjectBackup(env *services.Env) *ResultSubObjectBackup {
	return &ResultSubObjectBackup{
		st: env.ResultSubObjectBackupStore,
	}
}

func NewEesCalcBackup(env *services.Env) *EesCalcBackup {
	sbc := NewStepBackup(env)
	sfbc := NewStepFieldBackup(env)
	srbc := NewStepsResultBackup(env)
	oert2b := NewOssEesResultTbl2(env)
	rsobc := NewResultSubObjectBackup(env)

	sc := NewStepItem(env)
	sfc := NewStepFieldOption(env)
	src := NewStepsResultItem(env)
	oert2 := NewOssEesResultTbl2(env)

	return &EesCalcBackup{
		sbc:    sbc,
		sfbc:   sfbc,
		srbc:   srbc,
		oert2b: oert2b,
		rsobc:  rsobc,

		sc:    sc,
		sfc:   sfc,
		src:   src, // steps-result and result-sub-object controller
		oert2: oert2,
		ss:    &env.SessionStore,
		c_v_i: "COST_VAT_INC",
		c_v_x: "COST_VAT_XCL",
		t_v_i: "TOTAL_VAT_INC",
		t_v_x: "TOTAL_VAT_XCL",
	}
}

func (ecb *EesCalcBackup) Create(ctx context.Context, r *http.Request) (*SuccessMessage, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		backupReq     EesBackupRequest
		rc            io.ReadCloser = r.Body
		table2results []models.OssEesResultTbl2
		yearVals      []models.OssEesResultTbl2YearFormula
	)
	if err := json.NewDecoder(rc).Decode(&backupReq); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateEesCalcBackup, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	ecb.bkTime = time.Now().String()
	ecb.bkTitle = backupReq.Title

	steps, err := ecb.sc.ListByOss(ctx, backupReq.OssAdminID, backupReq.Lang)
	if err != nil {
		return nil, err
	}
	if len(steps) < 1 {
		msg := SuccessMessage{Message: "No steps found to backup :("}
		return &msg, nil
	}

	for _, step := range steps {
		stepID, err := ecb.BackupStep(ctx, step)
		if err != nil {
			return nil, err
		}
		stepFields, err := ecb.sc.StepFieldsList(ecb.sc.st.DB(), step.ID)
		if err != nil {
			return nil, err
		}
		for _, field := range stepFields {
			if err := ecb.BackupField(ctx, field, *stepID); err != nil {
				return nil, err
			}
		}
	}

	stepsResult, errS := ecb.src.ListByOssAdmin(ctx, backupReq.OssAdminID)
	if errS != nil {
		return nil, errS
	}
	for _, res := range stepsResult {
		resID, err := ecb.BackupStepsResult(ctx, res)
		if err != nil {
			return nil, err
		}

		if err := ecb.ResultSubObjBackup(ctx, res.CostVatInc, *resID); err != nil {
			return nil, err
		}
		if err := ecb.ResultSubObjBackup(ctx, res.CostVatXcl, *resID); err != nil {
			return nil, err
		}
		if err := ecb.ResultSubObjBackup(ctx, res.TotalVatInc, *resID); err != nil {
			return nil, err
		}
		if err := ecb.ResultSubObjBackup(ctx, res.TotalVatXcl, *resID); err != nil {
			return nil, err
		}
	}

	if err := ecb.oert2b.st.DB().Where("oss_admin_id = ?", backupReq.OssAdminID).Where("lang = ?", backupReq.Lang).Find(&table2results).Error; err != nil {
		return nil, err
	}
	for _, res := range table2results {
		resID, err := ecb.BackupOssEesResult(ctx, res)
		if err != nil {
			return nil, err
		}
		if err1 := ecb.oert2b.st.DB().Where("result_id = ?", res.ID).Find(&yearVals).Error; err1 != nil {
			return nil, err1
		}
		for _, yf := range yearVals {
			if err := ecb.BackupYearFomular(ctx, yf, *resID); err != nil {
				return nil, err
			}
		}
	}

	msg := SuccessMessage{Message: "Backup Created Successfully"}

	return &msg, nil
}

func (ecb *EesCalcBackup) BackupOssEesResult(ctx context.Context, eesRes models.OssEesResultTbl2) (*uuid.UUID, error) {
	ossRes := models.OssEesResultBackup{
		BackupTime:  ecb.bkTime,
		BackupTitle: ecb.bkTitle,

		ResultTitle:       eesRes.ResultTitle,
		OssAdminID:        eesRes.OssAdminID,
		Lang:              eesRes.Lang,
		TableType:         eesRes.TableType,
		IsDefaultTemplate: eesRes.IsDefaultTemplate,
		Value: models.Value{
			CreatedAt: eesRes.CreatedAt,
			UpdatedAt: eesRes.UpdatedAt,
		},
	}
	doc, err := ecb.oert2b.st.Create(ctx, &ossRes)
	if err != nil {
		return nil, err
	}
	return &doc.ID, nil
}

func (ecb *EesCalcBackup) BackupYearFomular(ctx context.Context, yForm models.OssEesResultTbl2YearFormula, resID uuid.UUID) error {
	yFormBackup := models.OssEesResultYFBackup{
		BackupTime:  ecb.bkTime,
		BackupTitle: ecb.bkTitle,

		ResultID:  resID,
		FieldID:   yForm.FieldID,
		FieldName: yForm.FieldName,
		Lang:      yForm.Lang,
		Value: models.Value{
			CreatedAt: yForm.CreatedAt,
			UpdatedAt: yForm.UpdatedAt,
		},
	}
	return ecb.oert2b.st.DB().Save(&yFormBackup).Error
}

func (ecb *EesCalcBackup) BackupStep(ctx context.Context, step models.StepItem) (*uuid.UUID, error) {
	stepBackup := models.StepItemBackup{
		BackupTime:  ecb.bkTime,
		BackupTitle: ecb.bkTitle,
		Index:       step.Index,
		Name:        step.Name,
		Require:     step.Require,
		OssAdminID:  step.OssAdminID,
		Lang:        step.Lang,
	}

	doc, err := ecb.sbc.Create(ctx, stepBackup)
	if err != nil {
		return nil, err
	}
	return &doc.ID, nil
}

func (ecb *EesCalcBackup) BackupField(ctx context.Context, field models.StepField, stepID uuid.UUID) error {
	fieldBackup := models.StepFieldBackup{
		BackupTime:  ecb.bkTime,
		BackupTitle: ecb.bkTitle,
		StepID:      stepID,
		Index:       field.Index,
		Name:        field.Name,
		Require:     field.Require,
		Placeholder: field.Placeholder,
		TextNumber:  field.TextNumber,
		Lang:        field.Lang,
	}
	_, err := ecb.sfbc.Create(ctx, fieldBackup)
	return err
}

func (ecb *EesCalcBackup) BackupStepsResult(ctx context.Context, result models.StepsResult) (*uuid.UUID, error) {
	resultBackup := models.StepsResultBackup{
		BackupTime:  ecb.bkTime,
		BackupTitle: ecb.bkTitle,
		ResultTitle: result.ResultTitle,
		UnitVatXcl:  result.UnitVatXcl,
		UnitVatInc:  result.UnitVatInc,
		Vat:         result.Vat,
		OssAdminID:  result.OssAdminID,
		Lang:        result.Lang,
		TableType:   result.TableType,
	}
	doc, err := ecb.srbc.st.Create(ctx, &resultBackup)
	if err != nil {
		return nil, err
	}
	return &doc.ID, nil
}

func (ecb *EesCalcBackup) SetResultSubObjBackup(ctx context.Context, sub models.ResultSubObject, resID uuid.UUID) error {
	if err := ecb.BackupResultSubObj(ctx, sub, resID); err != nil {
		return err
	}
	return nil
}

func (ecb *EesCalcBackup) ResultSubObjBackup(ctx context.Context, results []models.ResultSubObject, resID uuid.UUID) error {
	if len(results) > 0 {
		for _, sub := range results {
			if err := ecb.BackupResultSubObj(ctx, sub, resID); err != nil {
				return err
			}
		}
	}
	return nil
}

func (ecb *EesCalcBackup) BackupResultSubObj(ctx context.Context, subObj models.ResultSubObject, resID uuid.UUID) error {
	subObjBackup := models.ResultSubObjectBackup{
		BackupTime:  ecb.bkTime,
		BackupTitle: ecb.bkTitle,
		ResultID:    resID,
		CostType:    subObj.CostType,
		FieldID:     subObj.FieldID,
		FieldName:   subObj.FieldName,
		Index:       subObj.Index,
		Lang:        subObj.Lang,
	}
	if err := ecb.rsobc.Create(ctx, subObjBackup); err != nil {
		return err
	}
	if err := ecb.rsobc.st.DB().First(&subObjBackup).Error; err != nil {
		return err
	}
	fmt.Printf("Nested obj resID: %v\n", subObjBackup.ResultID)
	return nil
}

func (ecb *EesCalcBackup) Restore(ctx context.Context, r *http.Request) (*SuccessMessage, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		getReq           EssBackupRequest
		rc               io.ReadCloser = r.Body
		stepBackUps      []models.StepItemBackup
		stepFieldBackUps []models.StepFieldBackup

		table2backups []models.OssEesResultBackup
	)
	if err := json.NewDecoder(rc).Decode(&getReq); err != nil {
		return nil, err
	}
	if !Can(ctx, RestoreEesCalcBackup, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	steps, err5 := ecb.sc.ListByOss(ctx, getReq.OssAdminID, getReq.Lang)
	if err5 != nil {
		return nil, err5
	}
	for _, step := range steps {
		stepFields, err := ecb.sfc.ListByOss(ctx, step.ID)
		if err != nil {
			return nil, err
		}
		if err := ecb.DeleteExistingStep(ctx, step.ID); err != nil {
			return nil, err
		}
		for _, field := range stepFields {
			if err := ecb.DeleteExistingField(ctx, field.ID); err != nil {
				return nil, err
			}
		}
	}
	results, err6 := ecb.src.ListByOssAdmin(ctx, getReq.OssAdminID)
	if err6 != nil {
		return nil, err6
	}
	for _, res := range results {
		if err := ecb.DeleteExistingStepResult(ctx, res.ID); err != nil {
			return nil, err
		}
		vatXs, err1 := ecb.src.ResultSubList(ecb.c_v_x, res.ID)
		if err1 != nil {
			return nil, err1
		}
		if err := ecb.DeleteExistingSubObjs(ctx, vatXs); err != nil {
			return nil, err
		}
		vatIs, err2 := ecb.src.ResultSubList(ecb.c_v_i, res.ID)
		if err2 != nil {
			return nil, err2
		}
		if err := ecb.DeleteExistingSubObjs(ctx, vatIs); err != nil {
			return nil, err
		}
		totalXs, err3 := ecb.src.ResultSubList(ecb.t_v_x, res.ID)
		if err3 != nil {
			return nil, err3
		}
		if err := ecb.DeleteExistingSubObjs(ctx, totalXs); err != nil {
			return nil, err
		}
		totalIs, err4 := ecb.src.ResultSubList(ecb.t_v_i, res.ID)
		if err4 != nil {
			return nil, err4
		}
		if err := ecb.DeleteExistingSubObjs(ctx, totalIs); err != nil {
			return nil, err
		}
	}

	if err := ecb.sbc.st.DB().Where("backup_time = ?", getReq.BackupTime).Where("oss_admin_id = ?", getReq.OssAdminID).Find(&stepBackUps).Error; err != nil {
		return nil, err
	}

	fmt.Printf("%d step backups found\n", len(stepBackUps))

	for _, stepBp := range stepBackUps {
		stepID, err := ecb.RestoreStep(&stepBp)
		if err != nil {
			return nil, err
		}
		if err := ecb.sfbc.st.DB().Where("step_id = ?", stepBp.ID).Find(&stepFieldBackUps).Error; err != nil {
			return nil, err
		}
		fmt.Printf("%d step field backups found\n", len(stepFieldBackUps))

		for _, field := range stepFieldBackUps {
			if _, err := ecb.RestoreField(&field, *stepID); err != nil {
				return nil, err
			}
		}
	}

	// stepFieldBackups, err2 := ecb.sfbc.ListByOss(ctx, getReq)
	// if err2 != nil {
	// 	return nil, err2
	// }

	stepResultBackups, err3 := ecb.srbc.ListByOss(ctx, getReq)
	if err3 != nil {
		return nil, err3
	}

	fmt.Printf("%d step results found\n", len(stepResultBackups))

	for _, stepRes := range stepResultBackups {
		var subObjs []models.ResultSubObjectBackup
		resID, err := ecb.RestoreStepResult(&stepRes)
		if err != nil {
			return nil, err
		}
		if err := ecb.rsobc.st.DB().Where("result_id = ?", stepRes.ID).Find(&subObjs).Error; err != nil {
			return nil, err
		}
		fmt.Printf("%d sub objects found\n", len(subObjs))
		for _, subObj := range subObjs {
			if _, err := ecb.RestoreSubObj(&subObj, *resID); err != nil {
				return nil, err
			}
		}
	}

	ossTable2s, err7 := ecb.oert2.ListByOssAdmin(ctx, getReq.OssAdminID)
	if err7 != nil {
		return nil, err7
	}

	fmt.Printf("%d oss-ees-tbl2 found\n", len(ossTable2s))
	for _, tbl := range ossTable2s {
		var yForms models.OssEesResultTbl2YearFormula

		if err := ecb.DeleteExistingTbl2(ctx, tbl.ID); err != nil {
			return nil, err
		}
		if err := ecb.oert2.st.DB().Where("result_id = ?", tbl.ID).Find(&yForms).Error; err != nil && err.Error() != "record not found" {
			return nil, err
		}
	}

	if err := ecb.oert2b.st.DB().Where("backup_time = ?", getReq.BackupTime).Where("oss_admin_id = ?", getReq.OssAdminID).Find(&table2backups).Error; err != nil {
		return nil, err
	}

	for _, tbl := range table2backups {
		var yForms []models.OssEesResultYFBackup

		tblID, err := ecb.RestoreOssEesResult(&tbl)
		if err != nil {
			return nil, err
		}

		if err := ecb.oert2b.st.DB().Where("result_id = ?", tbl.ID).Find(&yForms).Error; err != nil {
			return nil, err
		}
		for _, yf := range yForms {
			if err := ecb.RestoreYearFomular(&yf, *tblID); err != nil {
				return nil, err
			}
		}
	}

	success := SuccessMessage{Message: "Restore Completed Successfully"}
	return &success, nil
}

func (ecb *EesCalcBackup) RestoreStep(stepBackup *models.StepItemBackup) (*uuid.UUID, error) {
	step := models.StepItem{
		Index:      stepBackup.Index,
		Name:       stepBackup.Name,
		Require:    stepBackup.Require,
		OssAdminID: stepBackup.OssAdminID,
		Lang:       stepBackup.Lang,
		Value: models.Value{
			CreatedAt: stepBackup.CreatedAt,
			UpdatedAt: stepBackup.UpdatedAt,
		},
	}
	err := ecb.sc.st.DB().Save(&step).Error
	if err != nil {
		return nil, err
	}
	return &step.ID, nil
}

func (ecb *EesCalcBackup) RestoreField(fieldBackup *models.StepFieldBackup, stepID uuid.UUID) (*uuid.UUID, error) {
	field := models.StepField{
		StepID:      stepID,
		Index:       fieldBackup.Index,
		Name:        fieldBackup.Name,
		Require:     fieldBackup.Require,
		Placeholder: fieldBackup.Placeholder,
		TextNumber:  fieldBackup.TextNumber,
		Lang:        fieldBackup.Lang,
		Value: models.Value{
			CreatedAt: fieldBackup.CreatedAt,
			UpdatedAt: fieldBackup.UpdatedAt,
		},
	}
	err := ecb.sfc.st.DB().Save(&field).Error
	if err != nil {
		return nil, err
	}
	return &field.ID, nil
}

func (ecb *EesCalcBackup) RestoreStepResult(resBackup *models.StepsResultBackup) (*uuid.UUID, error) {
	result := models.StepsResult{
		ResultTitle: resBackup.ResultTitle,
		CostVatXcl:  resBackup.CostVatInc,
		UnitVatXcl:  resBackup.UnitVatXcl,
		CostVatInc:  resBackup.CostVatInc,
		UnitVatInc:  resBackup.UnitVatInc,
		Vat:         resBackup.Vat,
		TotalVatInc: resBackup.TotalVatInc,
		TotalVatXcl: resBackup.TotalVatXcl,
		OssAdminID:  resBackup.OssAdminID,
		Lang:        resBackup.Lang,
		TableType:   resBackup.TableType,
		Value: models.Value{
			CreatedAt: resBackup.CreatedAt,
			UpdatedAt: resBackup.UpdatedAt,
		},
	}
	err := ecb.src.st.DB().Save(&result).Error
	if err != nil {
		return nil, err
	}
	return &result.ID, nil
}

func (ecb *EesCalcBackup) RestoreSubObj(subBackup *models.ResultSubObjectBackup, resID uuid.UUID) (*uuid.UUID, error) {
	subObj := models.ResultSubObject{
		ResultID:  resID,
		CostType:  subBackup.CostType,
		FieldID:   subBackup.FieldID,
		FieldName: subBackup.FieldName,
		Index:     subBackup.Index,
		Lang:      subBackup.Lang,
	}
	err := ecb.src.st.DB().Save(&subObj).Error
	if err != nil {
		return nil, err
	}
	return &subObj.ID, nil
}

func (ecb *EesCalcBackup) RestoreOssEesResult(resBackup *models.OssEesResultBackup) (*uuid.UUID, error) {
	result := models.OssEesResultTbl2{
		ResultTitle:       resBackup.ResultTitle,
		OssAdminID:        resBackup.OssAdminID,
		Lang:              resBackup.Lang,
		TableType:         resBackup.TableType,
		IsDefaultTemplate: resBackup.IsDefaultTemplate,
	}
	err := ecb.oert2b.st.DB().Save(&result).Error
	if err != nil {
		return nil, err
	}
	return &result.ID, nil
}

func (ecb *EesCalcBackup) RestoreYearFomular(yfBackup *models.OssEesResultYFBackup, resID uuid.UUID) error {
	yForm := models.OssEesResultTbl2YearFormula{
		ResultID:  resID,
		FieldID:   yfBackup.FieldID,
		FieldName: yfBackup.FieldName,
		Lang:      yfBackup.Lang,
	}
	return ecb.oert2b.st.DB().Save(&yForm).Error
}

func (ecb *EesCalcBackup) DeleteExistingTbl2(ctx context.Context, tblID uuid.UUID) error {
	if _, _, err := ecb.oert2b.Get(ctx, tblID); err != nil {
		return err
	}
	return ecb.oert2b.DeleteOssEesResult(ctx, tblID)
}

func (ecb *EesCalcBackup) DeleteExistingYearFom(ctx context.Context, yfID uuid.UUID) error {
	return ecb.oert2b.DeleteYearFormula(ctx, yfID)
}

func (ecb *EesCalcBackup) DeleteExistingStep(ctx context.Context, stepID uuid.UUID) error {
	_, _, err := ecb.sc.Get(ctx, stepID)
	if err != nil {
		return err
	}
	return ecb.sc.DeleteStep(ctx, stepID)
}

func (ecb *EesCalcBackup) DeleteExistingField(ctx context.Context, fieldID uuid.UUID) error {
	_, _, err := ecb.sfc.Get(ctx, fieldID)
	if err != nil {
		return err
	}
	return ecb.sc.DeleteField(ctx, fieldID)
}

func (ecb *EesCalcBackup) DeleteExistingStepResult(ctx context.Context, resID uuid.UUID) error {
	_, _, err := ecb.src.Get(ctx, resID)
	if err != nil {
		return err
	}
	return ecb.src.DeleteStepsResult(ctx, resID)
}

func (ecb *EesCalcBackup) DeleteExistingSubObjs(ctx context.Context, subObjs []models.ResultSubObject) error {
	for _, sub := range subObjs {
		_, err := ecb.src.GetSubItem(ctx, sub.ID)
		if err != nil {
			return err
		}
		if err := ecb.src.DeleteField(ctx, sub.ID); err != nil {
			return err
		}
	}
	return nil
}

func (ecb *EesCalcBackup) Get(ctx context.Context, ecbID uuid.UUID) (*models.Document, error) {
	// cv := services.FromContext(ctx)
	// if !cv.Authorized() {
	// 	return nil, nil, ErrUnauthorized
	// }
	doc, err := ecb.sc.st.Get(ctx, ecbID)
	if err != nil {
		return nil, ErrNotFound
	}

	return doc, nil
}

func (ecb *EesCalcBackup) List(ctx context.Context, r *http.Request) ([]EesBackupListing, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		backupDates []string
		allBackups  []models.StepItemBackup
		backups     []EesBackupListing
		query       url.Values = r.URL.Query()
	)
	OssAdminID := query.Get("oss_admin_id")
	Language := query.Get("lang")
	if !Can(ctx, ListEesCalcBackup, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	if err := ecb.sc.st.DB().Where("oss_admin_id = ?", OssAdminID).Where("lang = ?", Language).Find(&allBackups).Error; err != nil {
		return nil, err
	}

	for _, backup := range allBackups {
		backupDates = append(backupDates, backup.BackupTime)
	}

	dates := ecb.RemoveDuplicateTimes(backupDates)

	for _, day := range dates {
		var (
			backup                 models.StepItemBackup
			stepBackups            []models.StepItemBackup
			stepFieldBackups       []models.StepFieldBackup
			stepResultBackups      []models.StepsResultBackup
			table2backup           []models.OssEesResultBackup
			resultSubObjectBackups []models.ResultSubObjectBackup

			stepNo    int
			fieldNo   int
			stepResNo int
			table2No  int
			subObjNo  int
		)

		ecb.sc.st.DB().Model(&stepBackups).Where("backup_time = ?", day).Where("oss_admin_id = ?", OssAdminID).Count(&stepNo)
		ecb.sc.st.DB().Model(&stepFieldBackups).Where("backup_time = ?", day).Count(&fieldNo)
		ecb.sc.st.DB().Model(&stepResultBackups).Where("backup_time = ?", day).Where("oss_admin_id = ?", OssAdminID).Count(&stepResNo)
		ecb.sc.st.DB().Model(&table2backup).Where("backup_time = ?", day).Where("oss_admin_id = ?", OssAdminID).Count(&table2No)
		ecb.sc.st.DB().Model(&resultSubObjectBackups).Where("backup_time = ?", day).Count(&subObjNo)

		if err := ecb.sc.st.DB().Where("backup_time = ?", day).First(&backup).Error; err != nil {
			return nil, err
		}

		_backup := EesBackupListing{
			BackupTitle:      backup.BackupTitle,
			BackupTime:       backup.BackupTime,
			OssAdminID:       backup.OssAdminID,
			Steps:            stepNo,
			StepFields:       fieldNo,
			StepResults:      stepResNo,
			Table2Results:    table2No,
			ResultSubObjects: subObjNo,
		}

		backups = append(backups, _backup)

	}
	Log(ctx, ecb.ss, r, []string{"step_item_backup"}, "N/A", "nil", "GET")
	return backups, nil
}

func (ecb *EesCalcBackup) RemoveDuplicateTimes(timeSlice []string) []string {
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

func (ecb *EesCalcBackup) NextIndex(ctx context.Context, r *http.Request) (*int, error) {
	backups, err := ecb.List(ctx, r)
	if err != nil {
		return nil, err
	}
	result := len(backups) + 1
	return &result, nil
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func (sb *StepBackup) Create(ctx context.Context, stepBackup models.StepItemBackup) (*models.Document, error) {

	doc, err := sb.st.Create(ctx, sanitizeEntityFields(&stepBackup))
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func (sb *StepBackup) Get(ctx context.Context, sbID uuid.UUID) (*models.StepItemBackup, error) {
	// cv := services.FromContext(ctx)
	// if !cv.Authorized() {
	// 	return nil, nil, ErrUnauthorized
	// }
	doc, err := sb.st.Get(ctx, sbID)
	if err != nil {
		return nil, ErrNotFound
	}

	return doc.Data.(*models.StepItemBackup), nil
}

func (sb *StepBackup) ListByOss(ctx context.Context, getReq EssBackupRequest) ([]models.StepItemBackup, error) {
	var stepItems []models.StepItemBackup
	if err := sb.st.DB().Where("oss_admin_id = ?", getReq.OssAdminID).Where("backup_time = ?", getReq.BackupTime).First(&stepItems).Error; err != nil {
		return nil, err
	}
	return stepItems, nil
}

func (sb *StepBackup) List(ctx context.Context, filter stores.Filter, rc io.ReadCloser) ([]models.Document, stores.Dependencies, int, error) {
	// cv := services.FromContext(ctx)

	// if !cv.Authorized() || !Can(ctx, ListCalcMenus, uuid.Nil, cv.User.Country) {
	// 	return nil, nil, 0, ErrUnauthorized
	// }

	return sb.st.List(ctx, filter)
}

func (sb *StepBackup) NextIndex(ctx context.Context, filter stores.Filter, rc io.ReadCloser) (*int, error) {
	docs, _, _, err := sb.List(ctx, filter, rc)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func (sfb *StepFieldBackup) Create(ctx context.Context, stepFieldBackup models.StepFieldBackup) (*models.Document, error) {

	doc, err := sfb.st.Create(ctx, sanitizeEntityFields(&stepFieldBackup))
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func (sfb *StepFieldBackup) Get(ctx context.Context, sfbID uuid.UUID) (*models.Document, error) {
	// cv := services.FromContext(ctx)
	// if !cv.Authorized() {
	// 	return nil, nil, ErrUnauthorized
	// }
	doc, err := sfb.st.Get(ctx, sfbID)
	if err != nil {
		return nil, ErrNotFound
	}

	return doc, nil
}

func (sfb *StepFieldBackup) ListByOss(ctx context.Context, getReq EssBackupRequest) ([]models.StepFieldBackup, error) {
	var stepFieldBackups []models.StepFieldBackup
	if err := sfb.st.DB().Where("backup_time = ?", getReq.BackupTime).Where("lang = ?", getReq.Lang).Find(&stepFieldBackups).Error; err != nil {
		return nil, err
	}
	return stepFieldBackups, nil
}

func (sfb *StepFieldBackup) List(ctx context.Context, filter stores.Filter, rc io.ReadCloser) ([]models.Document, stores.Dependencies, int, error) {
	// cv := services.FromContext(ctx)

	// if !cv.Authorized() || !Can(ctx, ListCalcMenus, uuid.Nil, cv.User.Country) {
	// 	return nil, nil, 0, ErrUnauthorized
	// }

	return sfb.st.List(ctx, filter)
}

func (sfb *StepFieldBackup) NextIndex(ctx context.Context, filter stores.Filter, rc io.ReadCloser) (*int, error) {
	docs, _, _, err := sfb.List(ctx, filter, rc)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func (srb *StepsResultBackup) Create(ctx context.Context, stepResultBackup models.StepsResultBackup) error {
	_, err := srb.st.Create(ctx, sanitizeEntityFields(&stepResultBackup))
	if err != nil {
		return err
	}

	return nil
}

func (srb *StepsResultBackup) Get(ctx context.Context, srbID uuid.UUID) (*models.Document, error) {

	// cv := services.FromContext(ctx)
	// if !cv.Authorized() {
	// 	return nil, nil, ErrUnauthorized
	// }
	doc, err := srb.st.Get(ctx, srbID)
	if err != nil {
		return nil, ErrNotFound
	}
	return doc, nil
}

func (srb *StepsResultBackup) ListByOss(ctx context.Context, getReq EssBackupRequest) ([]models.StepsResultBackup, error) {
	var stepResBackups []models.StepsResultBackup
	if err := srb.st.DB().Where("backup_time = ?", getReq.BackupTime).Where("oss_admin_id = ?", getReq.OssAdminID).Where("lang = ?", getReq.Lang).Find(&stepResBackups).Error; err != nil {
		return nil, err
	}
	return stepResBackups, nil
}

func (srb *StepsResultBackup) List(ctx context.Context, filter stores.Filter, rc io.ReadCloser) ([]models.Document, stores.Dependencies, int, error) {
	// cv := services.FromContext(ctx)

	// if !cv.Authorized() || !Can(ctx, ListCalcMenus, uuid.Nil, cv.User.Country) {
	// 	return nil, nil, 0, ErrUnauthorized
	// }

	return srb.st.List(ctx, filter)
}

func (srb *StepsResultBackup) NextIndex(ctx context.Context, filter stores.Filter, rc io.ReadCloser) (*int, error) {
	docs, _, _, err := srb.List(ctx, filter, rc)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func (oet2b *OssEesTbl2Backup) Create(ctx context.Context, ossResultBackup models.OssEesResultBackup) error {
	_, err := oet2b.st.Create(ctx, sanitizeEntityFields(&ossResultBackup))
	if err != nil {
		return err
	}

	return nil
}

func (oet2b *OssEesTbl2Backup) Get(ctx context.Context, urbID uuid.UUID) (*models.Document, error) {
	// cv := services.FromContext(ctx)
	// if !cv.Authorized() {
	// 	return nil, nil, ErrUnauthorized
	// }
	doc, err := oet2b.st.Get(ctx, urbID)
	if err != nil {
		return nil, ErrNotFound
	}

	return doc, nil
}

func (oet2b *OssEesTbl2Backup) ListByOss(ctx context.Context, getReq EssBackupRequest) ([]models.OssEesResultBackup, error) {
	var ossTbl2Backups []models.OssEesResultBackup
	if err := oet2b.st.DB().Where("backup_time = ?", getReq.BackupTime).Where("oss_admin_id = ?", getReq.OssAdminID).Where("lang = ?", getReq.Lang).Find(&ossTbl2Backups).Error; err != nil {
		return nil, err
	}
	return ossTbl2Backups, nil
}

func (oet2b *OssEesTbl2Backup) List(ctx context.Context, filter stores.Filter, rc io.ReadCloser) ([]models.Document, stores.Dependencies, int, error) {
	// cv := services.FromContext(ctx)

	// if !cv.Authorized() || !Can(ctx, ListCalcMenus, uuid.Nil, cv.User.Country) {
	// 	return nil, nil, 0, ErrUnauthorized
	// }

	return oet2b.st.List(ctx, filter)
}

func (oet2b *OssEesTbl2Backup) NextIndex(ctx context.Context, filter stores.Filter, rc io.ReadCloser) (*int, error) {
	docs, _, _, err := oet2b.List(ctx, filter, rc)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func (rsob *ResultSubObjectBackup) Create(ctx context.Context, subObjBackup models.ResultSubObjectBackup) error {
	// doc, err := rsob.st.Create(ctx, sanitizeEntityFields(&subObjBackup))
	if err := rsob.st.DB().Save(&subObjBackup).Error; err != nil {
		return err
	}
	return nil
}

func (rsob *ResultSubObjectBackup) Get(ctx context.Context, rsobID uuid.UUID) (*models.Document, error) {
	// cv := services.FromContext(ctx)
	// if !cv.Authorized() {
	// 	return nil, nil, ErrUnauthorized
	// }
	doc, err := rsob.st.Get(ctx, rsobID)
	if err != nil {
		return nil, ErrNotFound
	}

	return doc, nil
}

func (rsob *ResultSubObjectBackup) ListByOss(ctx context.Context, getReq EssBackupRequest) ([]models.ResultSubObjectBackup, error) {
	var resSubBackups []models.ResultSubObjectBackup

	if err := rsob.st.DB().Where("backup_time = ?", getReq.BackupTime).Where("lang = ?", getReq.Lang).Find(&resSubBackups).Error; err != nil {
		return nil, err
	}

	return resSubBackups, nil
}

func (rsob *ResultSubObjectBackup) List(ctx context.Context, filter stores.Filter, rc io.ReadCloser) ([]models.Document, stores.Dependencies, int, error) {
	// cv := services.FromContext(ctx)

	// if !cv.Authorized() || !Can(ctx, ListCalcMenus, uuid.Nil, cv.User.Country) {
	// 	return nil, nil, 0, ErrUnauthorized
	// }

	return rsob.st.List(ctx, filter)
}

func (rsob *ResultSubObjectBackup) NextIndex(ctx context.Context, filter stores.Filter, rc io.ReadCloser) (*int, error) {
	docs, _, _, err := rsob.List(ctx, filter, rc)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}
