-- Run this once in Supabase: Dashboard > SQL Editor > New query > paste > Run

create table if not exists app_data (
  id text primary key,
  value text not null,
  updated_at timestamptz default now()
);

alter table app_data enable row level security;

-- Remove the temporary public MVP access before enabling accounts.
drop policy if exists "allow anon read" on app_data;
drop policy if exists "allow anon write" on app_data;
drop policy if exists "allow anon update" on app_data;

-- Secure multi-user storage. The original MVP table remains untouched.
create table if not exists user_app_data (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  value text not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

alter table user_app_data enable row level security;

drop policy if exists "users read own data" on user_app_data;
drop policy if exists "users insert own data" on user_app_data;
drop policy if exists "users update own data" on user_app_data;
drop policy if exists "users delete own data" on user_app_data;

create policy "users read own data" on user_app_data
  for select to authenticated using (auth.uid() = user_id);
create policy "users insert own data" on user_app_data
  for insert to authenticated with check (auth.uid() = user_id);
create policy "users update own data" on user_app_data
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users delete own data" on user_app_data
  for delete to authenticated using (auth.uid() = user_id);
