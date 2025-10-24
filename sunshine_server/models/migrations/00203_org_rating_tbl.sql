-- +goose Up
CREATE TABLE organization_rating (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    organization_id UUID NOT NULL,
    user_id UUID NOT NULL,
    quality REAL NOT NULL,
    speed REAL NOT NULL,
    communication REAL NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

-- +goose Down
DROP TABLE organization_rating;
