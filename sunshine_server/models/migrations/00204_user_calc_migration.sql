-- +goose Up
ALTER TABLE user_result_calc_field ADD COLUMN user_basic_details_id CHARACTER VARYING(255);
ALTER TABLE user_result_calc_field ADD COLUMN ees_field_title TEXT;

-- +goose Down
ALTER TABLE user_result_calc_field DROP COLUMN user_basic_details_id;
ALTER TABLE user_result_calc_field DROP COLUMN ees_field_title;


