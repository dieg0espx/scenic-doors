-- ============================================
-- 001: Create quotes table
-- ============================================

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  quote_number text unique,
  client_name text not null,
  client_email text not null,
  door_type text not null,
  material text not null,
  color text not null,
  glass_type text not null,
  size text not null,
  cost numeric(10,2) not null default 0,
  notes text,
  status text not null default 'draft' check (status in ('draft','sent','viewed','accepted','declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sent_at timestamptz,
  viewed_at timestamptz,
  accepted_at timestamptz,
  declined_at timestamptz
);

-- Auto-generate quote number QT-YYYY-###
create or replace function public.generate_quote_number()
returns trigger as $$
declare
  current_year text;
  next_seq int;
begin
  current_year := to_char(now(), 'YYYY');
  select coalesce(max(cast(substring(quote_number from 9) as int)), 0) + 1
    into next_seq
    from public.quotes
    where quote_number like 'QT-' || current_year || '-%';
  new.quote_number := 'QT-' || current_year || '-' || lpad(next_seq::text, 3, '0');
  return new;
end;
$$ language plpgsql;

create trigger trg_generate_quote_number
  before insert on public.quotes
  for each row
  when (new.quote_number is null)
  execute function public.generate_quote_number();

-- Updated_at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_quotes_updated_at
  before update on public.quotes
  for each row
  execute function public.update_updated_at();

-- RLS
alter table public.quotes enable row level security;

-- Authenticated users (admin) get full access
create policy "Admin full access on quotes"
  on public.quotes
  for all
  to authenticated
  using (true)
  with check (true);

-- Anon can read quotes (public link viewing)
create policy "Anon can read quotes"
  on public.quotes
  for select
  to anon
  using (true);

-- Anon can update status (accept/decline/viewed)
create policy "Anon can update quote status"
  on public.quotes
  for update
  to anon
  using (true)
  with check (true);
