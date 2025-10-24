-- +goose Up
-- +goose NO TRANSACTION

Delete from organizations a
 USING organizations b               
where a.id!=b.id AND (a.registration_number=b.registration_number OR a.registration_number IS NULL);

ALTER TABLE organizations
    ADD CONSTRAINT organizations_registration_number_unique UNIQUE(registration_number);

ALTER TABLE organizations ALTER COLUMN registration_number SET NOT NULL;

-- +goose Down
-- +goose NO TRANSACTION
ALTER TABLE organizations
    DROP CONSTRAINT organizations_registration_number_unique;

ALTER TABLE organizations ALTER TABLE registration_number DROP NOT NULL;
