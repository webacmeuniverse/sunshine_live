package services

import (
	"encoding/base64"
	"fmt"
	"testing"
	"time"

	"acme.universe/sunshine/sunshine/config"
	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/stores"

	sentry "github.com/getsentry/sentry-go"
	"github.com/gorilla/sessions"
	"github.com/jinzhu/gorm"
	"gopkg.in/go-playground/validator.v9"
)

type Env struct {
	General                                   config.General
	Paths                                     config.Paths
	AssetStore                                stores.Store
	ContractStore                             stores.Store
	OrganizationStore                         stores.Store
	UserStore                                 stores.Store
	ProjectStore                              stores.Store
	IndoorClimaStore                          stores.Store
	MeetingsStore                             stores.Store
	FAStore                                   stores.Store
	FPStore                                   stores.Store
	WPStore                                   stores.Store
	MPStore                                   stores.Store
	GDPRStore                                 stores.Store
	CountryStore                              stores.Store
	StepStore                                 stores.Store
	StepsResultStore                          stores.Store
	OnboardingResidentStepStore               stores.Store
	StepBackupStore                           stores.Store
	StepFieldBackupStore                      stores.Store
	StepsResultBackupStore                    stores.Store
	OssEesTable2Store                         stores.Store
	ResultSubObjectBackupStore                stores.Store
	MasterTemplateStepStore                   stores.Store
	MasterTemplateQuestionStore               stores.Store
	MasterTemplateFieldStore                  stores.Store
	MasterTemplateOptionStore                 stores.Store
	PlaceholderStore                          stores.Store
	OnboardingResidentStepBackupStore         stores.Store
	OnboardingResidentStepQuestionStore       stores.Store
	ReplyMailStore                            stores.Store
	OnboardingResidentStepBackupQuestionStore stores.Store
	OnboardingResidentStepFieldStore          stores.Store
	OnboardingResidentStepBackupFieldStore    stores.Store
	OnboardingHousingStepStore                stores.Store
	OnboardingHousingStepFieldStore           stores.Store
	OnboardingHousingStepQuestionStore        stores.Store
	StepFieldOptionStore                      stores.Store
	StepBackupFieldOptionStore                stores.Store
	UserResultBasicStore                      stores.Store
	RenovateCalcInputStore                    stores.Store
	Subscribers                               stores.Store
	UserCalculationStore                      stores.Store
	UserInputDataStore                        stores.Store
	BookACallStore                            stores.Store
	EnergyCertDetailsStore                    stores.Store
	EnergyCertCategoryStore                   stores.Store
	EnergyCertReductionStore                  stores.Store
	EnergyCertFileStore                       stores.Store
	SendMailStore                             stores.Store
	UserOtp                                   stores.Store
	SupportAPIStore                           stores.Store
	OnboardingUserDataStore                   stores.Store
	UserResultStore                           stores.Store
	GetResultTbl1Store                        stores.Store
	GetResultTbl2Store                        stores.Store
	OssEesResultTbl2Store                     stores.Store
	OssEesResultTbl2YearFormulaStore          stores.Store
	OrganizationRatingStore                   stores.Store
	OnboardingDescriptionStore                stores.Store
	OssAdminsListStore                        stores.Store
	Notifier                                  stores.Notifier
	Portfolio                                 stores.Portfolio
	SessionStore                              sessions.Store
	TokenStore                                stores.TokenStore
	Mailer                                    Mailer
	Validator                                 *validator.Validate
	Debug                                     bool
	DB                                        *gorm.DB
}

// NewSessionStore returns a new instance of session store with sensible
// options and proper auth and encrypt keys.
func NewSessionStore(cfg config.Session) (sessions.Store, error) {
	auth, err := base64.StdEncoding.DecodeString(cfg.Auth)
	if err != nil {
		return nil, err
	}
	enc, err := base64.StdEncoding.DecodeString(cfg.Encr)
	if err != nil {
		return nil, err
	}

	store := sessions.NewCookieStore(auth, enc)
	store.Options.Path = cfg.Path
	store.Options.HttpOnly = cfg.HTTPOnly
	store.Options.Secure = cfg.Secure
	store.Options.SameSite = cfg.SameSite
	return store, nil
}

