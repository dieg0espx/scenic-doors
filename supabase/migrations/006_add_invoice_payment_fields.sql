-- ============================================
-- 006: Add invoice/payment fields to payments
-- ============================================

-- Ensure payment_type column exists before modifying constraint
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_type TEXT NOT NULL DEFAULT 'advance_50';

-- Fix payment_type constraint to allow balance_50
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_payment_type_check;
ALTER TABLE public.payments ADD CONSTRAINT payments_payment_type_check CHECK (payment_type IN ('advance_50', 'balance_50'));

-- Add payment tracking fields
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_reference TEXT;

-- Allow anon users (clients) to update their payment with confirmation details
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon can update payment confirmation') THEN
    CREATE POLICY "Anon can update payment confirmation"
      ON public.payments
      FOR UPDATE
      TO anon
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
