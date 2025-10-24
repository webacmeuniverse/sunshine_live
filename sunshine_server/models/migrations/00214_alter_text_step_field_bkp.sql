-- +goose Up
ALTER TABLE onboarding_residents_step_field_backup ALTER COLUMN name TYPE TEXT;

-- +goose Down
ALTER TABLE onboarding_residents_step_field_backup ALTER COLUMN name TYPE CHARACTER VARYING(255);