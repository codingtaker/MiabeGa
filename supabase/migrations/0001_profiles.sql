-- Profiles: app-specific fields for each auth.users row.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  avatar text not null default '/placeholder-user.jpg',
  level int not null default 1,
  xp int not null default 0,
  streak int not null default 0,
  badges text[] not null default '{}',
  balance numeric not null default 0,
  monthly_income numeric not null default 0,
  monthly_expenses numeric not null default 0,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A user can read/update only their own profile row.
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Other authenticated users may read only the display name/avatar (needed to
-- render contributor names on shared projects) via this view. Left as
-- security definer (the default) so it bypasses the row-owner-only RLS above
-- while still exposing just these two columns, not the full profile.
create view public.profile_public as
  select id, name, avatar from public.profiles;

grant select on public.profile_public to authenticated;
