-- =============================================================================
-- 0001 — workspaces, onboarding, checklist
-- =============================================================================
-- ALREADY APPLIED to the Prospectra project (2026-08-24). Recorded here so the
-- migration history is complete and reproducible on a fresh project.
-- Superseded in part by 0002, which replaces the single-owner policies below
-- with membership + roles.
-- =============================================================================

create table if not exists public.workspaces (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users(id) on delete cascade,
  name       text not null check (char_length(name) between 2 and 80),
  logo_url   text,
  team_size  text check (team_size in ('solo','2-10','11-50','51+')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists workspaces_owner_idx on public.workspaces(owner_id);

create table if not exists public.workspace_onboarding (
  workspace_id uuid primary key references public.workspaces(id) on delete cascade,
  version      int  not null default 1,
  step         int  not null default 0,
  goal         text,
  data_source  text,
  crm_intent   text[] not null default '{}',
  prepare      text[] not null default '{}',
  calling      jsonb  not null default '{"interests":[]}'::jsonb,
  completed_at timestamptz,
  updated_at   timestamptz not null default now()
);

create table if not exists public.workspace_checklist (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  item_id      text not null,
  done         boolean not null default false,
  primary key (workspace_id, item_id)
);

alter table public.workspaces           enable row level security;
alter table public.workspace_onboarding enable row level security;
alter table public.workspace_checklist  enable row level security;

-- Single-owner policies. 0002 replaces these with membership-scoped ones.
drop policy if exists workspaces_owner_all on public.workspaces;
create policy workspaces_owner_all on public.workspaces
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists onboarding_owner_all on public.workspace_onboarding;
create policy onboarding_owner_all on public.workspace_onboarding
  for all
  using (exists (select 1 from public.workspaces w
                 where w.id = workspace_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.workspaces w
                 where w.id = workspace_id and w.owner_id = auth.uid()));

drop policy if exists checklist_owner_all on public.workspace_checklist;
create policy checklist_owner_all on public.workspace_checklist
  for all
  using (exists (select 1 from public.workspaces w
                 where w.id = workspace_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.workspaces w
                 where w.id = workspace_id and w.owner_id = auth.uid()));