// NewEnv returns a new ready to use environment with PostgreSQL.
func NewEnv() (*Env, error) {
	var (
		cfg      = config.Load()
		db, err  = models.NewGORM(cfg.DB)
		validate = constructValidator()

		sender SendMail
	)

	if err != nil {
		return nil, err
	}

	switch cfg.Mail.Backend {
	case "smtp":
		sender = Send
	case "file":
		sender = SendToFile
	default:
		return nil, fmt.Errorf("mail backend %q not implemented", cfg.Mail.Backend)
	}

	sessionStore, err := NewSessionStore(cfg.Session)
	if err != nil {
		return nil, err
	}

	err = sentry.Init(sentry.ClientOptions{Dsn: cfg.General.SentryDSN, Release: "default_release", Environment: "default_env"})
	if err != nil {
		return nil, err
	}
	defer sentry.Flush(2 * time.Second)

	return &Env{
		General:                                   cfg.General,
		Paths:                                     cfg.Paths,
		AssetStore:                                stores.NewAssetStore(db, validate),
		ContractStore:                             stores.NewContractStore(db, validate),
		OrganizationStore:                         stores.NewOrganizationStore(db, validate),
		UserStore:                                 stores.NewUserStore(db, validate),
		StepStore:                                 stores.NewStepStore(db, validate),
		StepsResultStore:                          stores.NewStepsResultStore(db, validate),
		OnboardingResidentStepStore:               stores.NewOnboardingResidentStore(db, validate),
		StepBackupStore:                           stores.NewStepBackupStore(db, validate),
		StepsResultBackupStore:                    stores.NewStepsResultBackupStore(db, validate),
		StepFieldBackupStore:                      stores.NewStepFieldBackupStore(db, validate),
		OssEesTable2Store:                         stores.NewOssEesTable2Store(db, validate),
		ResultSubObjectBackupStore:                stores.NewResultSubObjectBackupStore(db, validate),
		MasterTemplateStepStore:                   stores.NewMasterTemplateStepStore(db, validate),
		MasterTemplateQuestionStore:               stores.NewMasterTemplateQuestionStore(db, validate),
		MasterTemplateFieldStore:                  stores.NewMasterTemplateFieldStore(db, validate),
		MasterTemplateOptionStore:                 stores.NewMasterTemplateOptionStore(db, validate),
		PlaceholderStore:                          stores.NewPlaceholderStore(db, validate),
		OnboardingResidentStepBackupStore:         stores.NewOnboardingResidentBackupStore(db, validate),
		OnboardingResidentStepQuestionStore:       stores.NewOnboardingResidentQuestionStore(db, validate),
		ReplyMailStore:                            stores.NewReplyMailStore(db, validate),
		OnboardingResidentStepBackupQuestionStore: stores.NewOnboardingResidentBackupQuestionStore(db, validate),
		OnboardingResidentStepFieldStore:          stores.NewOnboardingResidentFieldStore(db, validate),
		OnboardingResidentStepBackupFieldStore:    stores.NewOnboardingResidentFieldBackupStore(db, validate),
		OnboardingHousingStepStore:                stores.NewOnboardingHousingStore(db, validate),
		OnboardingHousingStepFieldStore:           stores.NewOnboardingHousingFieldStore(db, validate),
		OnboardingHousingStepQuestionStore:        stores.NewOnboardingHousingQuestionStore(db, validate),
		StepFieldOptionStore:                      stores.NewStepFieldOptionStore(db, validate),
		StepBackupFieldOptionStore:                stores.NewStepBackupFieldOptionStore(db, validate),
		UserResultBasicStore:                      stores.NewUserResultBasicStore(db, validate),
		RenovateCalcInputStore:                    stores.NewRenovateCalcInputStore(db, validate),
		Subscribers:                               stores.NewSubscribersStore(db, validate),
		UserCalculationStore:                      stores.NewUserCalculationStore(db, validate),
		UserInputDataStore:                        stores.NewUserInputDataStore(db, validate),
		BookACallStore:                            stores.NewBookACallStore(db, validate),
		EnergyCertDetailsStore:                    stores.NewEnergyCertDetails(db, validate),
		EnergyCertCategoryStore:                   stores.NewEnergyCertCategory(db, validate),
		EnergyCertReductionStore:                  stores.NewEnergyCertReduction(db, validate),
		EnergyCertFileStore:                       stores.NewEnergyCertFile(db, validate),
		SendMailStore:                             stores.NewSendMailStore(db, validate),
		UserOtp:                                   stores.NewUserOtpStore(db, validate),
		SupportAPIStore:                           stores.NewSupportAPIStore(db, validate),
		OnboardingUserDataStore:                   stores.NewOnboardingUserDataStore(db, validate),
		UserResultStore:                           stores.NewUserResultStore(db, validate),
		GetResultTbl1Store:                        stores.NewGetResultTbl1Store(db, validate),
		GetResultTbl2Store:                        stores.NewGetResultTbl2Store(db, validate),
		OssEesResultTbl2Store:                     stores.NewOssEesResultTbl2Store(db, validate),
		OssEesResultTbl2YearFormulaStore:          stores.NewOssEesResultTbl2YearFormulaStore(db, validate),
		OrganizationRatingStore:                   stores.NewOrganizationRatingStore(db, validate),
		OnboardingDescriptionStore:                stores.NewOnboardingDescriptionStore(db, validate),
		OssAdminsListStore:                        stores.NewOssAdminsStore(db, validate),
		IndoorClimaStore:                          stores.NewIndoorClimaStore(db, validate),
		MeetingsStore:                             stores.NewMeetingsStore(db, validate),
		WPStore:                                   stores.NewWorkPhaseStore(db, validate),
		MPStore:                                   stores.NewMonitoringPhaseStore(db, validate),
		Notifier:                                  stores.NewNotifier(db, validate),
		Portfolio:                                 stores.NewPortfolioStore(db),
		GDPRStore:                                 stores.NewGDPRStore(db, validate),
		CountryStore:                              stores.NewCountryStore(db, validate),
		SessionStore:                              sessionStore,
		ProjectStore:                              stores.NewProjectStore(db, validate),
		TokenStore:                                stores.NewTokenStore(db, validate),
		FAStore:                                   stores.NewForfaitingApplicationStore(db, validate),
		FPStore:                                   stores.NewForfaitingPaymentStore(db, validate),
		Mailer:                                    NewMailer(cfg.General, cfg.Mail, sender),
		Validator:                                 validate,
		DB:                                        db,
	}, err
}

