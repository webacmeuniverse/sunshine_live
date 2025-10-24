package controller

import (
	"context"
	"net/url"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
	"github.com/google/uuid"
)

type OssEesUserRecord struct {
	st      stores.Store
	country models.Country
}

func NewOssEesUserRecord(env *services.Env) *OssEesUserRecord {
	return &OssEesUserRecord{
		st:      env.UserInputDataStore,
		country: "Latvia",
	}
}

func (oeur *OssEesUserRecord) List(ctx context.Context, filter stores.Filter, query url.Values) ([]models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		userBasic models.UserBasicDetails
		steps     []models.OnboardingResidentStep
		docs      []models.Document
	)
	OssAdminID := query.Get("oss_admin_id")
	if !Can(ctx, ListOssEesUserRecord, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	if err := oeur.st.DB().
		Where("selected_oss = ?", OssAdminID).
		Order("created_at ASC").
		First(&userBasic).
		Error; err != nil {
		println("Error fetching:", err.Error())
		return nil, err
	}
	if err := oeur.st.DB().Where("oss_admin_id = ?", userBasic.OssAdminID).Order("created_at ASC").Find(&steps).Error; err != nil {
		return nil, err
	}
	for _, step := range steps {
		var (
			user       models.User
			userResult models.OssEesResultBasic
			questions  []models.ResidentStepQuestion
		)
		if err := oeur.st.DB().Where("step_id = ?", step.ID).Order("created_at ASC").Find(&questions).Error; err != nil {
			return nil, err
		}
		for _, quiz := range questions {
			var fields []models.OnboardingResidentStepField
			if err := oeur.st.DB().Where("question_id = ?", quiz.ID).Order("created_at ASC").Find(&fields).Error; err != nil {
				return nil, err
			}
			for _, field := range fields {
				var options []models.StepFieldOption
				if err := oeur.st.DB().Where("step_field_id = ?", field.ID).Find(&options).Order("created_at ASC").Error; err != nil {
					return nil, err
				}
				userResult.Fields = append(userResult.Fields, options...)
			}
		}
		if err := oeur.st.DB().Where("id = ?", userBasic.UserID).First(&user).Error; err != nil {
			return nil, err
		}
		userResult.Email = user.Email
		userResult.Name = user.Name
		userResult.Surname = user.Email
		userResult.Email = user.Email
		userResult.Country = user.Country.String()
		userResult.City = user.Address

		doc := models.Document{
			ID:        userResult.ID,
			Kind:      userResult.Kind(),
			Data:      userResult,
			Timestamp: userResult.UpdatedAt,
		}
		docs = append(docs, doc)
	}
	return docs, nil
}
