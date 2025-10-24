-- +goose Up
ALTER TABLE energy_cert_details ALTER COLUMN consumption TYPE REAL;
ALTER TABLE energy_cert_category ALTER COLUMN consumption TYPE REAL;

-- +goose Down
ALTER TABLE energy_cert_details ALTER COLUMN consumption TYPE INTEGER;
ALTER TABLE energy_cert_category ALTER COLUMN consumption TYPE INTEGER;