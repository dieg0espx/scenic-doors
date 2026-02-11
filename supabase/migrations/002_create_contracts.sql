-- ============================================
-- 002: Create contracts table
-- ============================================

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  client_name text not null,
  signature_url text not null,
  signature_public_id text,
  ip_address text,
  user_agent text,
  signed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- RLS
alter table public.contracts enable row level security;

-- Authenticated users (admin) get full access
create policy "Admin full access on contracts"
  on public.contracts
  for all
  to authenticated
  using (true)
  with check (true);

-- Anon can insert contracts (client signing)
create policy "Anon can insert contracts"
  on public.contracts
  for insert
  to anon
  with check (true);

-- Anon can read contracts
create policy "Anon can read contracts"
  on public.contracts
  for select
  to anon
  using (true);
