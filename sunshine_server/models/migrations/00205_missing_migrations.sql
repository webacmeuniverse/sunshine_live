-- +goose Up
ALTER TABLE user_basic_details ADD COLUMN table_type VARCHAR;
ALTER TABLE user_basic_details ADD COLUMN is_default_template VARCHAR;

ALTER TABLE get_result_tbl2 ADD COLUMN oss_admin_id VARCHAR;
ALTER TABLE get_result_tbl2 ADD COLUMN table_type VARCHAR;

-- +goose Down
ALTER TABLE user_basic_details DROP COLUMN table_type;
ALTER TABLE user_basic_details DROP COLUMN is_default_template;

ALTER TABLE get_result_tbl2 DROP COLUMN oss_admin_id;
ALTER TABLE get_result_tble DROP COLUMN table_type;
