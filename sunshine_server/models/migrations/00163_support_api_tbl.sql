-- +goose Up
CREATE TABLE support_api (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    email CHARACTER VARYING(255) NOT NULL,
	subject CHARACTER VARYING(175) NOT NULL,
	message CHARACTER VARYING(255) NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

-- +goose Down
DROP TABLE support_api;


