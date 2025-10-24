-- +goose Up
ALTER TABLE get_result_tbl1 ADD COLUMN table_type CHARACTER VARYING(255);
ALTER TABLE user_result ADD COLUMN table_type CHARACTER VARYING(255);
ALTER TABLE steps_result ADD COLUMN table_type CHARACTER VARYING(255);
ALTER TABLE user_result_calc_field ADD COLUMN table_type CHARACTER VARYING(255);

-- +goose Down
ALTER TABLE get_result_tbl1 DROP COLUMN table_type;
ALTER TABLE user_result DROP COLUMN table_type;
ALTER TABLE steps_result DROP COLUMN table_type;
ALTER TABLE user_result_calc_field DROP COLUMN table_type;
