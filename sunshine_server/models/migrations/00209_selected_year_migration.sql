-- +goose Up
ALTER TABLE user_basic_details ADD COLUMN selected_year INTEGER;

-- +goose Down
ALTER TABLE user_basic_details DROP COLUMN selected_year;

