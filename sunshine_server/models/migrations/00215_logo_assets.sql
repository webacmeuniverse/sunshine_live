-- +goose Up
ALTER TABLE assets ADD COLUMN logo CHARACTER VARYING(255);

-- +goose Down
ALTER TABLE assets DROP COLUMN logo;

