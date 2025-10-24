package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/url"
	"strconv"
	"strings"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/google/uuid"
)

const (
	resident    = "Resident"
	association = "Housing Association"
	operator    = "Service Operator"
	usrErr      = "duplicate entry: email"
	// orgErr      = `pq: duplicate key value violates unique constraint "organizations_vat_key"`
)

type OnboardingUserData struct {
	st      stores.Store
	uc      *User
	us      stores.Store
	oc      *Organization
	sm      services.Mailer
	usr     *models.User
	country models.Country
}

func NewOnboardingUserData(env *services.Env) *OnboardingUserData {
	return &OnboardingUserData{
		st:      env.OnboardingUserDataStore,
		us:      env.UserStore,
		uc:      NewUser(env),
		oc:      NewOrganization(env),
		sm:      env.Mailer,
		country: "Latvia",
	}
}

func (oud *OnboardingUserData) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	var onboardingUserData models.OnboardingUserData

	if err := json.NewDecoder(rc).Decode(&onboardingUserData); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if _, err := oud.st.GetByIndex(ctx, onboardingUserData.Session); err == nil {
		return nil, fmt.Errorf("%w: session", ErrDuplicate)
	}
	doc, err := oud.st.Create(ctx, sanitizeEntityFields(&onboardingUserData))
	if err != nil {
		return nil, err
	}
	// Register user if menu_type == Resident || Housing Association
	if onboardingUserData.MenuType == resident || onboardingUserData.MenuType == association {
		if err := oud.SaveUser(ctx, &onboardingUserData); err != nil {
			return nil, err
		}
	}
	// Register user and create new organization if menu_type == Service Operator
	if onboardingUserData.MenuType == operator {
		if err := oud.SaveUser(ctx, &onboardingUserData); err != nil {
			return nil, err
		}
		if err := oud.SaveOrganization(ctx, &onboardingUserData); err != nil {
			return nil, err
		}
	}
	return doc, nil
}

func (oud *OnboardingUserData) SaveUser(ctx context.Context, userData *models.OnboardingUserData) error {
	var (
		valid   models.ValidationStatus = models.ValidationStatusPending
		country models.Country          = models.Country(userData.Country)
	)

	user := models.User{
		Name:            userData.Name,
		Email:           userData.Email,
		Password:        userData.Password,
		Address:         userData.Address,
		Avatar:          userData.Website,
		Identity:        userData.Email,
		Telephone:       userData.PhoneNumber,
		SuperUser:       false,
		PlatformManager: false,
		AdminNwManager:  false,
		Country:         country,
		IsActive:        false,
		IsOssAdmin:      false,
		Valid:           valid,
	}
	fmt.Printf("Country: %v\n", user.Country)
	if err := oud.RegisterUser(ctx, &user); err != nil {
		if err.Error() == usrErr {
			if len(userData.Password) > 4 {
				if err := oud.UpdatePassword(ctx, userData.Email, userData.Password); err != nil {
					return err
				}
				println("user password updated ...")
			}
			return nil
		}
		return err
	}
	return nil
}

func (oud *OnboardingUserData) SaveOrganization(ctx context.Context, userData *models.OnboardingUserData) error {
	var (
		country models.Country          = models.Country(userData.Country)
		valid   models.ValidationStatus = models.ValidationStatusRegistered
	)

	doc, _, err := oud.uc.GetByEmail(ctx, userData.Email)
	if err != nil {
		return err
	}

	legalFormInt, err1 := strconv.Atoi(userData.OrgType)
	if err1 != nil {
		return fmt.Errorf("Bad legal form. ERROR: %s\n", err1.Error())
	}

	legalForm := oud.oc.GetLegalForm(int8(legalFormInt))

	fmt.Printf("org legal type int in save.org %v\n", legalFormInt)
	org := models.Organization{
		Name:               userData.OrgName,
		VAT:                userData.VatNumber,
		RegistrationNumber: userData.RegNumber,
		Address:            userData.Address,
		Telephone:          userData.PhoneNumber,
		Website:            userData.Website,
		Logo:               "",
		LegalForm:          legalForm,
		Registered:         userData.RegDate,
		Valid:              valid,
		Roles:              models.OrgRoles{LEAR: doc.ID},
		Email:              userData.Email,
		Country:            country,
	}
	if err := oud.RegisterOrganization(ctx, &org); err != nil {
		println("Error registering org:", err.Error())
		// if err.Error() == orgErr {
		// 	println("Captured error registering org:", err.Error())
		// 	return err
		// }
		return err
	}
	fmt.Printf("Org.Country: %v\n", org.Country)
	fmt.Printf("Org.LegalForm: %v\n", org.LegalForm)
	return nil
}

func (oud *OnboardingUserData) UpdatePassword(ctx context.Context, email, password string) error {
	doc, _, err := oud.uc.GetByEmail(ctx, email)
	if err != nil {
		return err
	}
	doc.Data.(*models.User).SetPassword(password)

	_, err = oud.us.Update(ctx, sanitizeInputFields(doc))
	return err

}

func (oud *OnboardingUserData) CheckUser(ctx context.Context, query url.Values) (*models.User, stores.Dependencies, error) {
	email := query.Get("email")
	doc, deps, err := oud.uc.GetByEmail(ctx, email)
	if err != nil {
		return nil, nil, nil
	}
	return doc.Data.(*models.User), deps, nil
}

