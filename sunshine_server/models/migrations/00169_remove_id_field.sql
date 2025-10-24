-- +goose Up
ALTER TABLE onboarding_residents_step_backup DROP COLUMN step_id;
ALTER TABLE resident_step_question_backup DROP COLUMN question_id;
ALTER TABLE onboarding_residents_step_field_backup DROP COLUMN field_id;
ALTER TABLE step_field_option_backup DROP COLUMN option_id;

-- +goose Down
ALTER TABLE onboarding_residents_step_backup ADD COLUMN step_id;
ALTER TABLE resident_step_question_backup ADD COLUMN question_id;
ALTER TABLE onboarding_residents_step_field_backup ADD COLUMN field_id;
ALTER TABLE step_field_option_backup ADD COLUMN option_id;
