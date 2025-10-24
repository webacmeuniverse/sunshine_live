package controller

import (
	"context"
	"fmt"
	"time"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

type RenovateCalcInput struct {
	st       stores.Store
	docs     []models.Document
	deps     stores.Dependencies
	usrC     User
	orgC     Organization
	usr      models.User
	country  models.Country
	notFound string
}

func NewRenovateCalcInput(env *services.Env) *RenovateCalcInput {
	return &RenovateCalcInput{
		st:       env.RenovateCalcInputStore,
		country:  "Latvia",
		notFound: "record not found",
	}
}

func (rci *RenovateCalcInput) List(ctx context.Context, basicDetsID uuid.UUID) (*models.RenovateCalcInput, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, ListRenovateCalcInput, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	var (
		userBasicDets models.UserBasicDetails
		getResTbl1    []models.GetResultTbl1
		getResTbl2    []models.GetResultTbl2
	)
	if err := rci.st.DB().Where("id = ?", basicDetsID).First(&userBasicDets).Error; err != nil {
		return nil, err
	}
	if err := rci.st.DB().Where("user_id = ?", userBasicDets.UserID).Where("oss_admin = ?", userBasicDets.OssAdminID).Where("lang = ?", userBasicDets.Lang).Find(&getResTbl1).Error; err != nil && err.Error() != rci.notFound {
		return nil, err
	}
	if err := rci.st.DB().Where("session = ?", userBasicDets.Session).Where("oss_admin_id = ?", userBasicDets.OssAdminID).Where("lang = ?", userBasicDets.Lang).Find(&getResTbl2).Error; err != nil && err.Error() != rci.notFound {
		return nil, err
	}
	fmt.Printf("%s user base dets filtered by ID\n%d res tbl1 filtered by oss-admin-id\n%d res tbl2 filtered by oss-admin-id\n", userBasicDets.UserID, len(getResTbl1), len(getResTbl2))

	renovateInput, bErr := rci.AddBaseDets(ctx, userBasicDets)

	if bErr != nil {
		return nil, bErr
	}
	for i, res := range getResTbl2 {
		var yearVals []models.YearValue
		if err := rci.st.DB().Where("result_id = ?", res.ID).Where("lang = ?", userBasicDets.Lang).Find(&yearVals).Error; err != nil && err.Error() != rci.notFound {
			return nil, err
		}
		getResTbl2[i].YearValue = yearVals
	}
	renovateInput.GetResTbl1 = getResTbl1
	renovateInput.GetResTbl2 = getResTbl2

	if err := rci.st.DB().Where("id = ?", userBasicDets.UserID).First(&rci.usr).Error; err != nil {
		log.Printf("no user found bcuz:", err.Error())
	}
	return renovateInput, nil
}

func (rci *RenovateCalcInput) AddBaseDets(ctx context.Context, baseDet models.UserBasicDetails) (*models.RenovateCalcInput, error) {
	var (
		orgRole models.OrganizationRole
		usr     models.User
		org     models.Organization
	)

	if baseDet.UserID == "0" {
		onboardUserData := models.OnboardingUserData{
			Session:     baseDet.Session,
			Lang:        baseDet.Lang,
			IP:          baseDet.UserPublicIP,
			MenuType:    "",
			PostCode:    "",
			OssAdminID:  baseDet.OssAdminID,
			UserID:      baseDet.UserID,
			Name:        rci.usr.Name,
			Surname:     "",
			Email:       rci.usr.Email,
			Password:    rci.usr.Password,
			PhoneNumber: rci.usr.Telephone,
			City:        "",
			Country:     baseDet.Country,
			OrgType:     "",
			OrgName:     "",
			RegNumber:   "",
			VatNumber:   "",
			LegalRepOrg: "",
			Website:     "",
			Address:     rci.usr.Address,
			RegDate:     time.Now(),
		}
		_renovateInput, _err := rci.GenerateRenovateInput(baseDet, onboardUserData)
		if _err != nil {
			return nil, _err
		}
		return _renovateInput, nil

	}
	usrID, err := uuid.Parse(baseDet.UserID)
	if err != nil {
		return nil, fmt.Errorf("Bad userID: %v", err)
	}
	if err := rci.st.DB().Where("id = ?", usrID).First(&usr).Error; err != nil {
		return nil, err
	}
	if err2 := rci.st.DB().Where("user_id = ?", usrID).Last(&orgRole).Error; err2 != nil && err2.Error() != rci.notFound {
		return nil, err2
	}
	if err := rci.st.DB().Where("id = ?", orgRole.OrganizationID).First(&org).Error; err != nil && err.Error() != rci.notFound {
		return nil, err
	}
	if org.Valid == models.ValidationStatusRegistered || org.Valid == models.ValidationStatusValid {
		onboardUserData := models.OnboardingUserData{
			Session:     baseDet.Session,
			Lang:        baseDet.Lang,
			IP:          baseDet.UserPublicIP,
			MenuType:    "",
			PostCode:    "",
			OssAdminID:  baseDet.OssAdminID,
			UserID:      usr.ID.String(),
			Name:        usr.Name,
			Surname:     "",
			Email:       usr.Email,
			Password:    usr.Password,
			PhoneNumber: usr.Telephone,
			City:        "",
			Country:     string(usr.Country),
			OrgType:     org.LegalForm.String(),
			OrgName:     org.Name,
			RegNumber:   org.RegistrationNumber,
			VatNumber:   org.VAT,
			LegalRepOrg: org.ID.String(),
			Website:     org.Website,
			Address:     usr.Address,
			RegDate:     usr.CreatedAt,
		}
		_renovateInput, _err := rci.GenerateRenovateInput(baseDet, onboardUserData)
		if _err != nil {
			return nil, _err
		}
		return _renovateInput, nil
	}
	onboardUserData := models.OnboardingUserData{
		Session:     baseDet.Session,
		Lang:        baseDet.Lang,
		IP:          baseDet.UserPublicIP,
		MenuType:    "",
		PostCode:    "",
		OssAdminID:  baseDet.OssAdminID,
		UserID:      usr.ID.String(),
		Name:        usr.Name,
		Surname:     "",
		Email:       usr.Email,
		Password:    usr.Password,
		PhoneNumber: usr.Telephone,
		City:        "",
		Country:     string(usr.Country),
		OrgType:     "",
		OrgName:     "",
		RegNumber:   "",
		VatNumber:   "",
		LegalRepOrg: "",
		Website:     "",
		Address:     usr.Address,
		RegDate:     usr.CreatedAt,
	}
	_renovateInput, _err := rci.GenerateRenovateInput(baseDet, onboardUserData)
	if _err != nil {
		return nil, _err
	}
	return _renovateInput, nil
}

func (rci *RenovateCalcInput) GenerateRenovateInput(baseDet models.UserBasicDetails, usrData models.OnboardingUserData) (*models.RenovateCalcInput, error) {

	_renovateInput := models.RenovateCalcInput{
		Value:                models.Value{CreatedAt: baseDet.CreatedAt, UpdatedAt: baseDet.UpdatedAt},
		OnboardingUserData:   usrData,
		TableType:            baseDet.TableType,
		IsDefaultTemplate:    baseDet.IsDefaultTemplate,
		TotalYear:            baseDet.TotalYear,
		BeforeRenovationYear: int(baseDet.BeforeRenovationYear),
		AfterRenovationYear:  int(baseDet.AfterRenovationYear),
		// CalculationInput:     baseDet.CalculationInput,
	}

	renovateInput, err := rci.AddCalcSubMenu(_renovateInput, baseDet.Lang, baseDet.ID)

	if err != nil {
		return nil, err
	}

	return renovateInput, nil
}

func (rci *RenovateCalcInput) AddCalcSubMenu(_input models.RenovateCalcInput, lang string, baseID uuid.UUID) (*models.RenovateCalcInput, error) {
	var calcSubMenus []models.UserResultCalculation
	if err := rci.st.DB().Where("user_basic_details_id = ?", baseID).Where("lang = ?", lang).Find(&calcSubMenus).Error; err != nil && err.Error() != "record not found" {
		return nil, err
	}
	_input.CalculationInput = calcSubMenus
	return &_input, nil
}
