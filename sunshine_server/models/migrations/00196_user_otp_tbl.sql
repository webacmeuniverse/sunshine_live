-- +goose Up
CREATE TABLE user_otp (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    user_id CHARACTER VARYING(255) NOT NULL,
    token CHARACTER VARYING(255) NOT NULL,
    active BOOLEAN NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

-- +goose Down
DROP TABLE field_backup;
