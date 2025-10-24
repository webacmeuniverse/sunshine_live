-- +goose Up
CREATE TABLE housing_step_question (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
	step_id UUID NOT NULL,
	index INTEGER NOT NULL,
	name CHARACTER VARYING(255)NOT NULL,
	lang CHARACTER VARYING(255) NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);


-- +goose Down
DROP TABLE housing_step_question;


