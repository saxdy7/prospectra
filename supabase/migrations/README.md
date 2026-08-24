# Migrations

Applied in numeric order against the Prospectra Supabase project.

| File | Status | Notes |
|---|---|---|
| `0001_workspaces.sql` | **Applied** 2026-08-24 | workspaces, onboarding, checklist, single-owner RLS |
| `0002_workspace_members.sql` | **Pending** | members + roles; replaces 0001's policies |

## Running

Paste into the project's SQL editor and run, or `supabase db push` with the
CLI linked to the project. Both files are idempotent.

## Why these are files rather than applied directly

The Supabase MCP connection available to the agent resolves to a different
project (`Classera`), not Prospectra (`jdsrhkqeyraxjsdvouoe`). Applying through
it would have written the schema into the wrong database, so migrations are
committed here for a human to run against the right project.

To let the agent apply them directly, reconnect the Supabase connector using
the account that owns the Prospectra project.

## After 0002

`workspace_members` becomes the access source of truth. Role gates:

| Role | Read | Write | Manage roster |
|---|---|---|---|
| owner | ✅ | ✅ | ✅ |
| admin | ✅ | ✅ | ✅ |
| member | ✅ | ✅ | — |
| viewer | ✅ | — | — |
