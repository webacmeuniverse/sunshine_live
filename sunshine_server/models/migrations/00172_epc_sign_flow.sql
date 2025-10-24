-- +goose Up
ALTER TABLE projects ADD COLUMN epc_signed BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE projects ADD COLUMN fa_signed BOOLEAN NOT NULL DEFAULT FALSE;

-- +goose Down
ALTER TABLE projects DROP COLUMN epc_signed;
ALTER TABLE projects DROP COLUMN fa_signed;
