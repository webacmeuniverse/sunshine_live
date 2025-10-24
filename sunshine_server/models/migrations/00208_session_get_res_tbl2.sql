-- +goose Up
ALTER TABLE get_result_tbl2 ADD COLUMN session CHARACTER VARYING(255);

-- +goose Down
ALTER TABLE get_result_tbl2 DROP COLUMN session;

