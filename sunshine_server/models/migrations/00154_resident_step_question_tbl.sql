-- +goose Up
CREATE TABLE resident_step_question (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
	step_id UUID NOT NULL,
	index INTEGER NOT NULL,
	name CHARACTER VARYING(2048)NOT NULL,
	default_score REAL NOT NULL,
	lang CHARACTER VARYING(255) NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);


-- +goose Down
DROP TABLE resident_step_question;


