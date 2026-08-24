-- =============================================================================
-- 0002 — workspace_members, roles, and membership-scoped RLS
-- =============================================================================
--
-- Replaces the single-owner policies from 0001 with membership + roles, so a
-- workspace can have more than one person in it.
--
-- Run this in the Prospectra project's SQL editor. It is idempotent — running
-- it twice is safe.
--
-- Why the policies are written the way they are:
--   · Membership is checked through a SECURITY DEFINER helper rather than a
--     subquery inside each policy. A policy on workspace_members that queries
--     workspace_members recurses; the helper breaks that cycle.
--   · Write access is role-gated. viewer is read-only, everywhere.
--   · Every child table derives access from its workspace, never from its own
--     columns, so there is one place to get membership right.
-- =============================================================================

-- 1) Roles -------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'workspace_role') then
    create type public.workspace_role as enum ('owner', 'admin', 'member', 'viewer');
  end if;
end $$;

-- 2) Members -----------------------------------------------------------------
create table if not exists public.workspace_members (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id)        on delete cascade,
  role         public.workspace_role not null default 'member',
  invited_by   uuid references auth.users(id) on delete set null,
  joined_at    timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create index if not exists workspace_members_user_idx      on public.workspace_members(user_id);
create index if not exists workspace_members_workspace_idx on public.workspace_members(workspace_id);

-- 3) Backfill: every existing workspace owner becomes an owner member --------
insert into public.workspace_members (workspace_id, user_id, role, joined_at)
select w.id, w.owner_id, 'owner', w.created_at
from public.workspaces w
on conflict (workspace_id, user_id) do nothing;

-- 4) Membership helpers ------------------------------------------------------
-- SECURITY DEFINER so the function may read workspace_members without being
-- filtered by the very policies that call it. Both are STABLE, so Postgres can
-- cache the result within a statement instead of re-running per row.

create or replace function public.is_workspace_member(ws uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members m
    where m.workspace_id = ws and m.user_id = auth.uid()
  );
$$;

create or replace function public.can_write_workspace(ws uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members m
    where m.workspace_id = ws
      and m.user_id = auth.uid()
      and m.role in ('owner', 'admin', 'member')
  );
$$;

create or replace function public.is_workspace_admin(ws uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members m
    where m.workspace_id = ws
      and m.user_id = auth.uid()
      and m.role in ('owner', 'admin')
  );
$$;

revoke all on function public.is_workspace_member(uuid)  from public;
revoke all on function public.can_write_workspace(uuid)  from public;
revoke all on function public.is_workspace_admin(uuid)   from public;
grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.can_write_workspace(uuid) to authenticated;
grant execute on function public.is_workspace_admin(uuid)  to authenticated;

-- 5) Policies ----------------------------------------------------------------
alter table public.workspace_members enable row level security;

drop policy if exists members_read        on public.workspace_members;
drop policy if exists members_admin_write on public.workspace_members;
drop policy if exists members_self_insert on public.workspace_members;

-- Anyone in the workspace can see who else is in it.
create policy members_read on public.workspace_members
  for select using (public.is_workspace_member(workspace_id));

-- Only owners/admins manage the roster.
create policy members_admin_write on public.workspace_members
  for all
  using      (public.is_workspace_admin(workspace_id))
  with check (public.is_workspace_admin(workspace_id));

-- Bootstrap: the workspace owner may insert their own first membership row.
-- Without this the very first insert has no admin to authorise it.
create policy members_self_insert on public.workspace_members
  for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.workspaces w
      where w.id = workspace_id and w.owner_id = auth.uid()
    )
  );

-- Workspaces: members read, admins write, owner still governs creation.
drop policy if exists workspaces_owner_all on public.workspaces;
drop policy if exists workspaces_read      on public.workspaces;
drop policy if exists workspaces_insert    on public.workspaces;
drop policy if exists workspaces_update    on public.workspaces;
drop policy if exists workspaces_delete    on public.workspaces;

create policy workspaces_read on public.workspaces
  for select using (owner_id = auth.uid() or public.is_workspace_member(id));

create policy workspaces_insert on public.workspaces
  for insert with check (owner_id = auth.uid());

create policy workspaces_update on public.workspaces
  for update
  using      (public.is_workspace_admin(id) or owner_id = auth.uid())
  with check (public.is_workspace_admin(id) or owner_id = auth.uid());

create policy workspaces_delete on public.workspaces
  for delete using (owner_id = auth.uid());

-- Child tables derive access from the workspace, never from their own columns.
drop policy if exists onboarding_owner_all on public.workspace_onboarding;
drop policy if exists onboarding_read      on public.workspace_onboarding;
drop policy if exists onboarding_write     on public.workspace_onboarding;

create policy onboarding_read on public.workspace_onboarding
  for select using (public.is_workspace_member(workspace_id));

create policy onboarding_write on public.workspace_onboarding
  for all
  using      (public.can_write_workspace(workspace_id))
  with check (public.can_write_workspace(workspace_id));

drop policy if exists checklist_owner_all on public.workspace_checklist;
drop policy if exists checklist_read      on public.workspace_checklist;
drop policy if exists checklist_write     on public.workspace_checklist;

create policy checklist_read on public.workspace_checklist
  for select using (public.is_workspace_member(workspace_id));

create policy checklist_write on public.workspace_checklist
  for all
  using      (public.can_write_workspace(workspace_id))
  with check (public.can_write_workspace(workspace_id));

-- 6) updated_at ---------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists workspaces_touch          on public.workspaces;
drop trigger if exists workspace_members_touch   on public.workspace_members;
drop trigger if exists workspace_onboarding_touch on public.workspace_onboarding;

create trigger workspaces_touch
  before update on public.workspaces
  for each row execute function public.touch_updated_at();

create trigger workspace_members_touch
  before update on public.workspace_members
  for each row execute function public.touch_updated_at();

create trigger workspace_onboarding_touch
  before update on public.workspace_onboarding
  for each row execute function public.touch_updated_at();
