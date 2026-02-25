-- ============================================
-- 005: Add delivery/pickup fields to quotes
-- ============================================

ALTER TABLE public.quotes ADD COLUMN delivery_type TEXT NOT NULL DEFAULT 'delivery' CHECK (delivery_type IN ('delivery', 'pickup'));
ALTER TABLE public.quotes ADD COLUMN delivery_address TEXT;
