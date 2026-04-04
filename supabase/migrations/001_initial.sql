-- Run this in Supabase SQL Editor (Dashboard → SQL) after creating a project.
-- Requires: Authentication → Email provider enabled.

create extension if not exists "pgcrypto";

-- Transactions
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  amount double precision not null,
  type text not null,
  category text not null,
  note text,
  date text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index transactions_user_date_idx on public.transactions (user_id, date desc);

alter table public.transactions enable row level security;

create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = user_id);

create policy "transactions_insert_own" on public.transactions
  for insert with check (auth.uid() = user_id);

create policy "transactions_update_own" on public.transactions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "transactions_delete_own" on public.transactions
  for delete using (auth.uid() = user_id);

-- Debts
create table public.debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  total_amount double precision not null,
  remaining_amount double precision not null,
  due_date text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index debts_user_idx on public.debts (user_id);

alter table public.debts enable row level security;

create policy "debts_select_own" on public.debts
  for select using (auth.uid() = user_id);

create policy "debts_insert_own" on public.debts
  for insert with check (auth.uid() = user_id);

create policy "debts_update_own" on public.debts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "debts_delete_own" on public.debts
  for delete using (auth.uid() = user_id);

-- Budgets (per user, category, month)
create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  category text not null,
  amount double precision not null,
  month text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, category, month)
);

create index budgets_user_month_idx on public.budgets (user_id, month);

alter table public.budgets enable row level security;

create policy "budgets_select_own" on public.budgets
  for select using (auth.uid() = user_id);

create policy "budgets_insert_own" on public.budgets
  for insert with check (auth.uid() = user_id);

create policy "budgets_update_own" on public.budgets
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "budgets_delete_own" on public.budgets
  for delete using (auth.uid() = user_id);
