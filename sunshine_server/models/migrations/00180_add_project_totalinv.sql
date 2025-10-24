-- +goose Up
ALTER TABLE projects ADD COLUMN total_investment DOUBLE PRECISION;

ALTER TABLE projects ADD COLUMN energy_savings DOUBLE PRECISION;

-- +goose Down
ALTER TABLE projects DROP COLUMN total_investment;

ALTER TABLE projects DROP COLUMN energy_savings;
