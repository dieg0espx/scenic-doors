-- ============================================
-- 004: Create orders table
-- ============================================

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  contract_id uuid not null references public.contracts(id) on delete cascade,
  payment_id uuid not null references public.payments(id) on delete cascade,
  order_number text unique,
  client_name text not null,
  client_email text not null,
  status text not null default 'pending' check (status in ('pending','in_progress','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-generate order number ORD-YYYY-###
create or replace function public.generate_order_number()
returns trigger as $$
declare
  current_year text;
  next_seq int;
begin
  current_year := to_char(now(), 'YYYY');
  select coalesce(max(cast(substring(order_number from 10) as int)), 0) + 1
    into next_seq
    from public.orders
    where order_number like 'ORD-' || current_year || '-%';
  new.order_number := 'ORD-' || current_year || '-' || lpad(next_seq::text, 3, '0');
  return new;
end;
$$ language plpgsql;

create trigger trg_generate_order_number
  before insert on public.orders
  for each row
  when (new.order_number is null)
  execute function public.generate_order_number();

-- Updated_at trigger
create trigger trg_orders_updated_at
  before update on public.orders
  for each row
  execute function public.update_updated_at();

-- RLS
alter table public.orders enable row level security;

-- Authenticated users (admin) get full access
create policy "Admin full access on orders"
  on public.orders
  for all
  to authenticated
  using (true)
  with check (true);

-- Anon can insert orders (created after contract signing)
create policy "Anon can insert orders"
  on public.orders
  for insert
  to anon
  with check (true);

-- Anon can read orders
create policy "Anon can read orders"
  on public.orders
  for select
  to anon
  using (true);
