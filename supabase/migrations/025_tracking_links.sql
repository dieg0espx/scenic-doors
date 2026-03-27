-- Tracking links: custom campaign/source identifiers for lead attribution
CREATE TABLE IF NOT EXISTS public.tracking_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,          -- Display name: "Facebook Spring Campaign"
  slug TEXT NOT NULL UNIQUE,   -- URL identifier: "fb_spring" → ?src=fb_spring
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.tracking_links ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "auth_full_tracking_links" ON public.tracking_links
  FOR ALL USING (auth.role() = 'authenticated');

-- Anon read (so quote page can validate)
CREATE POLICY "anon_select_tracking_links" ON public.tracking_links
  FOR SELECT USING (auth.role() = 'anon');
