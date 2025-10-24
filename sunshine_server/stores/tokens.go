package stores

import (
	"context"

	"acme.universe/sunshine/sunshine/models"

	"github.com/google/uuid"
)

// TokenStore takes care for managing tokens.
type TokenStore interface {
	// Create new token with id for purpose.
	Create(ctx context.Context, purpose models.TokenPurpose, id uuid.UUID) (*models.Token, error)

	// Get token with id and purpose.
	Get(ctx context.Context, purpose models.TokenPurpose, id uuid.UUID) (*models.Token, error)

	// Invalidate token with id for purpose.
	Invalidate(ctx context.Context, purpose models.TokenPurpose, id uuid.UUID) error
}
