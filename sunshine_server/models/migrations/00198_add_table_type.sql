-- +goose Up
ALTER TABLE oss_ees_result_tbl2 ADD COLUMN table_type CHARACTER VARYING(255);

-- +goose Down
ALTER TABLE oss_ees_result_tbl2 DROP COLUMN table_type;
