-- +goose Up
CREATE TABLE user_answer (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    answer CHARACTER VARYING(255) NOT NULL,
	field_id UUID NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

-- +goose Down
DROP TABLE user_answer;