func (oud *OnboardingUserData) RegisterUser(ctx context.Context, user *models.User) error {
	b, err := json.Marshal(*user)
	if err != nil {
		return err
	}
	r := io.NopCloser(strings.NewReader(string(b)))
	_, err1 := oud.uc.Create(ctx, r)
	if err1 != nil {
		return err1
	}
	return nil
}

func (oud *OnboardingUserData) RegisterOrganization(ctx context.Context, org *models.Organization) error {
	b, err := json.Marshal(*org)
	if err != nil {
		return err
	}
	r := io.NopCloser(strings.NewReader(string(b)))
	_, err1 := oud.oc.Create(ctx, r)
	if err1 != nil {
		return err1
	}
	return nil
}

func (oud *OnboardingUserData) Get(ctx context.Context, urbID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}

	_, err := oud.st.Get(ctx, urbID)
	if err != nil {
		return nil, nil, ErrNotFound
	}

	return oud.st.Unwrap(ctx, urbID)
}

func (oud *OnboardingUserData) GetByUserID(ctx context.Context, userID uuid.UUID) (usrData *models.OnboardingUserData, err error) {
	if err = oud.st.DB().Where("user_id = ?", userID).First(&usrData).Error; err != nil {
		return
	}
	return
}

func (oud *OnboardingUserData) Update(ctx context.Context, uidID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	doc, err := oud.st.Get(ctx, uidID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateOnboardingUserData, uidID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	new := *doc.Data.(*models.OnboardingUserData)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	doc.Data = &new

	_, err = oud.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}

	result, deps, err := oud.st.Unwrap(ctx, uidID)

	return result, deps, err
}

func (oud *OnboardingUserData) List(ctx context.Context, filter stores.Filter, query url.Values) ([]models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, 0, ErrUnauthorized
	}
	var (
		renovatDatas []models.Document
		renovateDeps stores.Dependencies
	)
	OssAdminID := query.Get("oss_admin_id")
	FilterType := query.Get("filter_type")

	filter.OssAdminID = OssAdminID
	filter.MenuType = FilterType

	if !Can(ctx, ListOnboardingUserData, uuid.Nil, cv.User.Country) {
		return nil, nil, 0, ErrUnauthorized
	}
	if strings.ToLower(filter.MenuType) == "all" {
		var (
			docs  []models.Document
			deps  stores.Dependencies
			datas []models.OnboardingUserData
		)
		err := oud.st.DB().Where("oss_admin_id = ?", OssAdminID).Find(&datas).Error
		// docs, deps, n, err := oud.st.ListByOssAdminID(ctx, filter)
		for _, data := range datas {
			docs = append(docs, *models.Wrap(data))
		}
		return docs, deps, len(docs), err
	} else if strings.ToLower(filter.MenuType) == "renovation cost calculator" {
		// return data from user-basic-details filtered by oss-admin-id from the request.payload
		var basicDetails []models.UserBasicDetails
		if err := oud.st.DB().Where("oss_admin_id = ?", OssAdminID).Find(&basicDetails).Error; err != nil {
			return nil, nil, 0, err
		}
		for _, baseDet := range basicDetails {
			var _user models.User
			// check if the userID==0 send empty string in user
			_, err := uuid.Parse(baseDet.UserID)
			if err != nil {
				oud.usr = &models.User{}
			} else {
				if err1 := oud.st.DB().Where("id = ?", baseDet.UserID).First(&_user).Error; err != nil {
					return nil, nil, 0, err1
				}
				oud.usr = &_user
			}
			userData := models.OnboardingUserData{
				Value:       models.Value{ID: baseDet.ID, CreatedAt: baseDet.CreatedAt},
				Session:     baseDet.Session,
				Lang:        baseDet.Lang,
				IP:          baseDet.UserPublicIP,
				OssAdminID:  baseDet.OssAdminID,
				UserID:      baseDet.UserID,
				Country:     baseDet.Country,
				Name:        oud.usr.Name,
				Surname:     oud.usr.Name,
				Email:       oud.usr.Email,
				PhoneNumber: oud.usr.Telephone,
				Address:     oud.usr.Address,
				Password:    oud.usr.Password,
				MenuType:    "Renovation Cost Calculator",
			}
			renovatDatas = append(renovatDatas, *models.Wrap(userData))
		}
		return renovatDatas, renovateDeps, len(renovatDatas), nil
	}
	docs, deps, n, err := oud.st.ListByOssAdminMenuType(ctx, filter)
	return docs, deps, n, err
}

func (oud *OnboardingUserData) ListInputs(ctx context.Context, filter stores.Filter, uid uuid.UUID) (models.Document, error) {
	var (
		_doc        models.Document
		userInputs  []models.UserInputData
		userDetails models.OnboardingUserData
	)
	if err := oud.st.DB().Where("id = ?", uid).First(&userDetails).Error; err != nil {
		return _doc, err
	}
	if err := oud.st.DB().Where("user_id = ?", uid).Find(&userInputs).Error; err != nil {
		return _doc, err
	}
	userDetails.DataInputs = userInputs

	return *models.Wrap(userDetails), nil
}

func (oud *OnboardingUserData) NextIndex(ctx context.Context, filter stores.Filter, query url.Values) (*int, error) {
	docs, _, _, err := oud.List(ctx, filter, query)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (oud *OnboardingUserData) DeleteOnboardingUserData(ctx context.Context, uidID uuid.UUID) error {
	doc, err := oud.st.Get(ctx, uidID)
	if err != nil {
		return err
	}

	return oud.st.Delete(ctx, doc)
}
