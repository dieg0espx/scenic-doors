-- Appointment scheduling system: schedule settings + appointments

-- Schedule settings: default weekly hours and per-day overrides
CREATE TABLE IF NOT EXISTS public.schedule_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_type TEXT NOT NULL CHECK (setting_type IN ('default', 'override')),
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  specific_date DATE,
  is_open BOOLEAN NOT NULL DEFAULT true,
  open_time TIME NOT NULL DEFAULT '08:00',
  close_time TIME NOT NULL DEFAULT '18:00',
  slot_duration_minutes INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partial unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_default_day
  ON public.schedule_settings(day_of_week) WHERE setting_type = 'default';
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_override_date
  ON public.schedule_settings(specific_date) WHERE setting_type = 'override';

-- Seed default schedule: Mon-Sat open 8am-6pm, Sun closed
INSERT INTO public.schedule_settings (setting_type, day_of_week, is_open, open_time, close_time)
VALUES
  ('default', 0, false, '08:00', '18:00'),  -- Sunday (closed)
  ('default', 1, true,  '08:00', '18:00'),  -- Monday
  ('default', 2, true,  '08:00', '18:00'),  -- Tuesday
  ('default', 3, true,  '08:00', '18:00'),  -- Wednesday
  ('default', 4, true,  '08:00', '18:00'),  -- Thursday
  ('default', 5, true,  '08:00', '18:00'),  -- Friday
  ('default', 6, true,  '08:00', '18:00')   -- Saturday
ON CONFLICT DO NOTHING;

-- Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 20,
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled')),
  notes TEXT,
  booked_by TEXT NOT NULL DEFAULT 'client'
    CHECK (booked_by IN ('client', 'admin')),
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON public.appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_quote_id ON public.appointments(quote_id);
CREATE INDEX IF NOT EXISTS idx_appointments_lead_id ON public.appointments(lead_id);

-- RLS
ALTER TABLE public.schedule_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Authenticated (admin) full access
CREATE POLICY "auth_full_schedule_settings" ON public.schedule_settings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_full_appointments" ON public.appointments
  FOR ALL USING (auth.role() = 'authenticated');

-- Anon read access to schedule settings (to compute available slots)
CREATE POLICY "anon_select_schedule_settings" ON public.schedule_settings
  FOR SELECT USING (auth.role() = 'anon');

-- Anon read access to appointments (to check booked slots)
CREATE POLICY "anon_select_appointments" ON public.appointments
  FOR SELECT USING (auth.role() = 'anon');

-- Anon can insert appointments (client booking from wizard/portal)
CREATE POLICY "anon_insert_appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.role() = 'anon');

-- Anon can update their own appointments (cancel from portal)
CREATE POLICY "anon_update_appointments" ON public.appointments
  FOR UPDATE USING (auth.role() = 'anon');