// NewTestEnv returns a new ready to use PostgreSQL environment and a delete func.
func NewTestEnv(t *testing.T) *Env {
	var (
		cfg      = config.Load()
		db       = models.NewTestGORM(t)
		validate = constructValidator()
	)

	sessionStore, err := NewSessionStore(cfg.Session)
	if err != nil {
		t.Fatal(err)
	}

	for _, c := range models.Countries() {
		if c.IsConsortium() {
			stores.NewTestPortfolioRole(t, stores.NewUserStore(db, validate), models.PortfolioDirectorRole, c)
			stores.NewTestPortfolioRole(t, stores.NewUserStore(db, validate), models.DataProtectionOfficerRole, c)
			stores.NewTestPortfolioRole(t, stores.NewUserStore(db, validate), models.CountryAdminRole, c)
		}
	}

	return &Env{
		General:                                   cfg.General,
		Paths:                                     cfg.Paths,
		AssetStore:                                stores.NewAssetStore(db, validate),
		ContractStore:                             stores.NewContractStore(db, validate),
		OrganizationStore:                         stores.NewOrganizationStore(db, validate),
		UserStore:                                 stores.NewUserStore(db, validate),
		StepStore:                                 stores.NewStepStore(db, validate),
		StepsResultStore:                          stores.NewStepsResultStore(db, validate),
		OnboardingResidentStepStore:               stores.NewOnboardingResidentStore(db, validate),
		StepBackupStore:                           stores.NewStepBackupStore(db, validate),
		StepsResultBackupStore:                    stores.NewStepsResultBackupStore(db, validate),
		StepFieldBackupStore:                      stores.NewStepFieldBackupStore(db, validate),
		OssEesTable2Store:                         stores.NewOssEesTable2Store(db, validate),
		ResultSubObjectBackupStore:                stores.NewResultSubObjectBackupStore(db, validate),
		MasterTemplateStepStore:                   stores.NewMasterTemplateStepStore(db, validate),
		MasterTemplateQuestionStore:               stores.NewMasterTemplateQuestionStore(db, validate),
		MasterTemplateFieldStore:                  stores.NewMasterTemplateFieldStore(db, validate),
		MasterTemplateOptionStore:                 stores.NewMasterTemplateOptionStore(db, validate),
		PlaceholderStore:                          stores.NewPlaceholderStore(db, validate),
		OnboardingResidentStepBackupStore:         stores.NewOnboardingResidentBackupStore(db, validate),
		OnboardingResidentStepQuestionStore:       stores.NewOnboardingResidentQuestionStore(db, validate),
		ReplyMailStore:                            stores.NewReplyMailStore(db, validate),
		OnboardingResidentStepBackupQuestionStore: stores.NewOnboardingResidentBackupQuestionStore(db, validate),
		OnboardingResidentStepFieldStore:          stores.NewOnboardingResidentFieldStore(db, validate),
		OnboardingResidentStepBackupFieldStore:    stores.NewOnboardingResidentFieldBackupStore(db, validate),
		OnboardingHousingStepStore:                stores.NewOnboardingHousingStore(db, validate),
		OnboardingHousingStepFieldStore:           stores.NewOnboardingHousingFieldStore(db, validate),
		OnboardingHousingStepQuestionStore:        stores.NewOnboardingHousingQuestionStore(db, validate),
		StepFieldOptionStore:                      stores.NewStepFieldOptionStore(db, validate),
		StepBackupFieldOptionStore:                stores.NewStepBackupFieldOptionStore(db, validate),
		UserResultBasicStore:                      stores.NewUserResultBasicStore(db, validate),
		RenovateCalcInputStore:                    stores.NewRenovateCalcInputStore(db, validate),
		Subscribers:                               stores.NewSubscribersStore(db, validate),
		UserCalculationStore:                      stores.NewUserCalculationStore(db, validate),
		UserInputDataStore:                        stores.NewUserInputDataStore(db, validate),
		BookACallStore:                            stores.NewBookACallStore(db, validate),
		EnergyCertDetailsStore:                    stores.NewEnergyCertDetails(db, validate),
		EnergyCertCategoryStore:                   stores.NewEnergyCertCategory(db, validate),
		EnergyCertReductionStore:                  stores.NewEnergyCertReduction(db, validate),
		EnergyCertFileStore:                       stores.NewEnergyCertFile(db, validate),
		SendMailStore:                             stores.NewSendMailStore(db, validate),
		UserOtp:                                   stores.NewUserOtpStore(db, validate),
		SupportAPIStore:                           stores.NewSupportAPIStore(db, validate),
		OnboardingUserDataStore:                   stores.NewOnboardingUserDataStore(db, validate),
		UserResultStore:                           stores.NewUserResultStore(db, validate),
		GetResultTbl1Store:                        stores.NewGetResultTbl1Store(db, validate),
		GetResultTbl2Store:                        stores.NewGetResultTbl2Store(db, validate),
		OssEesResultTbl2Store:                     stores.NewOssEesResultTbl2Store(db, validate),
		OssEesResultTbl2YearFormulaStore:          stores.NewOssEesResultTbl2YearFormulaStore(db, validate),
		OrganizationRatingStore:                   stores.NewOrganizationRatingStore(db, validate),
		OnboardingDescriptionStore:                stores.NewOnboardingDescriptionStore(db, validate),
		OssAdminsListStore:                        stores.NewOssAdminsStore(db, validate),
		IndoorClimaStore:                          stores.NewIndoorClimaStore(db, validate),
		MeetingsStore:                             stores.NewMeetingsStore(db, validate),
		Notifier:                                  stores.NewNotifier(db, validate),
		Portfolio:                                 stores.NewPortfolioStore(db),
		WPStore:                                   stores.NewWorkPhaseStore(db, validate),
		MPStore:                                   stores.NewMonitoringPhaseStore(db, validate),
		SessionStore:                              sessionStore,
		ProjectStore:                              stores.NewProjectStore(db, validate),
		TokenStore:                                stores.NewTokenStore(db, validate),
		FAStore:                                   stores.NewForfaitingApplicationStore(db, validate),
		FPStore:                                   stores.NewForfaitingPaymentStore(db, validate),
		GDPRStore:                                 stores.NewGDPRStore(db, validate),
		CountryStore:                              stores.NewCountryStore(db, validate),
		Mailer:                                    NewMailer(cfg.General, cfg.Mail, Send), // SendToFile
		Debug:                                     true,
		Validator:                                 validate,
		DB:                                        db,
	}
}

func constructValidator() *validator.Validate {
	var result = validator.New()

	result.RegisterValidation("upload_type", func(fl validator.FieldLevel) bool {
		_, ok := models.UploadTypes[fl.Field().String()]
		return ok
	})

	return result
}
