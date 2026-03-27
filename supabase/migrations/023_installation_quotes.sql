-- Installation quotes: admin creates multi-line installation quotes for clients
CREATE TABLE IF NOT EXISTS public.installation_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'paid')),
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  signature_data TEXT,
  signed_by TEXT,
  signed_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  payment_id UUID REFERENCES public.payments(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.installation_quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installation_quote_id UUID NOT NULL REFERENCES public.installation_quotes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add installation to payment_type
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_payment_type_check;
ALTER TABLE public.payments ADD CONSTRAINT payments_payment_type_check
  CHECK (payment_type IN ('advance_50', 'balance_50', 'installation'));

-- RLS
ALTER TABLE public.installation_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installation_quote_items ENABLE ROW LEVEL SECURITY;

-- Authenticated (admin) full access
CREATE POLICY "auth_full_installation_quotes" ON public.installation_quotes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_full_installation_quote_items" ON public.installation_quote_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Anon read access
CREATE POLICY "anon_select_installation_quotes" ON public.installation_quotes
  FOR SELECT USING (auth.role() = 'anon');

CREATE POLICY "anon_select_installation_quote_items" ON public.installation_quote_items
  FOR SELECT USING (auth.role() = 'anon');

-- Anon can update installation_quotes (for signing)
CREATE POLICY "anon_update_installation_quotes" ON public.installation_quotes
  FOR UPDATE USING (auth.role() = 'anon');
