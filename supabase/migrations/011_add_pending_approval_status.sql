-- Add 'pending_approval' to quotes status CHECK constraint
ALTER TABLE quotes DROP CONSTRAINT IF EXISTS quotes_status_check;
ALTER TABLE quotes ADD CONSTRAINT quotes_status_check
  CHECK (status IN ('draft','sent','viewed','pending_approval','accepted','declined'));
