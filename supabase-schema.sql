-- Run this once in Supabase: Dashboard > SQL Editor > New query > paste > Run

create table if not exists app_data (
  id text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- This app has no login system yet (single business owner, MVP stage).
-- The policy below allows the public anon key to read/write this table,
-- which is fine for personal use but means ANYONE with your Supabase URL
-- and anon key could read or overwrite your quotes. Before giving this
-- tool to other carpenters (multi-tenant), replace this with real user
-- authentication (Supabase Auth) and a policy scoped to auth.uid().
alter table app_data enable row level security;

create policy "allow anon read" on app_data
  for select using (true);

create policy "allow anon write" on app_data
  for insert with check (true);

create policy "allow anon update" on app_data
  for update using (true);
