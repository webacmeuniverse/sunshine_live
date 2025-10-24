-- +goose Up
ALTER TABLE users ADD COLUMN is_oss_admin BOOLEAN NOT NULL DEFAULT FALSE;
UPDATE users SET is_oss_admin = TRUE;

-- +goose Down
ALTER TABLE users DROP COLUMN is_oss_admin;
