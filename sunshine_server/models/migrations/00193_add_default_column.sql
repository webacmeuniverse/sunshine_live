-- +goose Up
ALTER TABLE onboarding_residents_step ADD COLUMN is_default_template INTEGER;
ALTER TABLE step_field_option ADD COLUMN is_default_template INTEGER;
ALTER TABLE resident_step_question ADD COLUMN is_default_template INTEGER;
ALTER TABLE onboarding_residents_step_field ADD COLUMN is_default_template INTEGER;

-- +goose Down
ALTER TABLE onboarding_residents_step DROP COLUMN is_default_template;
ALTER TABLE step_field_option DROP COLUMN is_default_template;
ALTER TABLE resident_step_question DROP COLUMN is_default_template;
ALTER TABLE onboarding_residents_step_field DROP COLUMN is_default_template;
