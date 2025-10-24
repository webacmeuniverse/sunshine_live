-- +goose Up
ALTER TABLE oss_ees_result_tbl2 ADD COLUMN is_default_template INTEGER;

-- +goose Down
ALTER TABLE oss_ees_result_tbl2 DROP COLUMN is_default_template;
