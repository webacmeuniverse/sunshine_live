-- +goose Up
ALTER TABLE users ADD COLUMN cell_phone_no CHARACTER VARYING(255);

-- +goose Down
ALTER TABLE users DROP COLUMN cell_phone_no;