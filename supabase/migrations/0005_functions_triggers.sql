-- 1. Auto-create a profiles row whenever a new auth.users row appears.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Seed the creator as an admin participant when a project is created.
-- security definer because the creator has no project_participants row yet,
-- so the normal "insert_admins" RLS policy on that table can't apply here.
create function public.handle_new_project()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.project_participants (project_id, user_id, is_admin)
  values (new.id, new.created_by, true);
  return new;
end;
$$;

create trigger on_project_created
  after insert on public.projects
  for each row execute function public.handle_new_project();

-- 3. Apply a contribution to the project total, and auto-complete the
-- project once the target amount is reached.
create function public.handle_new_contribution()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.projects
  set current_amount = current_amount + new.amount,
      status = case
        when current_amount + new.amount >= target_amount then 'completed'
        else status
      end
  where id = new.project_id;
  return new;
end;
$$;

create trigger on_contribution_created
  after insert on public.contributions
  for each row execute function public.handle_new_contribution();

-- 4. Recompute a user's balance/monthly income/monthly expenses from their
-- transactions whenever one is inserted, updated, or deleted.
create function public.recompute_profile_totals()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_user uuid := coalesce(new.user_id, old.user_id);
  month_start date := date_trunc('month', current_date);
begin
  update public.profiles
  set
    balance = (
      select coalesce(sum(case when type = 'income' then amount else -amount end), 0)
      from public.transactions where user_id = target_user
    ),
    monthly_income = (
      select coalesce(sum(amount), 0)
      from public.transactions
      where user_id = target_user and type = 'income' and date >= month_start
    ),
    monthly_expenses = (
      select coalesce(sum(amount), 0)
      from public.transactions
      where user_id = target_user and type = 'expense' and date >= month_start
    ),
    updated_at = now()
  where id = target_user;
  return coalesce(new, old);
end;
$$;

create trigger on_transaction_changed
  after insert or update or delete on public.transactions
  for each row execute function public.recompute_profile_totals();
