-- +goose Up
-- +goose NO TRANSACTION

ALTER TYPE user_action ADD VALUE IF NOT EXISTS 'project_create_org';
ALTER TYPE user_action ADD VALUE IF NOT EXISTS 'project_create_asset';
ALTER TYPE user_action ADD VALUE IF NOT EXISTS 'advance_milestone';
ALTER TYPE user_action ADD VALUE IF NOT EXISTS 'advance_to_work_phase';
ALTER TYPE user_action ADD VALUE IF NOT EXISTS 'advance_to_monitoring_phase';
ALTER TYPE user_action ADD VALUE IF NOT EXISTS 'table_update';

-- +goose Down
SELECT 1;
