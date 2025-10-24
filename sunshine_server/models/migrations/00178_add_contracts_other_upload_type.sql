-- +goose Up
-- +goose NO TRANSACTION

ALTER TYPE upload_type ADD VALUE IF NOT EXISTS 'contracts other';

-- +goose Down
SELECT 1;
