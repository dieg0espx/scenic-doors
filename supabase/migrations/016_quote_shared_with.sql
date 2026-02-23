-- Add shared_with column to quotes for multi-rep sharing
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS shared_with TEXT[] DEFAULT '{}'::TEXT[];
CREATE INDEX IF NOT EXISTS idx_quotes_shared_with ON quotes USING GIN (shared_with);
