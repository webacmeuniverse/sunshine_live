-- +goose Up
ALTER TABLE onboarding_residents_step_field ALTER COLUMN name SET DATA TYPE TEXT USING name::TEXT;

-- +goose Down
ALTER TABLE onboarding_residents_step_field ALTER COLUMN name SET DATA TYPE CHARACTER VARYING(255);

