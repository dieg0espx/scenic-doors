ALTER TABLE quotes ADD COLUMN IF NOT EXISTS intent_level TEXT DEFAULT 'full';
COMMENT ON COLUMN quotes.intent_level IS 'browse | medium | full';
