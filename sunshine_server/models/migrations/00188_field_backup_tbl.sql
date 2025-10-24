-- +goose Up
CREATE TABLE field_backup (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    backup_time CHARACTER VARYING(255) NOT NULL,
    backup_title CHARACTER VARYING(255) NOT NULL,
	index NUMERIC,
	step_id UUID NOT NULL,
	name CHARACTER VARYING(255) NOT NULL,
	placeholder CHARACTER VARYING(255),
	text_number CHARACTER VARYING(255),
	require BOOLEAN DEFAULT false,
	lang CHARACTER VARYING(255) NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

-- +goose Down
DROP TABLE field_backup;
