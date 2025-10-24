-- +goose Up
CREATE TABLE oss_ees_result_tbl2 (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
	result_title CHARACTER VARYING(255) NOT NULL,
	oss_admin_id CHARACTER VARYING(255)NOT NULL,
	lang CHARACTER VARYING(255) NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

-- +goose Down
DROP TABLE oss_ees_result_tbl2;


