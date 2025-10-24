-- +goose Up
CREATE TABLE energy_cert_file (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    details_id CHARACTER VARYING(255) NOT NULL,
    file_url CHARACTER VARYING(255) NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);


-- +goose Down
DROP TABLE energy_certificate_file;
