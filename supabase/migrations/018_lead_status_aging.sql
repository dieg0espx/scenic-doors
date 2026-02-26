-- Add last_activity_at to track admin interactions for automatic lead status aging
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT now();

-- Backfill existing rows: use the most recent activity timestamp available
UPDATE quotes SET last_activity_at = GREATEST(
  COALESCE(assigned_date, created_at),
  COALESCE(sent_at, created_at),
  COALESCE(viewed_at, created_at),
  created_at
);

COMMENT ON COLUMN quotes.last_activity_at IS 'Tracks last admin activity for automatic lead status aging';
