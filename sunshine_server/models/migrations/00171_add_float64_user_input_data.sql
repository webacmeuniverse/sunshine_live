-- +goose Up
ALTER TABLE user_input_data ALTER COLUMN default_score SET DATA TYPE REAL USING default_score::REAL;
ALTER TABLE user_input_data ALTER COLUMN step_default_score SET DATA TYPE REAL USING step_default_score::REAL;
ALTER TABLE user_input_data ALTER COLUMN question_default_score SET DATA TYPE REAL USING question_default_score::REAL;
ALTER TABLE user_input_data ALTER COLUMN field_default_score SET DATA TYPE REAL USING field_default_score::REAL;

-- +goose Down
ALTER TABLE user_input_data ALTER COLUMN default_score SET DATA TYPE INTEGER;
ALTER TABLE user_input_data ALTER COLUMN step_default_score SET DATA TYPE INTEGER;
ALTER TABLE user_input_data ALTER COLUMN question_default_score SET DATA TYPE INTEGER;
ALTER TABLE user_input_data ALTER COLUMN field_default_score SET DATA TYPE INTEGER;

