-- +goose Up
CREATE TABLE resident_step_question_backup (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    backup_time CHARACTER VARYING(255) NOT NULL,
	question_id UUID NOT NULL,
	menu_type CHARACTER VARYING(127) NOT NULL,
	step_id UUID NOT NULL,
	index INTEGER NOT NULL,
	name CHARACTER VARYING(255)NOT NULL,
	default_score REAL NOT NULL,
	lang CHARACTER VARYING(255) NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);


-- +goose Down
DROP TABLE resident_step_question_backup;


