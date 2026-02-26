-- 020: Lead temperature aging + separate workflow status
--
-- `status` = temperature (hot/warm/cold) — auto-managed by cron
-- `workflow_status` = manual workflow (null/contacted/qualified/lost) — set by admins
-- Both are independent: a lead can be "warm" AND "contacted"

-- Add last_activity_at for cron aging
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT now();

-- Add workflow_status (null = no workflow action yet)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS workflow_status TEXT DEFAULT NULL;

-- Backfill last_activity_at
UPDATE leads SET last_activity_at = COALESCE(updated_at, created_at)
WHERE last_activity_at IS NULL;

-- Migrate old workflow statuses into the new column, then set temperature to "hot"
UPDATE leads SET workflow_status = status WHERE status IN ('contacted', 'qualified', 'lost');

-- Convert all statuses to temperature values
UPDATE leads SET status = 'hot' WHERE status NOT IN ('hot', 'warm', 'cold');

-- Set default for new leads
ALTER TABLE leads ALTER COLUMN status SET DEFAULT 'hot';
