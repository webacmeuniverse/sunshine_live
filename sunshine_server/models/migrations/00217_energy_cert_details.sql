-- +goose Up
CREATE TABLE energy_cert_details (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    asset_id CHARACTER VARYING(255) NOT NULL,
    user_id CHARACTER VARYING(255) NOT NULL,
    energy_class CHARACTER VARYING(255) NOT NULL,
    consumption INTEGER NOT NULL,
    certificate TEXT NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE energy_cert_category (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    user_id CHARACTER VARYING(255) NOT NULL,
    asset_id CHARACTER VARYING(255) NOT NULL,
    details_id CHARACTER VARYING(255) NOT NULL,
    category CHARACTER VARYING(255) NOT NULL,
    consumption INTEGER NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE energy_cert_reduction (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    asset_id CHARACTER VARYING(255) NOT NULL,
    user_id CHARACTER VARYING(255) NOT NULL,
    details_id CHARACTER VARYING(255) NOT NULL,
    renovation_measure CHARACTER VARYING(255) NOT NULL,
    reduction INTEGER NOT NULL,
    cost_eur_m2 INTEGER NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

-- +goose Down
DROP TABLE energy_certificate_details;
DROP TABLE energy_certificate_category;
DROP TABLE energy_certificate_reduction;
