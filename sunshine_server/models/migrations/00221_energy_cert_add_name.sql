-- +goose Up
ALTER TABLE energy_cert_file ADD COLUMN file_name CHARACTER VARYING(255);

-- +goose Down
ALTER TABLE energy_cert_file DROP COLUMN file_name;

