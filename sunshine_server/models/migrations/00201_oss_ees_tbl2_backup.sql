-- +goose Up
CREATE TABLE oss_ees_result_backup (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    
    backup_time CHARACTER VARYING(255) NOT NULL,
    backup_title CHARACTER VARYING(255) NOT NULL,
    result_title CHARACTER VARYING(255) NOT NULL,
    oss_admin_id CHARACTER VARYING(255) NOT NULL,
    lang CHARACTER VARYING(255) NOT NULL,
    table_type CHARACTER VARYING(255) NOT NULL,
    is_default_template INTEGER NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

-- +goose Down
DROP TABLE oss_ees_result_backup;
