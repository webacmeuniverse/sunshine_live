package controller

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/url"
	"strconv"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
	"github.com/google/uuid"
)

type OrganizationRating struct {
	st stores.Store
}

func NewOrganizationRating(env *services.Env) *OrganizationRating {
	return &OrganizationRating{
		st: env.OrganizationRatingStore,
	}
}

func (or *OrganizationRating) Create(ctx context.Context, rc io.ReadCloser) (*models.Document, error) {
	var (
		orgRating models.OrganizationRating
	)
	if err := json.NewDecoder(rc).Decode(&orgRating); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrBadInput, err)
	}
	if err := or.DeleteExistingRating(ctx, orgRating); err != nil {
		return nil, err
	}
	doc, err := or.st.Create(ctx, sanitizeEntityFields(&orgRating))
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func (or *OrganizationRating) Get(ctx context.Context, query url.Values) (*OperatorResponse, error) {
	var (
		ratings []models.OrganizationRating
	)
	id := query.Get("id")

	if err := or.st.DB().Where("organization_id = ?", id).Find(&ratings).Error; err != nil {
		return nil, err
	}
	return or.CalcRating(ctx, ratings)
}

func (or *OrganizationRating) CalcRating(ctx context.Context, results []models.OrganizationRating) (*OperatorResponse, error) {
	var (
		length   float64 = float64(len(results))
		response OperatorResponse
	)
	for _, res := range results {
		response.Quality += res.Quality             // or.GetValue(res.Quality)
		response.Speed += res.Speed                 // or.GetValue(res.Speed)
		response.Communication += res.Communication // or.GetValue(res.Communication)
		response.TotalScore += func(res models.OrganizationRating) float64 {
			_res, _ := strconv.ParseFloat(fmt.Sprintf("%.1f", (0.33*float64(res.Quality)+0.33*float64(res.Speed)+0.33*float64(res.Communication))), 64)
			return _res
		}(res)
	}
	result := OperatorResponse{
		Quality:       or.GetValue(response.Quality, length),
		Speed:         or.GetValue(response.Speed, length),
		Communication: or.GetValue(response.Communication, length),
		TotalScore:    response.TotalScore,
	}
	return &result, nil
}

func (or *OrganizationRating) GetValue(d, n float64) float64 {
	res, _ := strconv.ParseFloat(fmt.Sprintf("%.1f", d/n), 64)
	return res
}

func (or *OrganizationRating) DeleteExistingRating(ctx context.Context, orRating models.OrganizationRating) error {
	var (
		rating models.OrganizationRating
	)

	if err := or.st.DB().Where("user_id = ?", orRating.UserID).Where("organization_id = ?", orRating.OrganizationID).First(&rating).Error; err != nil && err.Error() != "record not found" {
		return errors.New(fmt.Sprintf("Rating not found: %s", err.Error()))
	}
	return or.st.DB().Unscoped().Delete(&rating).Error
}

func (or *OrganizationRating) DeleteOrgRating(ctx context.Context, uid uuid.UUID) error {
	doc, err := or.st.Get(ctx, uid)
	if err != nil {
		return err
	}

	return or.st.Delete(ctx, doc)
}
