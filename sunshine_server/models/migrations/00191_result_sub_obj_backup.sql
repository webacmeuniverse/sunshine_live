-- +goose Up
CREATE TABLE result_sub_object_backup (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    backup_time CHARACTER VARYING(255) NOT NULL,
	result_id CHARACTER VARYING(255) NOT NULL,
	cost_type CHARACTER VARYING(255) NOT NULL,
    backup_title CHARACTER VARYING(255) NOT NULL,
	field_id CHARACTER VARYING(255) NOT NULL,
	field_name CHARACTER VARYING(255) NOT NULL,
	index INTEGER NOT NULL,
	lang CHARACTER VARYING(255) NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

-- +goose Down
DROP TABLE result_sub_object_backup;
