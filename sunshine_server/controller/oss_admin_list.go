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

type OssAdminsList struct {
	st       stores.Store
	oc       *Organization
	ac       *Asset
	uc       *User
	country  models.Country
	notFound string
}

type OssEmail struct {
	OssEmail string `json:"oss_email"`
}

func NewOssAdminsList(env *services.Env) *OssAdminsList {
	return &OssAdminsList{
		st:       env.OssAdminsListStore,
		oc:       NewOrganization(env),
		ac:       NewAsset(env),
		uc:       NewUser(env),
		country:  "Latvia",
		notFound: "record not found",
	}
}

func (oal *OssAdminsList) List(ctx context.Context, filter stores.Filter) ([]OssAdminUser, error) {
	var (
		orgs         []models.Organization
		adminResults []OssAdminUser
	)
	if err := oal.st.DB().Where("oss_approved = 't'").Where("legal_form = '12'").Order("created_at ASC").Find(&orgs).Error; err != nil {
		return nil, err
	}
	for _, org := range orgs {
		var (
			role models.OrganizationRole
			adm  models.User
		)
		if err := oal.st.DB().Where("position = 'lear'").Where("organization_id = ?", org.ID).Find(&role).Error; err != nil {
			return nil, err
		}
		if err := oal.st.DB().Where("id = ?", role.UserID).First(&adm).Error; err != nil && err.Error() != oal.notFound {
			return nil, err
		}
		admin := OssAdminUser{
			Value:            models.Value{ID: uuid.New()},
			OrganizationID:   org.ID,
			OrganizationName: org.Name,
			UserID:           adm.ID,
			Email:            adm.Email,
			Country:          adm.Country,
		}
		adminResults = append(adminResults, admin)
	}

	return adminResults, nil
}

func (oal *OssAdminsList) RemoveDuplicates(ossSlice []OssAdminUser) []OssAdminUser {
	allKeys := make(map[uuid.UUID]bool)
	list := []OssAdminUser{}
	for _, oss := range ossSlice {
		if _, value := allKeys[oss.ID]; !value {
			allKeys[oss.ID] = true
			list = append(list, oss)
		}
	}
	return list
}

func (oal *OssAdminsList) Users(ctx context.Context, rc io.ReadCloser) ([]models.User, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var ossEmail OssEmail
	var userIDs []string
	var details []models.UserBasicDetails

	if err := json.NewDecoder(rc).Decode(&ossEmail); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, UsersOssAdminsList, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	if errFind := oal.st.DB().Order("created_at ASC").Where("selected_oss = ?", ossEmail.OssEmail).Find(&details).Error; errFind != nil {
		return nil, errFind
	}

	for _, det := range details {
		userIDs = append(userIDs, det.UserID)
	}

	users, errUsr := oal.FetchUsers(userIDs)
	if errUsr != nil {
		return nil, errUsr
	}

	return users, nil
}

func (oal *OssAdminsList) FetchUsers(ids []string) ([]models.User, error) {
	var result []models.User
	return result, oal.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}

func (oal *OssAdminsList) Counts(ctx context.Context, body io.Reader) (*DashboardCount, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		getRequest GetOrganizationRequest
		orgID      uuid.UUID
	)
	if err := json.NewDecoder(body).Decode(&getRequest); err != nil {
		return nil, err
	}
	if !Can(ctx, GetDashboardCount, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	orgID, err := uuid.Parse(getRequest.OrganizationID)

	if len(getRequest.OrganizationID) > 1 {
		dash, ossMail, err1 := oal.CountFromOrg(ctx, nil, getRequest.OssAdminID, getRequest.OrganizationID)
		if err1 != nil {
			return nil, err1
		}
		return oal.CountOssAdmin(ctx, dash, *ossMail)
	} else {
		orgDoc, err := oal.oc.OrgFromLear(ctx, getRequest.OssAdminID)
		if err != nil && err.Error() != oal.notFound {
			return nil, err
		}
		fmt.Printf("org:%v\n", orgDoc.Data.(*models.Organization))
		orgID = orgDoc.Data.(*models.Organization).ID
	}

	doc, _, err := oal.oc.Get(ctx, orgID)
	if err != nil && err.Error() != oal.notFound {
		return nil, err
	}
	dash, ossMail, err1 := oal.CountFromOrg(ctx, doc, getRequest.OssAdminID, orgID.String())
	if err1 != nil {
		return nil, err1
	}
	return oal.CountOssAdmin(ctx, dash, *ossMail)
}

