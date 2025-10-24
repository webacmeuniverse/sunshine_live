-- +goose Up
-- +goose NO TRANSACTION
ALTER TYPE user_action ADD VALUE IF NOT EXISTS 'assign_residency';

-- +goose Down
-- +goose NO TRANSACTION
SELECT 1;

