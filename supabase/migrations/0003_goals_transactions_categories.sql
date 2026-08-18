create table public.contributions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id),
  amount numeric not null check (amount > 0),
  message text,
  created_at timestamptz not null default now()
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text not null default '',
  target_amount numeric not null,
  current_amount numeric not null default 0,
  deadline date not null,
  category text not null,
  priority text not null check (priority in ('low', 'medium', 'high')),
  status text not null default 'active' check (status in ('active', 'completed', 'paused')),
  created_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount numeric not null check (amount > 0),
  description text not null default '',
  category text not null,
  date date not null,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense', 'both')),
  color text not null
);

alter table public.contributions enable row level security;
alter table public.goals enable row level security;
alter table public.transactions enable row level security;
alter table public.categories enable row level security;

-- Contributions: visible/insertable only by participants of the parent project.
create policy "contributions_select_participants"
  on public.contributions for select
  using (
    exists (
      select 1 from public.project_participants pp
      where pp.project_id = contributions.project_id and pp.user_id = auth.uid()
    )
  );

create policy "contributions_insert_participants"
  on public.contributions for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.project_participants pp
      where pp.project_id = contributions.project_id and pp.user_id = auth.uid()
    )
  );

-- Goals and transactions are private to their owner.
create policy "goals_all_own"
  on public.goals for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "transactions_all_own"
  on public.transactions for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Categories: system rows (user_id is null) are readable by everyone;
-- custom categories are private to their owner.
create policy "categories_select_system_or_own"
  on public.categories for select
  using (user_id is null or user_id = auth.uid());

create policy "categories_insert_own"
  on public.categories for insert
  with check (user_id = auth.uid());

create policy "categories_update_own"
  on public.categories for update
  using (user_id = auth.uid());

create policy "categories_delete_own"
  on public.categories for delete
  using (user_id = auth.uid());

-- Seed the 6 system categories used by the current app (app.tsx initialCategories).
insert into public.categories (user_id, name, type, color) values
  (null, 'Alimentation', 'expense', '#f97316'),
  (null, 'Transport', 'expense', '#3b82f6'),
  (null, 'Loisirs', 'expense', '#a855f7'),
  (null, 'Éducation', 'expense', '#22c55e'),
  (null, 'Travail', 'income', '#eab308'),
  (null, 'Bourse', 'income', '#06b6d4');
