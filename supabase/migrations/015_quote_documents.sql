-- Documents/files attached to quotes (also used for orders since orders reference quotes)
CREATE TABLE IF NOT EXISTS quote_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'application/octet-stream',
  file_size INTEGER NOT NULL DEFAULT 0,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by quote
CREATE INDEX IF NOT EXISTS idx_quote_documents_quote_id ON quote_documents(quote_id);

-- RLS
ALTER TABLE quote_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users"
  ON quote_documents FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon read"
  ON quote_documents FOR SELECT
  TO anon
  USING (true);
