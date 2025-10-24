-- +goose Up
ALTER TABLE oss_ees_result_tbl2_year_formula ADD COLUMN index INTEGER;

-- +goose Down
ALTER TABLE oss_ees_result_tbl2_year_formula DROP COLUMN index;

