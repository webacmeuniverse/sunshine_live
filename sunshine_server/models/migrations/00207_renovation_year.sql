-- +goose Up
ALTER TABLE user_basic_details ADD COLUMN before_renovation_year INTEGER;
ALTER TABLE user_basic_details ADD COLUMN after_renovation_year INTEGER;

-- +goose Down
ALTER TABLE user_basic_details DROP COLUMN before_renovation_year;
ALTER TABLE user_basic_details DROP COLUMN after_renovation_year;

