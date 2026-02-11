-- ============================================
-- 003: Create payments table
-- ============================================

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  contract_id uuid not null references public.contracts(id) on delete cascade,
  client_name text not null,
  amount numeric(10,2) not null default 0,
  payment_type text not null default 'advance_50' check (payment_type in ('advance_50')),
  status text not null default 'pending' check (status in ('pending','completed','on_hold')),
  created_at timestamptz not null default now()
);

-- RLS
alter table public.payments enable row level security;

-- Authenticated users (admin) get full access
create policy "Admin full access on payments"
  on public.payments
  for all
  to authenticated
  using (true)
  with check (true);

-- Anon can insert payments (created after contract signing)
create policy "Anon can insert payments"
  on public.payments
  for insert
  to anon
  with check (true);

-- Anon can read payments
create policy "Anon can read payments"
  on public.payments
  for select
  to anon
  using (true);
