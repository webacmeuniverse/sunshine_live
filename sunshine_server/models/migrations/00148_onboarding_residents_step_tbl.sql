-- +goose Up
CREATE TABLE onboarding_residents_step (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    index INTEGER NOT NULL,
	name CHARACTER VARYING(255)NOT NULL,
	require BOOLEAN DEFAULT false,
	menu_type CHARACTER VARYING(255) NOT NULL,
	oss_admin_id CHARACTER VARYING(255) NOT NULL,
	default_score REAL NOT NULL,
	lang CHARACTER VARYING(255) NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

-- +goose Down
DROP TABLE onboarding_residents_step;


