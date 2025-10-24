package controller

import (
	"context"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"

	"github.com/google/uuid"
)

// Action is defined by who is allowed to perform it.
type Action uint32

const (
	self = 1 << iota
	logged

	// oss admin role
	oss

	// Organization roles
	lear
	lsigns
	leaas
	members

	// Project roles
	pm
	paco
	plsign
	tama
	teme

	// Country roles
	pd
	fm
	dpo
	ca

	valid

	// Admin roles
	pfm // platform manager
	anm // admin network manager
	investor
	superuser
)

const (
	// user actions
	ListUsers             Action = logged
	ListAdminUsers        Action = superuser | pfm | anm
	GetUser               Action = superuser | pfm | anm | self | ca
	UpdateUser            Action = superuser | pfm | anm | self
	UploadUser            Action = superuser | pfm | anm | self
	ListUserAssets        Action = superuser | pfm | anm | self | pd
	ListUserOrganizations Action = superuser | pfm | anm | self | pd
	ListUserProjects      Action = superuser | pfm | anm | self | pd
	DownloadUserFile      Action = superuser | pfm | anm | self
	DeleteUserFile        Action = superuser | pfm | anm | self
	ValidateUser          Action = superuser | pfm | anm | ca

	// organization actions
	CreateOrganization            Action = logged
	GetOrganization               Action = logged
	UpdateOrganization            Action = superuser | pfm | anm | lear | leaas | ca
	UploadOrganization            Action = superuser | pfm | anm | lear | leaas | lsigns | ca
	DeleteOrgFile                 Action = superuser | pfm | anm | lear | leaas | lsigns | ca
	GetOrgMeetings                Action = superuser | pfm | anm | lear | leaas | lsigns | ca
	GetPrjMeetings                Action = superuser | pfm | anm | lear | leaas | lsigns | ca
	DownloadOrgFile               Action = superuser | pfm | anm | lear | lsigns | leaas | members | pd | ca
	AddOrganizationRole           Action = superuser | pfm | anm | lear | leaas | ca
	RemoveOrganizationRole        Action = superuser | pfm | anm | lear | leaas | ca
	ValidateOrganization          Action = superuser | pfm | anm | ca
	RequestOrganizationMembership Action = logged
	ClaimAssetResidency           Action = logged
	AcceptLEARApplication         Action = superuser | lear | ca

	// asset actions
	GetAsset          Action = logged
	UpdateAsset       Action = superuser | pfm | anm | pd | lear | leaas | lsigns | members | ca
	UploadAsset       Action = superuser | pfm | anm | lear | leaas | lsigns | members | ca
	DeleteAssetFile   Action = superuser | pfm | anm | lear | leaas | lsigns | members | ca
	DownloadAssetFile Action = superuser | pfm | anm | lear | lsigns | leaas | members | pd | ca
	ValidateAsset     Action = superuser | pfm | anm | ca

	// project actions
	CreateProject       Action = logged
	ListProjects        Action = logged
	GetProject          Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | pd | lear | lsigns | leaas | members | investor | fm | ca
	UpdateProject       Action = superuser | pfm | anm | pm | pd | fm | ca
	UploadProject       Action = superuser | pfm | anm | pm | tama | fm | ca
	DeleteProjectFile   Action = superuser | pfm | anm | pm | ca | fm | tama
	DownloadProjectFile Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | pd | investor | fm | ca | lear | lsigns | leaas | members
	AddProjectRole      Action = superuser | pfm | anm | pm | pd | ca
	RemoveProjectRole   Action = superuser | pfm | anm | pm | pd | ca | tama
	ChangeFundManager   Action = superuser | pfm | anm | pd | ca
	AssignPM            Action = superuser | pfm | anm | pm | plsign | ca
	CommentProject      Action = superuser | pfm | anm | pm | paco | plsign | tama | fm | ca

	// contract actions
	DownloadProjectContract     Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | pd | lear | fm | ca | lsigns | leaas | members
	DownloadProjectAgreement    Action = superuser | pfm | anm | pm | paco | plsign | teme | pd | lear | fm | ca | lsigns | leaas | members
	UpdateProjectAgreement      Action = superuser | pfm | anm | pm | paco | plsign | fm | ca
	GetProjectAgreement         Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | pd | lear | fm | ca | lear | lsigns | leaas | members | investor
	GetProjectContractFields    Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | pd | lear | fm | ca | lear | lsigns | leaas | members | investor
	UpdateProjectContractFields Action = superuser | pfm | anm | pm | paco | plsign | fm | ca
	GetProjectContractTable     Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | pd | lear | fm | ca | lear | lsigns | leaas | members | investor
	UpdateProjectContractTable  Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | fm | ca
	UpdateProjectMaintenance    Action = superuser | pfm | anm | pm | paco | plsign | fm | ca
	GetProjectMaintenance       Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | pd | lear | fm | ca | lear | lsigns | leaas | members | investor

	// indoor clima actions
	GetProjectIndoorClima    Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | pd | ca | lear | lsigns | leaas | members | investor
	UpdateProjectIndoorClima Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | ca

	// milestones
	AdvanceProjectToWorkPhase       Action = superuser | pfm | anm | pd | pm | ca
	AdvanceProjectToMilestone       Action = superuser | pfm | anm | pm | ca
	GetWorkPhase                    Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | fm | ca | lear | lsigns | leaas | members | investor
	UploadWorkPhase                 Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | fm | ca
	DownloadWorkPhaseFile           Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | fm | ca | lear | lsigns | leaas | members
	DeleteWorkPhaseFile             Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | fm | ca
	AdvanceProjectToMonitoringPhase Action = superuser | pfm | anm | pd | pm | ca
	GetMonitoringPhase              Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | fm | ca | lear | lsigns | leaas | members | investor
	UploadMonitoringPhase           Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | fm | ca
	DownloadMonitoringPhaseFile     Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | fm | ca | lear | lsigns | leaas | members
	DeleteMonitoringPhaseFile       Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | fm | ca
	CreateTask                      Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | pd | lear | lsigns | leaas | members | fm | ca
	GetTask                         Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | pd | lear | lsigns | leaas | members | fm | ca | investor
	DeleteTask                      Action = superuser | pfm | anm | pm | paco | plsign | fm | ca | tama
	CommentTask                     Action = superuser | pfm | anm | pm | pd | fm | ca
	UpdateTask                      Action = superuser | pfm | anm | pm | paco | plsign | tama | teme | pd | lear | lsigns | leaas | members | fm | ca
	WPReview                        Action = superuser | pfm | anm | pd | pm | fm | ca
	MPReview                        Action = superuser | pfm | anm | pd | pm | fm | ca
	WPReviewMaintenance             Action = superuser | pfm | anm | pd | pm | tama | fm | ca

	// fa
	CreateFA           Action = superuser | pfm | anm | pm | ca
	ReviewFA           Action = superuser | pfm | anm | pd | fm | pm | ca
	ListFAByCountry    Action = superuser | pfm | anm | pd | fm | dpo | ca | investor | lear | lsigns | leaas | members
	GetFAByProject     Action = ListFAByCountry | pm | investor | fm | ca
	GetFA              Action = ListFAByCountry | pm | investor | fm | ca
	UpdateFA           Action = superuser | pfm | anm | pm | fm | ca
	UploadFAAttachment Action = superuser | pfm | anm | pm | tama | fm | ca
	GetFAAttachment    Action = UploadFAAttachment | lear | lsigns | leaas | members
	DeleteFAAttachment Action = UploadFAAttachment
	CreateFP           Action = CreateFA
	GetFP              Action = GetFA
	UpdateFP           Action = UpdateFA

	// gdpr
	GetGDPRRequest   Action = superuser | pfm | anm | dpo
	ListGDPRRequests Action = superuser | pfm | anm | dpo

	// portfolio
	AddPortfolioRole      Action = superuser | pfm | anm
	RemovePortfolioRole   Action = superuser | pfm | anm
	AddAdminNetworkMan    Action = superuser | pfm | anm
	RemoveAdminNetworkMan Action = superuser | pfm | anm
	AddCountryAdmin       Action = superuser | pfm | anm
	RemoveCountryAdmin    Action = superuser | pfm | anm

	// global
	addEurobor Action = superuser | anm | pfm
	SetVat     Action = superuser | anm | pfm
	GetCountry Action = superuser | anm | pfm

	// oss admin rules

	CreateStepField Action = logged | oss
	UpdateStepField Action = logged | oss
	GetStepField    Action = logged | oss
	DeleteStepField Action = logged | oss

	CreateGetResTbl1 Action = logged | oss
	CreateGetResTbl2 Action = logged | oss
	UpdateGetResTbl2 Action = logged | oss
	DeleteGetResTbl2 Action = logged | oss
	ListGetResTbl2   Action = logged | oss
	GetGetResTbl2    Action = logged | oss

	CreateOnboardHseQuiz Action = logged | oss
	UpdateOnboardHseQuiz Action = logged | oss
	DeleteOnboardHseQuiz Action = logged | oss
	ListOnboardHseQuiz   Action = logged | oss
	GetOnboardHseQuiz    Action = logged | oss

	CreateOnboardHseStep Action = logged | oss
	UpdateOnboardHseStep Action = logged | oss
	DeleteOnboardHseStep Action = logged | oss

	CreateOnboardResQuizBUp Action = logged | oss
	GetOnboardResQuizBUp    Action = logged | oss
	UpdateOnboardResQuizBUp Action = logged | oss
	DeleteOnboardResQuizBUp Action = logged | oss

	CreateOnboardResQuiz Action = logged | oss
	UpdateOnboardResQuiz Action = logged | oss
	ListOnboardResQuiz   Action = logged | oss
	DeleteOnboardResQuiz Action = logged | oss

	CreateOnboardResStepBackupField Action = logged | oss
	UpdateOnboardResStepBackupField Action = logged | oss
	DeleteOnboardResStepBackupField Action = logged | oss

	CreateOnboardResStepBackup Action = logged | oss

	CreateOnboardResStepField Action = logged | oss
	GetOnboardResStepField    Action = logged | oss
	UpdateOnboardResStepField Action = logged | oss
	DeleteOnboardResStepField Action = logged | oss

	GetDashboardCount Action = logged | oss

	CreateOssEesResTbl2 Action = logged | oss
	GetOssEesResTbl2    Action = logged | oss
	UpdateOssEesResTbl2 Action = logged | oss
	DeleteOssEesResTbl2 Action = logged | oss
	ListOssEesResTbl2   Action = logged | oss

	CreateOssEesYearFormula Action = logged | oss
	UpdateOssEesYearFormula Action = logged | oss
	DeleteOssEesYearFormula Action = logged | oss

	ListOssEesUserRecord Action = logged | oss

	CreatePlaceholder Action = logged | oss
	ListPlaceholder   Action = logged | oss
	UpdatePlaceholder Action = logged | oss
	DeletePlaceholder Action = logged | oss

	ListRenovateCalcInput Action = logged | oss

	CreateReplyMail Action = logged | oss
	ListReplyMail   Action = logged | oss
	GetReplyMail    Action = logged | oss
	UpdateReplyMail Action = logged | oss
	DeleteReplyMail Action = logged | oss

	CreateSetDefTemp    Action = logged | oss
	CreateEesSetDefTemp Action = logged | oss

	CreateStepBackupFieldOpt Action = logged | oss
	UpdateStepBackupFieldOpt Action = logged | oss
	DeleteStepBackupFieldOpt Action = logged | oss

	CreateStepFieldOption Action = logged | oss
	GetStepFieldOption    Action = logged | oss
	UpdateStepFieldOption Action = logged | oss
	DeleteStepFieldOption Action = logged | oss

	CreateStepItem Action = logged | oss
	UpdateStepItem Action = logged | oss
	DeleteStepItem Action = logged | oss

	CreateStepsResult Action = logged | oss
	UpdateStepsResult Action = logged | oss
	DeleteStepsResult Action = logged | oss
	GetStepsResult    Action = logged | oss

	CreateSupportAPI Action = logged | oss
	ListSupportAPI   Action = logged | oss
	UpdateSupportAPI Action = logged | oss
	DeleteSupportAPI Action = logged | oss

	CreateUserResultBasic Action = logged | oss
	UpdateUserResultBasic Action = logged | oss
	DeleteUserResultBasic Action = logged | oss
	ListUserResultBasic   Action = logged | oss
	GetUserResultBasic    Action = logged | oss

	CreateUserResult Action = logged | oss
	UpdateUserResult Action = logged | oss
	DeleteUserResult Action = logged | oss
	ListUserResult   Action = logged | oss
	GetUserResult    Action = logged | oss

	CreateEesCalcBackup  Action = logged | oss
	ListEesCalcBackup    Action = logged | oss
	RestoreEesCalcBackup Action = logged | oss

	UsersOssAdminsList Action = logged | oss

	CreateOnboardingResidentStep Action = logged | oss
	GetOnboardingResidentStep    Action = logged | oss
	UpdateOnboardingResidentStep Action = logged | oss
	DeleteOnboardingResidentStep Action = logged | oss
	ListOnboardingResidentStep   Action = logged | oss

	GetOnboardingHousingStepField    Action = logged | oss
	CreateOnboardingHousingStepField Action = logged | oss
	UpdateOnboardingHousingStepField Action = logged | oss
	DeleteOnboardingHousingStepField Action = logged | oss

	ListUserInputData   Action = logged | oss
	GetUserInputData    Action = logged | oss
	UpdateUserInputData Action = logged | oss
	DeleteUserInputData Action = logged | oss

	ListOnboardingUserData   Action = logged | oss
	UpdateOnboardingUserData Action = logged | oss

	GetOnboardingResidentStepBackup     Action = logged | oss
	RestoreOnboardingResidentStepBackup Action = logged | oss

	ListBookACall Action = logged | oss

	UploadSendMail Action = logged | oss

	CreateMasterTemplateStep Action = logged | oss
	GetMasterTemplateStep    Action = logged | oss

	ListSubscribers Action = logged | oss
)

