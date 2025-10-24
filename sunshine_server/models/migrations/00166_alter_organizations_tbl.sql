-- +goose Up
ALTER TABLE organizations 
    ADD COLUMN services_provided CHARACTER VARYING(255),
    ADD COLUMN certification CHARACTER VARYING(255),
    ADD COLUMN short_summary TEXT,
    ADD COLUMN oss_approved BOOLEAN,
    ADD COLUMN coords REAL[];

-- +goose Down
ALTER TABLE users 
    DROP COLUMN services_provided,
    DROP COLUMN certification,
    DROP COLUMN short_summary,
    DROP COLUMN approved,
    DROP COLUMN coords;
