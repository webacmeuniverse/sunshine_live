-- +goose Up
CREATE TABLE subscribers (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    email CHARACTER VARYING(255) NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

-- +goose Down
DROP TABLE subscribers;
