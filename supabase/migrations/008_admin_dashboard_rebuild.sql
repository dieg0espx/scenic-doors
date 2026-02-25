-- ============================================================
-- Migration 008: Admin Dashboard Rebuild
-- New tables: leads, admin_users, notification_settings,
--             quote_notes, quote_tasks, email_history
-- Alter: quotes (add lead management + item-level fields)
-- ============================================================

-- ── LEADS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  zip TEXT,
  customer_type TEXT DEFAULT 'residential',
  timeline TEXT,
  source TEXT,
  status TEXT DEFAULT 'new',
  referral_code TEXT,
  has_quote BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users have full access to leads"
  ON leads FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── ADMIN USERS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  prefix TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  home_zipcode TEXT,
  role TEXT DEFAULT 'sales',
  zipcodes TEXT[] DEFAULT '{}',
  referral_codes TEXT[] DEFAULT '{}',
  start_date DATE,
  location_code TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users have full access to admin_users"
  ON admin_users FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── NOTIFICATION SETTINGS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT UNIQUE NOT NULL,
  emails TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users have full access to notification_settings"
  ON notification_settings FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Seed default rows
INSERT INTO notification_settings (type, emails)
VALUES ('lead', '{}'), ('quote', '{}')
ON CONFLICT (type) DO NOTHING;

-- ── QUOTE NOTES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quote_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE quote_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users have full access to quote_notes"
  ON quote_notes FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── QUOTE TASKS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quote_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE quote_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users have full access to quote_tasks"
  ON quote_tasks FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── EMAIL HISTORY ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  subject TEXT,
  type TEXT,
  sent_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE email_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users have full access to email_history"
  ON email_history FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── ALTER QUOTES TABLE ─────────────────────────────────────
ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS customer_type TEXT DEFAULT 'residential',
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS customer_zip TEXT,
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS assigned_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_by TEXT,
  ADD COLUMN IF NOT EXISTS lead_status TEXT DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS installation_cost NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_cost NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS grand_total NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS follow_up_date DATE,
  ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id) ON DELETE SET NULL;

-- ── UPDATED_AT TRIGGERS ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_leads_updated_at') THEN
    CREATE TRIGGER set_leads_updated_at
      BEFORE UPDATE ON leads
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_admin_users_updated_at') THEN
    CREATE TRIGGER set_admin_users_updated_at
      BEFORE UPDATE ON admin_users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_notification_settings_updated_at') THEN
    CREATE TRIGGER set_notification_settings_updated_at
      BEFORE UPDATE ON notification_settings
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;
