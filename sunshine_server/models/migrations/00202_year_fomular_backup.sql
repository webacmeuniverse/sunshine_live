-- +goose Up
CREATE TABLE oss_ees_result_yf_backup (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),

    backup_time CHARACTER VARYING(255) NOT NULL,
    backup_title CHARACTER VARYING(255) NOT NULL,
    result_id UUID NOT NULL,
    field_id CHARACTER VARYING(255) NOT NULL,
    field_name CHARACTER VARYING(255) NOT NULL,
    lang CHARACTER VARYING(255) NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

-- +goose Down
DROP TABLE oss_ees_result_yf_backup;
