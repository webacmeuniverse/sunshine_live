-- +goose Up
CREATE TABLE reply_mail (
	id UUID PRIMARY KEY DEFAULT PUBLIC.gen_random_uuid(),
    topic CHARACTER VARYING(255) NOT NULL,
	message TEXT NOT NULL,
    sender_name CHARACTER VARYING(255) NOT NULL,
    sender_email CHARACTER VARYING(255) NOT NULL,
    oss_admin_id CHARACTER VARYING(255) NOT NULL,
    
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE
);

-- +goose Down
DROP TABLE reply_mail;


