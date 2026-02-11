-- ============================================
-- 007: Create clients + client_addresses tables
-- ============================================

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  company text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_addresses (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  label text not null,
  address text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- Add client FK to quotes
alter table public.quotes add column if not exists client_id uuid references public.clients(id);

-- Updated_at trigger for clients
create trigger trg_clients_updated_at
  before update on public.clients
  for each row
  execute function public.update_updated_at();

-- RLS for clients
alter table public.clients enable row level security;

create policy "Admin full access on clients"
  on public.clients
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Anon can read clients"
  on public.clients
  for select
  to anon
  using (true);

-- RLS for client_addresses
alter table public.client_addresses enable row level security;

create policy "Admin full access on client_addresses"
  on public.client_addresses
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Anon can read client_addresses"
  on public.client_addresses
  for select
  to anon
  using (true);
