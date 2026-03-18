-- SnapOG Database Schema
-- Run this in your Supabase SQL editor

-- =========================================
-- EXTENSIONS
-- =========================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =========================================
-- PROFILES TABLE
-- Extended user profile linked to auth.users
-- =========================================
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null,
  plan        text not null default 'free' check (plan in ('free', 'pro', 'business')),
  paypal_subscription_id text,
  subscription_status text check (subscription_status in ('active', 'cancelled', 'expired', null)),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger to create profile on user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================
-- API KEYS TABLE
-- =========================================
create table if not exists public.api_keys (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  key_prefix  text not null,
  key_hash    text not null unique,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  last_used_at timestamptz
);

create index if not exists api_keys_user_id_idx on public.api_keys(user_id);
create index if not exists api_keys_key_hash_idx on public.api_keys(key_hash);

-- =========================================
-- MONTHLY USAGE TABLE
-- Tracks API usage per user per month
-- =========================================
create table if not exists public.monthly_usage (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  month       text not null,  -- YYYY-MM format
  count       integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(user_id, month)
);

create index if not exists monthly_usage_user_month_idx on public.monthly_usage(user_id, month);

-- =========================================
-- ANONYMOUS USAGE TABLE
-- Tracks daily API usage for anonymous users (by IP)
-- =========================================
create table if not exists public.anonymous_usage (
  id          uuid primary key default uuid_generate_v4(),
  ip          text not null,
  date        text not null,  -- YYYY-MM-DD format
  count       integer not null default 0,
  created_at  timestamptz not null default now(),
  unique(ip, date)
);

create index if not exists anonymous_usage_ip_date_idx on public.anonymous_usage(ip, date);

-- =========================================
-- OG HISTORY TABLE
-- Stores generated OG image history
-- =========================================
create table if not exists public.og_history (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  params      jsonb not null,
  preview_url text,
  created_at  timestamptz not null default now()
);

create index if not exists og_history_user_id_idx on public.og_history(user_id);
create index if not exists og_history_created_at_idx on public.og_history(created_at desc);

-- =========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.api_keys enable row level security;
alter table public.monthly_usage enable row level security;
alter table public.og_history enable row level security;

-- NOTE: anonymous_usage is only written by service role, no RLS needed for users

-- PROFILES: Users can only see and update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- API KEYS: Users can only manage their own keys
create policy "Users can view own API keys"
  on public.api_keys for select
  using (auth.uid() = user_id);

create policy "Users can create own API keys"
  on public.api_keys for insert
  with check (auth.uid() = user_id);

create policy "Users can update own API keys"
  on public.api_keys for update
  using (auth.uid() = user_id);

create policy "Users can delete own API keys"
  on public.api_keys for delete
  using (auth.uid() = user_id);

-- MONTHLY USAGE: Users can view their own usage; service role can insert/update
create policy "Users can view own monthly usage"
  on public.monthly_usage for select
  using (auth.uid() = user_id);

create policy "Service role can manage monthly usage"
  on public.monthly_usage for all
  using (auth.role() = 'service_role');

-- OG HISTORY: Users can manage their own history
create policy "Users can view own OG history"
  on public.og_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own OG history"
  on public.og_history for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own OG history"
  on public.og_history for delete
  using (auth.uid() = user_id);

-- =========================================
-- HELPER FUNCTIONS
-- =========================================

-- Function to increment monthly usage (called from service role)
create or replace function public.increment_usage(p_user_id uuid, p_month text)
returns integer
language plpgsql
security definer
as $$
declare
  new_count integer;
begin
  insert into public.monthly_usage (user_id, month, count)
  values (p_user_id, p_month, 1)
  on conflict (user_id, month)
  do update set
    count = monthly_usage.count + 1,
    updated_at = now()
  returning count into new_count;

  return new_count;
end;
$$;
