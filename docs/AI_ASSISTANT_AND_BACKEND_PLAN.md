# Prospectra — AI Assistant & Backend Plan

Companion to `docs/UI_IMPLEMENTATION_SPEC.md` and `docs/MOCK_DATA_BOUNDARIES.md`.
Those documents describe the frontend that exists today. This one describes
what has to be built **behind** it before the AI assistant (the floating
launcher in the bottom-left of every `/app/*` page, `src/components/app/AiAssistant.tsx`)
can do anything real, and how to build it safely.

Nothing in this document is implemented yet. The assistant UI currently
collects a prompt and shows a toast saying it isn't connected — that is
honest, and should stay that way until the pieces below exist.

---

## 1. What it needs to do

From the product conversation that shaped this: a user types something like

> "find 50 SaaS companies in Bangalore and email their founders"

and the assistant should, without the user touching a form:

1. Translate that into a **search** (People/Companies/Local businesses/Jobs/Lookalikes) with the right filters.
2. Land the results in a **table**.
3. Optionally build a **campaign** (choose audience → channel → draft copy → schedule) from the same instruction.
4. Trigger real **outreach** — email, WhatsApp, or a voice call — once a channel provider is connected.
5. Let the user **connect a data/automation provider** (Apify for scraping is the named example) by pasting an API key, the same way any MCP-style integration is added.

Every one of these already exists as a *manual* flow in the frontend. The
assistant's job is to drive those same flows from natural language — it is
not a separate product surface, it is a natural-language front end for the
actions that `/app/find-leads`, `/app/tables`, `/app/campaigns/new`,
`/app/voice-agents`, and `/app/integrations` already expose.

## 2. Non-negotiable safety rules

These apply regardless of implementation details:

- **Nothing sends, calls, spends, or deletes without an explicit user
  confirmation shown in the UI first.** The assistant may *draft* a campaign
  or *stage* a search; it may not send an email, place a call, or send a
  WhatsApp message without a review step identical to what a human would see
  clicking through the manual flow.
- **API keys are never visible to the model or the client after the user
  submits them.** Store them server-side, encrypted at rest, and only ever
  pass a reference (a provider-connection ID) into any prompt or tool call —
  never the raw key.
- **Every AI-initiated action is logged** the same way a human action would be
  (`logActivity`-equivalent, server-side), with which prompt produced it, so
  a workspace owner can audit what the assistant did.
- **Cost and rate limits are enforced server-side**, not by asking the model
  nicely — a runaway prompt should not be able to trigger 10,000 calls.
- **Scoped, revocable credentials.** A provider connection belongs to one
  workspace, can be tested before saving, and can be revoked instantly; a
  revoked connection must make every dependent tool call fail closed, not
  silently no-op.

## 3. Architecture sketch

```
User prompt (AiAssistant.tsx)
        │
        ▼
Assistant API route (new)  ── reads workspace context (tables, agents, campaigns)
        │
        ▼
LLM with tool-use            ── Claude via the Messages API, tool definitions below
        │
        ▼
Tool-call layer (new, server-side)
   ├─ search_leads(kind, filters)          → writes a SearchJob, same shape as the manual UI
   ├─ create_table(name, columns)          → writes a WorkspaceData table
   ├─ draft_campaign(audience, channel, …) → writes a DemoCampaign in 'draft' status only
   ├─ send_campaign(campaignId)            → BLOCKED until user confirms in UI
   ├─ place_call(agentId, contactId)       → BLOCKED until user confirms in UI
   ├─ send_whatsapp(...) / send_email(...) → BLOCKED until user confirms in UI
   └─ connect_provider(kind, credentialRef)→ only stores a reference; the raw
                                              key never reaches this layer or the model
        │
        ▼
Existing data layer (Supabase, once migrated off localStorage — see §6)
```

The tool-call layer is the important boundary: it is where "confirm before
sending" is enforced in code, not in a prompt. A tool that can cause a real
external effect (send, call, spend, delete) returns a **pending action** the
UI must render and the user must approve; only the approval step calls the
provider.

## 4. Provider connections (MCP-style)

`/app/integrations` already lists the target providers (CRM, enrichment,
LLM, email, telephony, storage) as "Not connected." The backend work is:

1. A `provider_connections` table: `id, workspace_id, provider, label,
   credential_ref (opaque), status, created_at, last_verified_at`.
2. Credentials themselves live in a secrets store, not that table —
   Supabase Vault, or an encrypted column with a server-only decryption key.
   The app database never holds a plaintext key.
3. A "Connect" flow per provider: paste key → server makes one test call to
   verify it → on success, store the reference and flip status to
   `connected`; on failure, show the error inline and store nothing.
4. Apify specifically: the scraping tool calls become thin wrappers around
   Apify actor runs, keyed off the workspace's stored Apify token. The
   *shape* of the result (companies/contacts/jobs) should still match the
   existing mock-data types in `src/lib/types/models.ts` so the frontend
   tables need no changes when real data starts arriving.
5. Same pattern for telephony (voice calling), email sending, and WhatsApp
   Business API — each is a `provider_connections` row plus a tool wrapper.

## 5. Data model additions

Beyond `provider_connections` above:

- `ai_conversations` — id, workspace_id, user_id, created_at.
- `ai_messages` — conversation_id, role, content, tool_calls (jsonb), created_at.
- `ai_actions` — the audit log: conversation_id, tool_name, input, output,
  status (`proposed` / `confirmed` / `executed` / `rejected`), created_at.
  This is what a "what did the AI do" screen in Settings would read from.

These are new tables, not a repurposing of the existing localStorage-backed
`WorkspaceData`/`ProductData` shapes — those stay as the demo-data contract
until the Supabase migration in §6 lands, at which point the AI's tool calls
and the manual UI's actions should write through the *same* server-side
functions, so the two paths can never drift out of sync.

## 6. Sequencing relative to the rest of the backend

This assistant depends on backend work that has to exist anyway (per the
"what's next" list at the end of `docs/UI_IMPLEMENTATION_SPEC.md`):
Supabase schema for tables/campaigns/agents, a real search/scrape provider,
real telephony/email/WhatsApp providers, and workflow execution. Recommended
order:

1. **Supabase data layer** for tables, searches, audiences, campaigns, voice
   agents — replacing `src/lib/workspace/store.ts` and
   `src/lib/demo-storage/store.ts`'s localStorage backing with real
   persistence, same TypeScript shapes so the frontend barely changes.
2. **One real data provider** (Apify) wired to the existing find-leads flows,
   manually — prove the tool wrapper works before the model ever calls it.
3. **`provider_connections` + the Integrations "Connect" flow**, generalized
   beyond Apify to email/telephony/WhatsApp.
4. **The assistant API route + tool-call layer**, tools calling the same
   server functions the manual UI now calls. Ship with only non-destructive
   tools live (search, draft table, draft campaign).
5. **The confirm-before-send step in the UI** for any tool that would send,
   call, or spend — build and test this before enabling those tools at all.
6. **`ai_actions` audit log surfaced in Settings**, so every AI-run action is
   visible and attributable.

## 7. What NOT to do

- Do not let the model construct or execute raw SQL/API calls directly —
  every effect goes through a named, reviewed tool function.
- Do not store provider API keys in `localStorage`, in a client-readable
  table, or in a prompt/log.
- Do not skip the confirmation step "just for the demo" — the confirmation
  step is the security boundary, not a UX nicety.
- Do not let `ai_actions` be deletable by the workspace whose actions it's
  logging — it is an audit trail, not a to-do list.