// '/subscribe'  -post
// '/onboarding/residents/step' - 'PUT',
// '/oss/admins' -'GET'
// '/user/input/data' - 'POST'
// '/user/input/data' - 'POST'
// '/onboarding/user/check?email='  -'get'
// '/onboarding/user/data' - 'POST'
// '/send/mail'   - 'POST'
// '/onboarding/user/data/{id}' -'GET'
// '/onboarding/user/check?email='  - 'get'
// '/onboarding/user/data'  - 'POST'
// '/user'  - 'POST'
// '/send/mail'  -  'POST'
// '/onboarding/user/data/{id}'  -  'GET'
// '/find/my/partner'  -  'PUT'
// '/book/a/call'  - 'POST'
// '/organization/rating' - 'POST'
// `/organization/rating?id=${orgId}` -  'GET'
// '/organization/{id}'  -  'GET'
// '/user/otp' - 'POST'
// `/user/otp?email=${creds.email}&otp=${creds.otp}` -  'get'

func roleAction(u models.User, target uuid.UUID, country models.Country) Action {
	var a Action = logged
	if u.ID == target {
		a |= self
	}
	if u.SuperUser {
		a |= superuser
	}
	if u.PlatformManager {
		a |= pfm
	}
	if u.AdminNwManager {
		a |= anm
	}
	if u.Valid == models.ValidationStatusValid {
		a |= valid
	}
	for _, role := range u.ProjectRoles {
		if role.ProjectID == target {
			a |= Action(roleBit(role.Position))
		}
	}

	for _, role := range u.OrganizationRoles {
		if role.OrganizationID == target {
			a |= Action(roleBit(role.Position))
		}
	}

	for _, role := range u.CountryRoles {
		if role.Country == country && role.UserID == u.ID {
			a |= Action(roleBit(role.Role.String()))
		}
	}

	return a
}

// Can reports whether actor holding a ctx is authorized to perform action on target.
func Can(ctx context.Context, action Action, target uuid.UUID, country models.Country) bool {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return false
	}

	u := cv.User
	actor := roleAction(*u, target, country)

	return action&actor != 0
}

func roleBit(position string) int32 {
	switch position {
	case "lear":
		return lear
	case "lsign":
		return lsigns
	case "leaa":
		return leaas
	case "member":
		return members
	case "pm":
		return pm
	case "paco":
		return paco
	case "plsign":
		return plsign
	case "tama":
		return tama
	case "teme":
		return teme
	case "portfolio_director":
		return pd
	case "fund_manager":
		return fm
	case "data_protection_officer":
		return dpo
	case "country_admin":
		return ca
	case "investor":
		return investor
	case "oss":
		return oss
	default:
		return 0
	}
}
