-- +goose Up
CREATE TABLE onboarding_residents_step_field (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    index INTEGER NOT NULL,
	question_id CHARACTER VARYING(255) NOT NULL,
	name CHARACTER VARYING(255)NOT NULL,
	placeholder CHARACTER VARYING(255)NOT NULL,
	input_type CHARACTER VARYING(255)NOT NULL,
	require BOOLEAN DEFAULT false,
	default_score REAL NOT NULL,
	lang CHARACTER VARYING(255) NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

-- +goose Down
DROP TABLE onboarding_residents_step_field;


