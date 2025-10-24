-- +goose Up
ALTER TABLE onboarding_residents_step_backup ADD COLUMN backup_title CHARACTER VARYING(255);
ALTER TABLE resident_step_question_backup ADD COLUMN backup_title CHARACTER VARYING(255);
ALTER TABLE onboarding_residents_step_field_backup ADD COLUMN backup_title CHARACTER VARYING(255);
ALTER TABLE step_field_option_backup ADD COLUMN backup_title CHARACTER VARYING(255);

-- +goose Down
ALTER TABLE onboarding_residents_step_backup DROP COLUMN backup_title;
ALTER TABLE resident_step_question_backup DROP COLUMN backup_title;
ALTER TABLE onboarding_residents_step_field_backup DROP COLUMN backup_title;
ALTER TABLE step_field_option_backup DROP COLUMN backup_title;