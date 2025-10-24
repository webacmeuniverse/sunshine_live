-- +goose Up
-- +goose NO TRANSACTION

ALTER TYPE upload_type ADD VALUE IF NOT EXISTS 'fa contracts';

-- +goose Down
SELECT 1;
