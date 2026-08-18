create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  target_amount numeric not null,
  current_amount numeric not null default 0,
  deadline date not null,
  category text not null,
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.project_participants (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  is_admin boolean not null default false,
  joined_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

alter table public.projects enable row level security;
alter table public.project_participants enable row level security;

-- Only participants of a project can see it.
create policy "projects_select_participants"
  on public.projects for select
  using (
    exists (
      select 1 from public.project_participants pp
      where pp.project_id = id and pp.user_id = auth.uid()
    )
  );

create policy "projects_insert_own"
  on public.projects for insert
  with check (created_by = auth.uid());

create policy "projects_update_admins"
  on public.projects for update
  using (
    exists (
      select 1 from public.project_participants pp
      where pp.project_id = id and pp.user_id = auth.uid() and pp.is_admin
    )
  );

-- Participants can see the membership list of projects they belong to.
create policy "participants_select_same_project"
  on public.project_participants for select
  using (
    exists (
      select 1 from public.project_participants pp
      where pp.project_id = project_participants.project_id and pp.user_id = auth.uid()
    )
  );

-- Project admins add participants. The creator's own first (admin) row is
-- seeded by a security-definer trigger (0005), which bypasses this policy,
-- so it does not need a self-insert carve-out here.
create policy "participants_insert_admins"
  on public.project_participants for insert
  with check (
    exists (
      select 1 from public.project_participants pp
      where pp.project_id = project_participants.project_id
        and pp.user_id = auth.uid()
        and pp.is_admin
    )
  );
