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
	"github.com/jinzhu/gorm"
)

type UserResultBasic struct {
	st      stores.Store
	cs      stores.Store
	country models.Country
}

func NewUserResultBasic(env *services.Env) *UserResultBasic {
	return &UserResultBasic{
		st:      env.UserResultBasicStore,
		cs:      env.UserCalculationStore,
		country: "Latvia",
	}
}

func (urb *UserResultBasic) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, ErrUnauthorized
	}
	var (
		userResultBasic models.UserBasicDetails
		_userResBasic   models.UserBasicDetails
	)

	if err := json.NewDecoder(rc).Decode(&userResultBasic); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if !Can(ctx, CreateUserResultBasic, uuid.Nil, cv.User.Country) {
		return nil, ErrUnauthorized
	}
	var userResultCalculation []models.UserResultCalculation

	if err := urb.st.DB().
		Where("user_public_ip = ?", userResultBasic.UserPublicIP).
		Where("session = ?", userResultBasic.Session).
		Where("oss_admin_id = ?", userResultBasic.OssAdminID).
		Where("country = ?", userResultBasic.Country).
		Where("user_id = ?", userResultBasic.UserID).
		Where("lang = ?", userResultBasic.Lang).
		Where("is_default_template = ?", userResultBasic.IsDefaultTemplate).
		Where("table_type = ?", userResultBasic.TableType).First(&_userResBasic).Error; err != nil && err.Error() != "record not found" {
		return nil, err
	}
	if _userResBasic.ID.String() != "00000000-0000-0000-0000-000000000000" {
		if err := urb.st.DB().Unscoped().Delete(&_userResBasic).Error; err != nil {
			return nil, err
		}
	}

	doc, err := urb.st.Create(ctx, sanitizeEntityFields(&userResultBasic))
	if err != nil {
		return nil, err
	}
	doc.Data.(*models.UserBasicDetails).CalculationInput = userResultCalculation
	return doc, nil

}

func (urb *UserResultBasic) Get(ctx context.Context, urbID uuid.UUID) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	_, err := urb.st.Get(ctx, urbID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, GetUserResultBasic, urbID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	return urb.st.Unwrap(ctx, urbID)
}

func (urb *UserResultBasic) Update(ctx context.Context, urbID uuid.UUID, r io.Reader) (*models.Document, stores.Dependencies, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return nil, nil, ErrUnauthorized
	}
	doc, err := urb.st.Get(ctx, urbID)
	if err != nil {
		return nil, nil, ErrNotFound
	}
	if !Can(ctx, UpdateUserResultBasic, urbID, cv.User.Country) {
		return nil, nil, ErrUnauthorized
	}
	new := *doc.Data.(*models.UserBasicDetails)
	if err = json.NewDecoder(r).Decode(&new); err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}

	doc.Data = &new

	_, err = urb.st.Update(ctx, sanitizeInputFields(doc))
	if err != nil {
		return nil, nil, err
	}

	result, deps, err := urb.st.Unwrap(ctx, urbID)

	return result, deps, err
}

func (urb *UserResultBasic) List(ctx context.Context, filter stores.Filter) ([]models.Document, stores.Dependencies, int, error) {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, ListUserResultBasic, uuid.Nil, cv.User.Country) {
		return nil, nil, 0, ErrUnauthorized
	}
	docs, deps, n, err := urb.st.List(ctx, filter)

	return docs, deps, n, err
}

func (urb *UserResultBasic) NextIndex(ctx context.Context, filter stores.Filter) (*int, error) {
	docs, _, _, err := urb.List(ctx, filter)
	if err != nil {
		return nil, err
	}
	result := len(docs) + 1
	return &result, nil
}

func (urb *UserResultBasic) DeleteUserResult(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() {
		return ErrUnauthorized
	}
	doc, err := urb.st.Get(ctx, uid)
	if err != nil {
		return err
	}
	if !Can(ctx, DeleteUserResultBasic, uid, cv.User.Country) {
		return ErrUnauthorized
	}
	calcs, _ := urb.ResultCalculationList(urb.st.DB(), doc.Data.(*models.UserBasicDetails).Session)
	for _, calc := range calcs {
		doc := models.Document{
			ID:        calc.ID,
			Kind:      calc.Kind(),
			Data:      calc,
			Timestamp: calc.UpdatedAt,
		}
		urb.st.Delete(ctx, &doc)
	}

	return urb.st.Delete(ctx, doc)
}

func (urb *UserResultBasic) DeleteUserCalculation(ctx context.Context, uid uuid.UUID) error {
	cv := services.FromContext(ctx)
	if !cv.Authorized() || !Can(ctx, DeleteUserResultBasic, uid, cv.User.Country) {
		return ErrUnauthorized
	}
	doc, err := urb.cs.Get(ctx, uid)
	if err != nil {
		return err
	}

	return urb.st.Delete(ctx, doc)

}

func (urb *UserResultBasic) ResultCalculationList(db *gorm.DB, session string) ([]models.UserResultCalculation, error) {

	var userResultBasiclist []models.UserResultCalculation
	if err := urb.st.DB().Where("session = ?", session).Find(&userResultBasiclist).Error; err != nil {
		return nil, err
	}
	return userResultBasiclist, nil
}

func (urb *UserResultBasic) AddResultCalaculation(ctx context.Context, rc io.ReadCloser, session string, basicDetsID uuid.UUID) (*models.UserResultCalculation, error) {
	var (
		resultCalculation  models.UserResultCalculation
		_resultCalculation models.UserResultCalculation
	)
	if err := json.NewDecoder(rc).Decode(&resultCalculation); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if err := urb.st.DB().Where("ees_field_id = ?", resultCalculation.EesFieldID).Where("session = ?", session).First(&_resultCalculation).Error; err != nil {
		if err.Error() == "record not found" {
			resultCalculation.UserBasicDetailsID = basicDetsID
			doc, err := urb.st.Create(ctx, sanitizeEntityFields(&resultCalculation))
			if err != nil {
				return nil, err
			}
			res := doc.Data.(*models.UserResultCalculation)
			return res, nil
		}
		return nil, err
	}
	_resultCalculation.EesFieldValue = resultCalculation.EesFieldValue
	_resultCalculation.Lang = resultCalculation.Lang
	_resultCalculation.UserBasicDetailsID = basicDetsID
	if err := urb.st.DB().Save(&_resultCalculation).Error; err != nil {
		return nil, err
	}
	return &_resultCalculation, nil
}

func (urb *UserResultBasic) FetchUserResultItems(ctx context.Context, ids []uuid.UUID) ([]models.UserBasicDetails, error) {
	var result []models.UserBasicDetails
	return result, urb.st.DB().
		Where("id IN (?)", ids).
		Order("created_at DESC").Find(&result).Error
}
