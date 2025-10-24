-- +goose Up
CREATE TABLE user_result_calc_field (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
	ees_field_id CHARACTER VARYING(255) NOT NULL,
	ees_field_value CHARACTER VARYING(255) NOT NULL,
	session CHARACTER VARYING(255)NOT NULL,
	lang CHARACTER VARYING(255) NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

-- +goose Down
DROP TABLE user_result_calc_field;
