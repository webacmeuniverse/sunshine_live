-- +goose Up
CREATE TABLE onboarding_description (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    description TEXT NOT NULL,
    lang CHARACTER VARYING(255) NOT NULL,
    oss_admin_id CHARACTER VARYING(255) NOT NULL,
    menu_type CHARACTER VARYING(255) NOT NULL,
    is_default_template INTEGER NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

-- +goose Down
DROP TABLE onboarding_description;
