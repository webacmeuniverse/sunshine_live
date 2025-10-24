-- +goose Up
-- +goose NO TRANSACTION
alter table country_roles 
  ALTER COLUMN country TYPE country using country::country;

-- +goose Down
-- +goose NO TRANSACTION
SELECT 1;

