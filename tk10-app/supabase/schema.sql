-- ============================================
-- TIRSDAG KL. 10 — Supabase Schema
-- Strategiskskole.dk © Thomas Kjerstein
-- ============================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
create table if not exists profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text unique not null,
  navn        text,
  organisation text,
  rolle_default text check (rolle_default in ('skoleleder','ledelsesteam','bestyrelse')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================
-- FORLOEB
-- ============================================
create table if not exists forloeb (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references profiles(id) on delete cascade not null,
  navn        text not null,
  maal        text,
  data        jsonb default '{}'::jsonb,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists forloeb_user_idx on forloeb(user_id);

-- Auto-update updated_at
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists forloeb_updated on forloeb;
create trigger forloeb_updated
  before update on forloeb
  for each row execute function touch_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table profiles enable row level security;
alter table forloeb enable row level security;

-- Profiles: kun egen profil
create policy "profiles_own" on profiles
  for all using (auth.uid() = id);

-- Forløb: kun egne forløb (MVP — team-deling tilføjes i Fase 2)
create policy "forloeb_own_select" on forloeb
  for select using (auth.uid() = user_id);

create policy "forloeb_own_insert" on forloeb
  for insert with check (auth.uid() = user_id);

create policy "forloeb_own_update" on forloeb
  for update using (auth.uid() = user_id);

create policy "forloeb_own_delete" on forloeb
  for delete using (auth.uid() = user_id);

-- ============================================
-- SEED DATA (eksempel-kortstruktur som reference)
-- ============================================

-- Kortstrukturen er statisk og bor i kodebasen (lib/data/kort.ts)
-- Supabase bruges til: auth, forløb-data (noter, beslutninger, handlinger, møder)
-- Intet dynamisk kortindhold gemmes i databasen — kortene er låst i koden

-- ============================================
-- VIEWS (convenience)
-- ============================================

create or replace view forloeb_summary as
select
  f.id,
  f.user_id,
  f.navn,
  f.maal,
  f.created_at,
  f.updated_at,
  p.navn as ejer_navn,
  p.organisation
from forloeb f
join profiles p on f.user_id = p.id;

-- ============================================
-- FREMTID — Fase 2
-- ============================================
-- teams, team_members, forloeb_shares
-- realtime subscriptions til team-noter
-- audit_log tabel (pt. i jsonb data)
-- organisations med flere brugere
