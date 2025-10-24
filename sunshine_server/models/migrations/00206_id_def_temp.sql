-- +goose Up
ALTER TABLE field ADD COLUMN is_default_template_id TEXT;

-- +goose Down
ALTER TABLE field DROP COLUMN is_default_template_id;

