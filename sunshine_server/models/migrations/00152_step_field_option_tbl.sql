-- +goose Up
CREATE TABLE step_field_option (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    step_field_id UUID NOT NULL,
	title CHARACTER VARYING(255)NOT NULL,
	option_value CHARACTER VARYING(255)NOT NULL,
	default_score REAL NOT NULL,
	image CHARACTER VARYING(255)NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

-- +goose Down
DROP TABLE step_field_option;


