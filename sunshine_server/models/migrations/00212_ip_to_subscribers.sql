-- +goose Up
ALTER TABLE subscribers ADD COLUMN public_ip CHARACTER VARYING(255);

-- +goose Down
ALTER TABLE subscribers DROP COLUMN public_ip;

