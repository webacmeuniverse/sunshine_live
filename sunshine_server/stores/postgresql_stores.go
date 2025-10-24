package stores

import (
	"fmt"

	"acme.universe/sunshine/sunshine/contract"
	"acme.universe/sunshine/sunshine/models"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"gopkg.in/go-playground/validator.v9"
)

func NewStepStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "name",
		new:      func() models.Entity { return new(models.StepItem) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("step.name = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewOssAdminsStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "is_oss_admin",
		new:      func() models.Entity { return new(models.User) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("user.is_oss_admin = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewGetResultTbl1Store(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "user_id",
		new:      func() models.Entity { return new(models.GetResultTbl1) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("get_result_tbl1.user_id = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

// func NewOnboardingDescriptionStore(db *gorm.DB, v *validator.Validate) Store {
// 	return store{
// 		db:       db,
// 		validate: v,
// 		index:    "description",
// 		new:      func() models.Entity { return new(models.OnboardingDescription) },
// 		search: func(d *gorm.DB, f Filter) *gorm.DB {
// 			if f.Search != "" {
// 				d = d.Where("onboarding_description.description = ?", pattern((f.Search)))
// 			}
// 			return d
// 		},
// 		member: func(d *gorm.DB, u ...uuid.UUID) *gorm.DB { return d },
// 	}
// }

func NewOnboardingDescriptionStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "description",
		new:      func() models.Entity { return new(models.OnboardingDescription) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("onboarding_description.description = ?", pattern(f.Search))
			}
			return d
		},
		member: func(d *gorm.DB, u ...uuid.UUID) *gorm.DB { return d },
	}
}

func NewOrganizationRatingStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "organization_id",
		new:      func() models.Entity { return new(models.OrganizationRating) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("organization_rating.organization_id = ?", pattern(f.Search))
			}
			return d
		},
		member: func(d *gorm.DB, u ...uuid.UUID) *gorm.DB { return d },
	}
}