func (oal *OssAdminsList) CountOssAdmin(ctx context.Context, dash *DashboardCount, ossEmail string) (*DashboardCount, error) {
	var (
		userData  []models.OnboardingUserData
		userBasic []models.UserBasicDetails

		residentsCount    int
		associationsCount int
		operatorsCount    int
		calculatorsCount  int
		checklistCount    int
		checklistRefCount int
	)
	oal.st.DB().Model(&userData).Where("oss_admin_id = ?", ossEmail).Where("menu_type = ?", "Resident").Count(&residentsCount)
	oal.st.DB().Model(&userData).Where("oss_admin_id = ?", ossEmail).Where("menu_type = ?", "Housing Association").Count(&associationsCount)
	oal.st.DB().Model(&userData).Where("oss_admin_id = ?", ossEmail).Where("menu_type = ?", "Service Operator").Count(&operatorsCount)
	oal.st.DB().Model(&userBasic).Where("oss_admin_id = ?", ossEmail).Where("oss_admin_id = ?", ossEmail).Count(&calculatorsCount)
	oal.st.DB().Model(&userData).Where("oss_admin_id = ?", ossEmail).Where("menu_type = ?", "EES Checklist").Count(&checklistCount)
	oal.st.DB().Model(&userData).Where("oss_admin_id = ?", ossEmail).Where("menu_type = ?", "EES Refinancability Checklist").Count(&checklistRefCount)

	dash.ResidentsCount = residentsCount
	dash.AssociationsCount = associationsCount
	dash.OperatorsCount = operatorsCount
	dash.CalculatorsCount = calculatorsCount
	dash.ChecklistCount = checklistCount
	dash.ChecklistRefCount = checklistRefCount

	return dash, nil
}

func (oal *OssAdminsList) CountFromOrg(ctx context.Context, doc *models.Document, OssAdminID, orgID string) (*DashboardCount, *string, error) {
	var (
		projects []models.Project
		assets   []models.Asset
		orgRoles []models.OrganizationRole
		org      models.Organization
		orgRole  models.OrganizationRole
		ossAdmin models.User
		ossEmail *string

		residentsCount    int
		associationsCount int
		operatorsCount    int
		calculatorsCount  int
		checklistCount    int
		checklistRefCount int
		projectsCount     int
		assetsCount       int
		employeesCount    int
	)

	if err := oal.st.DB().Where("id = ?", orgID).First(&org).Error; err != nil {
		return nil, nil, err
	}
	if err := oal.st.DB().Where("owner = ?", orgID).Find(&projects).Error; err != nil {
		return nil, nil, err
	}
	projectsCount = len(projects)
	if err1 := oal.st.DB().Where("owner_id = ?", orgID).Find(&assets).Error; err1 != nil {
		return nil, nil, err1
	}
	assetsCount = len(assets)
	oal.st.DB().Model(&orgRoles).Where("organization_id = ?", orgID).Count(&employeesCount)

	if err1 := oal.st.DB().Where("organization_id = ?", orgID).Find(&orgRole).Error; err1 != nil {
		return nil, nil, err1
	}
	if err2 := oal.st.DB().Where("id = ?", orgRole.UserID).First(&ossAdmin).Error; err2 != nil {
		return nil, nil, err2
	}
	ossEmail = &ossAdmin.Email
	dashCount := DashboardCount{
		ResidentsCount:    residentsCount,
		AssociationsCount: associationsCount,
		OperatorsCount:    operatorsCount,
		CalculatorsCount:  calculatorsCount,
		ChecklistCount:    checklistCount,
		ChecklistRefCount: checklistRefCount,
		ProjectsCount:     projectsCount,
		AssetsCount:       assetsCount,
		EmployeesCount:    employeesCount,
		OrganizationName:  org.Name,
	}
	return &dashCount, ossEmail, nil
}
