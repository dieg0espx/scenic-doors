-- ============================================
-- 014: Make contract_id and payment_id nullable
-- Orders and payments can now be created from approval
-- drawing signing without a contract.
-- ============================================

-- Orders: contract_id and payment_id are optional (approval drawing flow)
ALTER TABLE public.orders ALTER COLUMN contract_id DROP NOT NULL;
ALTER TABLE public.orders ALTER COLUMN payment_id DROP NOT NULL;

-- Payments: contract_id is optional (approval drawing flow)
ALTER TABLE public.payments ALTER COLUMN contract_id DROP NOT NULL;
