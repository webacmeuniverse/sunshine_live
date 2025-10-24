-- +goose Up
ALTER TABLE energy_cert_reduction ALTER COLUMN reduction TYPE REAL;
ALTER TABLE energy_cert_reduction ALTER COLUMN cost_eur_m2 TYPE REAL;

-- +goose Down
ALTER TABLE energy_cert_reduction ALTER COLUMN reduction TYPE INTEGER;
ALTER TABLE energy_cert_reduction ALTER COLUMN cost_eur_m2 TYPE INTEGER;