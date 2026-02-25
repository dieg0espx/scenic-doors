-- ============================================================
-- 010: Client Portal System
-- Approval drawings, photos, order tracking, follow-up schedule
-- ============================================================

-- Portal stage on quotes (tracks where client is in the pipeline)
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS portal_stage TEXT NOT NULL DEFAULT 'quote_sent';
-- Values: quote_sent, approval_pending, approval_signed, deposit_1_pending,
--         manufacturing, deposit_2_pending, shipping, delivered

-- ── Approval Drawings ──
CREATE TABLE IF NOT EXISTS approval_drawings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  overall_width NUMERIC NOT NULL DEFAULT 0,
  overall_height NUMERIC NOT NULL DEFAULT 0,
  panel_count INTEGER NOT NULL DEFAULT 0,
  slide_direction TEXT DEFAULT 'left',
  in_swing TEXT DEFAULT 'interior',
  system_type TEXT DEFAULT '',
  configuration TEXT DEFAULT '',
  additional_notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  customer_name TEXT,
  signature_date TEXT,
  signature_data TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE approval_drawings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anon can read approval drawings" ON approval_drawings FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can update approval drawings for signing" ON approval_drawings FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Auth full access approval drawings" ON approval_drawings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── Quote Photos (interior / exterior / other) ──
CREATE TABLE IF NOT EXISTS quote_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  photo_url TEXT NOT NULL,
  photo_type TEXT NOT NULL DEFAULT 'other',
  caption TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE quote_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anon can read quote photos" ON quote_photos FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can insert quote photos" ON quote_photos FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Auth full access quote photos" ON quote_photos FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── Order Tracking ──
CREATE TABLE IF NOT EXISTS order_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  stage TEXT NOT NULL DEFAULT 'deposit_1_pending',
  tracking_number TEXT,
  shipping_carrier TEXT,
  shipping_updates JSONB DEFAULT '[]'::jsonb,
  deposit_1_paid BOOLEAN DEFAULT FALSE,
  deposit_1_amount NUMERIC DEFAULT 0,
  deposit_1_paid_at TIMESTAMPTZ,
  deposit_2_paid BOOLEAN DEFAULT FALSE,
  deposit_2_amount NUMERIC DEFAULT 0,
  deposit_2_paid_at TIMESTAMPTZ,
  manufacturing_started_at TIMESTAMPTZ,
  manufacturing_completed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  estimated_completion DATE,
  estimated_delivery DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anon can read order tracking" ON order_tracking FOR SELECT TO anon USING (true);
CREATE POLICY "Auth full access order tracking" ON order_tracking FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── Follow-up Schedule ──
CREATE TABLE IF NOT EXISTS follow_up_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  email_type TEXT NOT NULL DEFAULT 'follow_up',
  sequence_number INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE follow_up_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth full access follow up schedule" ON follow_up_schedule FOR ALL TO authenticated USING (true) WITH CHECK (true);
