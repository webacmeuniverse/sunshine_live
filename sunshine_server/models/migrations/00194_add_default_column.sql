-- +goose Up
ALTER TABLE step ADD COLUMN is_default_template INTEGER;
ALTER TABLE field ADD COLUMN is_default_template INTEGER;
ALTER TABLE steps_result ADD COLUMN is_default_template INTEGER;
ALTER TABLE user_result ADD COLUMN is_default_template INTEGER;
ALTER TABLE result_sub_object ADD COLUMN is_default_template INTEGER;

-- +goose Down
ALTER TABLE step DROP COLUMN is_default_template;
ALTER TABLE field DROP COLUMN is_default_template;
ALTER TABLE steps_result DROP COLUMN is_default_template;
ALTER TABLE user_result DROP COLUMN is_default_template;
ALTER TABLE result_sub_object DROP COLUMN is_default_template;
