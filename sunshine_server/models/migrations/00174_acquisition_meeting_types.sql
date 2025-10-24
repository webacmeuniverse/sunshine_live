-- +goose Up
-- +goose NO TRANSACTION
ALTER TYPE meeting_type ADD VALUE IF NOT EXISTS 'acquisition_acquisition_commitment';

-- +goose Down
-- +goose NO TRANSACTION
UPDATE meetings SET topic='acquisition' WHERE topic='acquisition_acquisition_commitment';
ALTER type meeting_type RENAME TO old_meeting_type;
CREATE TYPE meeting_type AS ENUM (
  'internal_meeting',
  'conference',
  'workshop',
  'event',
  'training',
  'eu_project_meeting',
  'eu_project_activity',
  'acquisition',
  'acquisition_commitment',
  'acquisition_kick_off',
  'works_kick_off',
  'works_initial_information',
  'works_weekly_report',
  'works_renovation_informative',
  'works_communication',
  'works_construction_managers_final',
  'works_final_information',
  'other'
);
ALTER TABLE meetings ALTER COLUMN topic TYPE meeting_type USING topic::TEXT::meeting_type;
DROP type old_meeting_type;

