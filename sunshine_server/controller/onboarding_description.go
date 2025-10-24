package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/url"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
	"github.com/google/uuid"
)

type OnboardingDescription struct {
	st stores.Store
}

func NewOnboardingDescription(env *services.Env) *OnboardingDescription {
	return &OnboardingDescription{
		st: env.OnboardingDescriptionStore,
	}
}

func (od *OnboardingDescription) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	var (
		onboardingDesc models.OnboardingDescription
	)
	if err := json.NewDecoder(rc).Decode(&onboardingDesc); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if err := od.DeleteExistingDesc(ctx, onboardingDesc); err != nil {
		return nil, err
	}
	doc, err := od.st.Create(ctx, sanitizeEntityFields(&onboardingDesc))
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func (od *OnboardingDescription) DeleteExistingDesc(ctx context.Context, onboardingDesc models.OnboardingDescription) error {
	var (
		description models.OnboardingDescription
	)
	return od.st.DB().Unscoped().Where("is_default_template = ?", onboardingDesc.IsDefaultTemplate).Where("oss_admin_id = ?", onboardingDesc.OssAdminID).Where("lang = ?", onboardingDesc.Lang).Where("menu_type = ?", onboardingDesc.MenuType).Delete(&description).Error
}

func (od *OnboardingDescription) List(ctx context.Context, query url.Values) ([]models.OnboardingDescription, error) {
	var (
		descriptions []models.OnboardingDescription
	)
	oss_admin_id := query.Get("oss_admin_id")
	lang := query.Get("lang")
	menu_type := query.Get("menu_type")
	is_def_temp := query.Get("is_default_template")

	if err := od.st.DB().
		Where("oss_admin_id = ?", oss_admin_id).
		Where("lang = ?", lang).
		Where("menu_type = ?", menu_type).
		Where("is_default_template = ?", is_def_temp).
		Find(&descriptions).Error; err != nil {
		return nil, err
	}
	return descriptions, nil
}

func (od *OnboardingDescription) ListDefaults(allLangs bool, menuType, lang string) ([]models.OnboardingDescription, error) {
	var descriptions []models.OnboardingDescription
	if allLangs {
		if err := od.st.DB().Order("created_at ASC").Where("is_default_template = '1'").Where("menu_type = ?", menuType).Find(&descriptions).Error; err != nil {
			return nil, err
		}
		return descriptions, nil
	}
	if err := od.st.DB().Order("created_at ASC").Where("is_default_template = '1'").Where("menu_type = ?", menuType).Where("lang = ?", lang).Find(&descriptions).Error; err != nil {
		return nil, err
	}
	return descriptions, nil
}

func (od *OnboardingDescription) DeleteDescription(ctx context.Context, uid uuid.UUID) error {
	doc, err := od.st.Get(ctx, uid)
	if err != nil {
		return err
	}

	return od.st.Delete(ctx, doc)
}