func NewOssEesResultTbl2YearFormulaStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "field_name",
		new:      func() models.Entity { return new(models.OssEesResultTbl2YearFormula) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("oss_ees_result_tbl2_year_formula.field_name = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewOssEesResultTbl2Store(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "result_title",
		new:      func() models.Entity { return new(models.OssEesResultTbl2) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("oss_ees_result_tbl2.result_title = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewGetResultTbl2Store(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "result_title",
		new:      func() models.Entity { return new(models.GetResultTbl2) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("get_result_tbl2.result_title = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewUserResultStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "user_public_ip",
		new:      func() models.Entity { return new(models.UserResult) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("user_result.user_public_ip = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewOnboardingUserDataStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "oss_admin_id",
		new:      func() models.Entity { return new(models.OnboardingUserData) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("onboarding_user_data.oss_admin_id = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewSupportAPIStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "email",
		new:      func() models.Entity { return new(models.SupportAPI) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("support_api.email = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewUserOtpStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "user_id",
		new:      func() models.Entity { return new(models.UserOtp) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("user_otp.user_id = ?", pattern(f.Search))
			}
			return d
		},
		member: func(d *gorm.DB, u ...uuid.UUID) *gorm.DB { return d },
	}
}

func NewSendMailStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "email",
		new:      func() models.Entity { return new(models.SendMail) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("send_mail.email = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewBookACallStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "email",
		new:      func() models.Entity { return new(models.BookACall) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("book_a_call.email = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewEnergyCertDetails(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "asset_id",
		new:      func() models.Entity { return new(models.EnergyCertDetails) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("engery_cert_details.asset_id = ?", pattern(f.Search))
			}
			return d
		},
		member: func(d *gorm.DB, u ...uuid.UUID) *gorm.DB { return d },
	}
}

func NewEnergyCertCategory(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "asset_id",
		new:      func() models.Entity { return new(models.EnergyCertCategory) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("energy_cert_category.asset_id = ?", pattern(f.Search))
			}
			return d
		},
		member: func(d *gorm.DB, u ...uuid.UUID) *gorm.DB { return d },
	}
}

func NewEnergyCertReduction(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "asset_id",
		new:      func() models.Entity { return new(models.EnergyCertReduction) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("energy_cert_reduction.asset_id = ?", pattern(f.Search))
			}
			return d
		},
		member: func(d *gorm.DB, u ...uuid.UUID) *gorm.DB { return d },
	}
}

func NewEnergyCertFile(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "details_id",
		new:      func() models.Entity { return new(models.EnergyCertFile) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("energy_cert_file.details_id = ?", pattern(f.Search))
			}
			return d
		},
		member: func(d *gorm.DB, u ...uuid.UUID) *gorm.DB { return d },
	}
}

func NewUserInputDataStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "id",
		new:      func() models.Entity { return new(models.UserInputData) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("user_input_data.field_title = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewUserCalculationStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "session",
		new:      func() models.Entity { return new(models.UserResultCalculation) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("user_result_calc_field.session = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewSubscribersStore(db *gorm.DB, v *validator.Validate) store {
	return store{
		db:       db,
		validate: v,
		index:    "email",
		new:      func() models.Entity { return new(models.Subscribers) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("subscribers.email = ?", pattern(f.Search))
			}
			return d
		},
		member: func(d *gorm.DB, u ...uuid.UUID) *gorm.DB { return d },
	}
}

func NewRenovateCalcInputStore(db *gorm.DB, v *validator.Validate) store {
	return store{
		db:       db,
		validate: v,
		index:    "user_id",
		new:      func() models.Entity { return new(models.RenovateCalcInput) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("renovate_calc_input.user_id = ?", pattern(f.Search))
			}
			return d
		},
		member: func(d *gorm.DB, u ...uuid.UUID) *gorm.DB { return d },
	}
}

func NewUserResultBasicStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "user_id",
		new:      func() models.Entity { return new(models.UserBasicDetails) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("user_basic_details.user_id = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewStepBackupFieldOptionStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "backup_time",
		new:      func() models.Entity { return new(models.StepFieldOptionBackup) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("step_field_option_backup.backup_time = ?", pattern(f.Search))
			}
			return d
		},
		member: func(d *gorm.DB, u ...uuid.UUID) *gorm.DB { return d },
	}
}

func NewStepFieldOptionStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "title",
		new:      func() models.Entity { return new(models.StepFieldOption) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("step_field_option.title = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewOnboardingHousingQuestionStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "name",
		new:      func() models.Entity { return new(models.HousingStepQuestion) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("housing_step_question.name = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewOnboardingHousingFieldStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "name",
		new:      func() models.Entity { return new(models.OnboardingHousingStepField) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("onboarding_housing_step_field.name = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewOnboardingHousingStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "name",
		new:      func() models.Entity { return new(models.OnboardingHousingStep) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("onboarding_housing_step.name = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewOnboardingResidentFieldBackupStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "backup_time",
		new:      func() models.Entity { return new(models.OnboardingResidentStepFieldBackup) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("onboarding_residents_step_field_backup.backup_time = ?", pattern(f.Search))
			}
			return q
		},
		member: func(q *gorm.DB, u ...uuid.UUID) *gorm.DB { return q },
		// member: func(q *gorm.DB, ids ...uuid.UUID) *gorm.DB {
		// 	return q.Joins(`left join organization_roles
		// 		on organizations.id = organization_roles.organization_id`).
		// 		Where("organization_roles.user_id IN (?)", ids)
		// },
	}
}

func NewOnboardingResidentFieldStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "name",
		new:      func() models.Entity { return new(models.OnboardingResidentStepField) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("onboarding_residents_step_field.name = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewOnboardingResidentBackupQuestionStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "backup_time",
		new:      func() models.Entity { return new(models.ResidentStepQuestionBackup) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("resident_step_question_backup.backup_time = ?", pattern(f.Search))
			}
			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewReplyMailStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "message",
		new:      func() models.Entity { return new(models.ReplyMail) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("reply_mail.message = ?", pattern(f.Search))
			}
			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewOnboardingResidentQuestionStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "name",
		new:      func() models.Entity { return new(models.ResidentStepQuestion) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("resident_step_question.name = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewOnboardingResidentBackupStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "backup_time",
		new:      func() models.Entity { return new(models.OnboardingResidentStepBackup) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("onboarding_residents_step_backup.backup_time = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewPlaceholderStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "title",
		new:      func() models.Entity { return new(models.PlaceHolder) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("placeholder.title = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewMasterTemplateOptionStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "title",
		new:      func() models.Entity { return new(models.MasterOption) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("master_option.title", pattern(f.Search))
			}
			return d
		},
	}
}

func NewMasterTemplateFieldStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "name",
		new:      func() models.Entity { return new(models.MasterField) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("master_field.name = ?", pattern(f.Search))
			}
			return d
		},
	}
}

func NewMasterTemplateQuestionStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "name",
		new:      func() models.Entity { return new(models.MasterQuestion) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("master_question.name = ?", pattern(f.Search))
			}
			return d
		},
	}
}

func NewMasterTemplateStepStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "name",
		new:      func() models.Entity { return new(models.MasterStep) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("master_step.name = ?", pattern(f.Search))
			}
			return d
		},
	}
}

func NewResultSubObjectBackupStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "backup_title",
		new:      func() models.Entity { return new(models.ResultSubObjectBackup) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("result_sub_object_backup.backup_title = ?", pattern(f.Search))
			}
			return d
		},
	}
}

func NewOssEesTable2Store(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "backup_title",
		new:      func() models.Entity { return new(models.OssEesResultBackup) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("oss_ees_result_backup.backup_title = ?", pattern(f.Search))
			}
			return d
		},
	}
}

func NewStepFieldBackupStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "backup_title",
		new:      func() models.Entity { return new(models.StepFieldBackup) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("step_field_backup.backup_title = ?", pattern(f.Search))
			}
			return d
		},
	}
}

func NewStepsResultBackupStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "backup_title",
		new:      func() models.Entity { return new(models.StepsResultBackup) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("step_result_backup.backup_title = ?", pattern(f.Search))
			}
			return d
		},
	}
}

func NewStepBackupStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "backup_title",
		new:      func() models.Entity { return new(models.StepItemBackup) },
		search: func(d *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				d = d.Where("step_item_backup.backup_title = ?", pattern(f.Search))
			}
			return d
		},
	}
}

func NewOnboardingResidentStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "name",
		new:      func() models.Entity { return new(models.OnboardingResidentStep) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("onboarding_residents_step.name = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewStepsResultStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "id",
		new:      func() models.Entity { return new(models.StepsResult) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("step_result.id = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewUserStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "email",
		new:      func() models.Entity { return new(models.User) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("users.name ILIKE ?", pattern(f.Search)).
					Or("users.email ILIKE ?", pattern(f.Search))

			}

			if f.Status != 0 {
				q = q.Where("users.status = ?", f.Status)
			}

			if f.Country != "" {
				q = q.Where("users.country = ?", f.Country)
			}

			// NOTE (edimov): The `PlatformRoles` query works with OR condition
			// only. Consider implementing operators support in the filter.
			if f.PlatformRoles != nil {
				for _, v := range f.PlatformRoles {
					r := PlatformRole(v)
					if r != PlatformManager && r != AdminNetworkManager {
						continue
					}
					q = q.Or(fmt.Sprintf("users.%s = true", r))
				}
			}

			if f.CountryRoles != nil {
				q = q.Joins("left join country_roles on users.id = country_roles.user_id::UUID").
					Where("country_roles.role in (?)", f.CountryRoles)
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewContractStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "project_id",
		new:      func() models.Entity { return new(contract.Contract) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("contracts.project_id = ?", pattern(f.Search))
			}

			return q
		},
		member: func(q *gorm.DB, _ ...uuid.UUID) *gorm.DB { return q },
	}
}

func NewOrganizationStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "vat",
		new:      func() models.Entity { return new(models.Organization) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("organizations.name ilike ?", pattern(f.Search))
			}

			if f.LegalForm != 0 {
				q = q.Where("organizations.legal_form = ?", f.LegalForm)
			}

			if f.Status != 0 {
				q = q.Where("organizations.status = ?", f.Status)
			}

			if f.Country != "" {
				q = q.Where("organizations.country = ?", f.Country)
			}

			return q
		},
		member: func(q *gorm.DB, ids ...uuid.UUID) *gorm.DB {
			return q.Joins(`left join organization_roles
				on organizations.id = organization_roles.organization_id`).
				Where("organization_roles.user_id IN (?)", ids)
		},
	}
}

func NewAssetStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "coords",
		new:      func() models.Entity { return new(models.Asset) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("assets.address ILIKE ?", pattern(f.Search))
			}

			if f.BuildingType != 0 {
				q = q.Where("assets.building_type = ?", f.BuildingType)
			}

			if f.Status != 0 {
				q = q.Where("assets.status = ?", f.Status)
			}

			if f.Country != "" {
				q = q.Where("assets.country = ?", f.Country)
			}

			if f.Owner != uuid.Nil {
				q = q.Where("assets.owner_id = ?", f.Owner)
			}
			if f.ESCO != uuid.Nil {
				q = q.Where("assets.esco_id = ?", f.ESCO)
			}

			if f.NullFields != nil {
				for _, f := range f.NullFields {
					switch f {
					case "esco":
						q = q.Where("assets.esco_id is null")
					}
				}
			}

			return q
		},
		member: func(q *gorm.DB, ids ...uuid.UUID) *gorm.DB {
			return q.Joins(`left join organizations
				on organizations.id = assets.owner_id::uuid
				or organizations.id = assets.esco_id::uuid`).
				Where("organizations.id IN (?)", ids)
		},
	}
}

func NewProjectStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "name",
		new:      func() models.Entity { return new(models.Project) },
		search: func(q *gorm.DB, f Filter) *gorm.DB {
			if f.Search != "" {
				q = q.Where("projects.name ILIKE ?", pattern(f.Search))
			}

			if f.Status != 0 {
				q = q.Where("projects.status = ?", f.Status)
			}

			if f.Country != "" {
				q = q.Where("projects.country = ?", f.Country)
			}

			if f.Owner != uuid.Nil {
				q = q.Or("projects.owner = ?", f.Owner)
			}

			if f.AssetOwner != uuid.Nil {
				q = q.Or("projects.asset_owner_id = ?", f.AssetOwner)
			}

			if f.ESCO != uuid.Nil {
				q = q.Or("projects.asset_esco_id = ?", f.ESCO)
			}

			if f.RelatedOrganizationID != uuid.Nil {
				q = q.Or("? = ANY(projects.consortium_orgs)", f.RelatedOrganizationID)
			}

			return q
		},
		member: func(q *gorm.DB, ids ...uuid.UUID) *gorm.DB {
			q = q.Joins(`left join project_roles
				on project_roles.project_id = projects.id`).
				Where("project_roles.user_id IN (?)", ids)

			q = q.Joins(`left join organization_roles
				on organization_roles.organization_id = projects.owner
				or organization_roles.organization_id = projects.asset_esco_id
				or organization_roles.organization_id = ANY (projects.consortium_orgs::UUID[])
				or organization_roles.organization_id = projects.asset_owner_id`).
				Or("organization_roles.user_id IN (?)", ids)

			return q
		},
	}
}

func NewIndoorClimaStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "project_id",
		new:      func() models.Entity { return new(contract.IndoorClima) },
		search:   func(db *gorm.DB, s Filter) *gorm.DB { return db },
		member:   func(db *gorm.DB, ids ...uuid.UUID) *gorm.DB { return db },
	}
}

func NewMeetingsStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "id",
		new:      func() models.Entity { return new(models.Meeting) },
		search:   func(db *gorm.DB, f Filter) *gorm.DB { return db },
		member: func(db *gorm.DB, ids ...uuid.UUID) *gorm.DB {
			if ids[0] != uuid.Nil {
				db = db.Where("host = ?", ids).
					Or("project = ?", ids)
			}

			return db
		},
	}
}

func NewGDPRStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "id",
		new:      func() models.Entity { return new(models.GDPRRequest) },
		search:   func(db *gorm.DB, f Filter) *gorm.DB { return db },
		member: func(db *gorm.DB, ids ...uuid.UUID) *gorm.DB {
			if ids[0] != uuid.Nil {
				db = db.Where("id = ?", ids)
			}

			return db
		},
	}
}
func NewForfaitingApplicationStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "id",
		new:      func() models.Entity { return new(models.ForfaitingApplication) },
		search:   func(q *gorm.DB, f Filter) *gorm.DB { return q },
		member: func(q *gorm.DB, ids ...uuid.UUID) *gorm.DB {
			return q.Joins(`left join projects
				on projects.id = forfaiting_applications.project_id`).
				Where("projects.id IN (?)", ids).
				Where("projects.deleted_at IS NULL")
		},
	}
}

func NewForfaitingPaymentStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "id",
		new:      func() models.Entity { return new(models.ForfaitingPayment) },
		search:   func(q *gorm.DB, f Filter) *gorm.DB { return q },
		member: func(q *gorm.DB, ids ...uuid.UUID) *gorm.DB {
			return q.Joins(`left join projects
				on projects.id = forfaiting_payments.project_id`).
				Where("projects.id IN (?)", ids).
				Where("projects.deleted_at IS NULL")
		},
	}
}

func NewWorkPhaseStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "id",
		new:      func() models.Entity { return new(models.WorkPhase) },
		search:   func(q *gorm.DB, f Filter) *gorm.DB { return q },
		member: func(q *gorm.DB, ids ...uuid.UUID) *gorm.DB {
			return q.Joins(`left join projects
				on projects.id = work_phase.project`).
				Where("projects.id IN (?)", ids).
				Where("projects.deleted_at IS NULL")
		},
	}
}

func NewMonitoringPhaseStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "id",
		new:      func() models.Entity { return new(models.MonitoringPhase) },
		search:   func(q *gorm.DB, f Filter) *gorm.DB { return q },
		member: func(q *gorm.DB, ids ...uuid.UUID) *gorm.DB {
			return q.Joins(`left join projects
				on projects.id = monitoring_phase.project`).
				Where("projects.id IN (?)", ids).
				Where("projects.deleted_at IS NULL")
		},
	}
}

func NewCountryStore(db *gorm.DB, v *validator.Validate) Store {
	return store{
		db:       db,
		validate: v,
		index:    "country",
		new:      func() models.Entity { return new(models.CountryVat) },
		search:   func(db *gorm.DB, s Filter) *gorm.DB { return db },
		member:   func(db *gorm.DB, ids ...uuid.UUID) *gorm.DB { return db },
	}
}
