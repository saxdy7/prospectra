# Prospectra — Product Blueprint & Data Model

Companion to `UI_IMPLEMENTATION_SPEC.md`. That document owns how things look;
this one owns what exists, how it is stored, and in what order it gets built.

**Governing principle:** build provider *interfaces*, not integrations, and
never fake a capability. A demo state that says "demo" is fine. A fabricated
search result is not.

---

## 0. Current state (2026-08-25)

| Area | Status |
|---|---|
| Landing, auth | Shipped |
| Onboarding (5 steps) | Shipped, local persistence |
| `/app` dashboard | Shipped, tailored from onboarding |
| Supabase Auth | **Connected** — signup/signin/callback live |
| `workspaces`, `workspace_onboarding`, `workspace_checklist` | **Created with RLS** |
| Onboarding → Supabase write | Wired (`syncWorkspaceToSupabase`), best-effort on finish |
| Everything below §Phase 3 | Not started |

> The original instruction said "prepare for Supabase but do not connect until
> env vars are available." They became available and were connected at the
> user's direction, so Phase 2 is partly complete ahead of this plan. Noted
> rather than silently reordered.

---

## 1. Module map

| # | Module | Phase |
|---|---|---|
| 1 | Identity & workspaces | 1–2 |
| 2 | Credits & billing foundation | 4 |
| 3 | Lead sourcing | 3–4 |
| 4 | Reactive table engine | 3 |
| 5 | Enrichment & AI research | 4 |
| 6 | Audiences & outreach | 5 |
| 7 | Voice & calling | 6 |
| 8 | Integrations & developer platform | 4–6 |

---

## 2. Data model

Conventions for every table:

- `id uuid primary key default gen_random_uuid()`
- `workspace_id uuid not null references workspaces(id) on delete cascade`
  (except `profiles`, `workspaces`)
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- RLS on, scoped through workspace membership
- Status columns are Postgres enums, never free text
- Anything provider-derived keeps `source`, `provider_request_id`,
  `fetched_at`

**Phase key:** ● required in phase 1 · ◐ deferred · ○ provider-managed

### 2.1 Identity

| Model | Key fields | Phase | Access |
|---|---|---|---|
| **Profile** | `user_id` → `auth.users`, `full_name`, `avatar_url`, `locale` | ● | Self only |
| **Workspace** | `owner_id`, `name`, `logo_url`, `team_size`, `plan` | ● | Members |
| **WorkspaceMember** | `workspace_id`, `user_id`, `role`, `invited_by`, `joined_at` | ◐ | Members read; admin+ write |
| **OnboardingData** | `workspace_id` (PK), `version`, `step`, `goal`, `data_source`, `crm_intent[]`, `prepare[]`, `calling jsonb`, `completed_at` | ● | Members |
| **SetupChecklistItem** | `workspace_id`, `item_id`, `done` | ● | Members |

`role`: `owner` \| `admin` \| `member` \| `viewer`.
Owner ≠ deletable; last owner cannot be demoted.

### 2.2 Credits

| Model | Key fields | Phase |
|---|---|---|
| **CreditWallet** | `workspace_id`, `kind`, `balance`, `reserved` | ◐ |
| **CreditLedgerEntry** | `wallet_id`, `delta`, `reason`, `ref_type`, `ref_id`, `balance_after` | ◐ |
| **UsageEvent** | `workspace_id`, `kind`, `quantity`, `unit_cost`, `ref_type`, `ref_id` | ◐ |
| **Plan / Entitlement** | `plan`, `feature`, `limit`, `period` | ◐ |

`kind`: `enrichment` \| `research` \| `voice_minutes` \| `storage`.

Ledger is append-only; `balance` is a materialised projection, never edited
directly. **Until billing is connected the UI shows a labelled placeholder —
never an invented live balance.**

### 2.3 Lead sourcing

| Model | Key fields | Phase |
|---|---|---|
| **SearchProject** | `workspace_id`, `name`, `kind` | ◐ |
| **SearchJob** | `project_id`, `kind`, `filters jsonb`, `status`, `provider`, `provider_request_id`, `result_count`, `error jsonb`, `retry_count` | ◐ |
| **SearchResult** | `job_id`, `raw jsonb`, `normalised jsonb`, `dedupe_key`, `imported_row_id` | ◐ |

`kind`: `local_business` \| `company` \| `people` \| `job`.
`status`: `draft` \| `queued` \| `running` \| `completed` \| `failed` \| `cancelled`.

### 2.4 Table engine

| Model | Key fields | Phase |
|---|---|---|
| **Table** | `workspace_id`, `name`, `kind`, `row_count` | ◐ |
| **TableColumn** | `table_id`, `key`, `label`, `type`, `position`, `config jsonb` | ◐ |
| **TableRow** | `table_id`, `position`, `status`, `source`, `dedupe_key` | ◐ |
| **TableCell** | `row_id`, `column_id`, `value jsonb`, `status`, `provider_meta jsonb` | ◐ |
| **TableView** | `table_id`, `name`, `filters jsonb`, `sorts jsonb`, `hidden_columns[]` | ◐ |
| **ImportJob** | `workspace_id`, `table_id`, `file_path`, `mapping jsonb`, `status`, `row_counts jsonb` | ◐ |
| **TableActivity** | `table_id`, `actor_id`, `action`, `detail jsonb` | ◐ |

Column `type`: `text` \| `url` \| `email` \| `phone` \| `number` \| `rating`
\| `status` \| `date` \| `enrichment` \| `ai_formula`.
Cell `status`: `empty` \| `queued` \| `running` \| `filled` \| `failed` \| `skipped`.

> **Scale note.** `TableCell` is the highest-cardinality table in the system
> (rows × columns). Partition by `table_id` and index `(row_id, column_id)`
> before it is loaded, not after.

### 2.5 Enrichment

| Model | Key fields | Phase |
|---|---|---|
| **EnrichmentProvider** | `workspace_id`, `provider`, `status`, `credential_ref` | ◐ |
| **EnrichmentJob** | `table_id`, `column_id`, `provider_chain[]`, `status`, `row_total`, `row_done` | ◐ |
| **EnrichmentResult** | `job_id`, `row_id`, `provider`, `value jsonb`, `confidence`, `credits_used`, `error jsonb`, `provider_request_id` | ◐ |
| **ResearchTask** | `row_id`, `prompt`, `model`, `output jsonb`, `tokens`, `status` | ◐ |

Waterfall semantics: try providers in `provider_chain` order, stop at first
hit, charge only on a hit, record which provider answered. A row that exhausts
the chain is **flagged**, never silently blank.

### 2.6 Contacts, audiences, outreach

| Model | Key fields | Phase |
|---|---|---|
| **Company** | `workspace_id`, `name`, `domain`, `industry`, `headcount`, `location`, `source`, `enrichment jsonb` | ◐ |
| **Contact** | `workspace_id`, `company_id`, `full_name`, `title`, `email`, `phone`, `consent_state`, `source` | ◐ |
| **Audience** | `workspace_id`, `name`, `source_table_id`, `filters jsonb`, `member_count` | ◐ |
| **AudienceMember** | `audience_id`, `contact_id`, `state` | ◐ |
| **Campaign** | `workspace_id`, `name`, `channel`, `status`, `audience_id` | ◐ |
| **CampaignStep** | `campaign_id`, `position`, `delay_days`, `template jsonb` | ◐ |
| **CampaignMember** | `campaign_id`, `contact_id`, `state`, `current_step` | ◐ |
| **MessageEvent** | `campaign_member_id`, `type`, `occurred_at`, `provider_message_id` | ○ |
| **Suppression** | `workspace_id`, `email_or_phone`, `reason`, `source` | ◐ |

`consent_state`: `unknown` \| `opted_in` \| `opted_out` \| `suppressed`.

> **Hard rule.** No message sends without: a configured provider, a verified
> sender identity, a non-suppressed recipient, and an explicit user action.
> Suppression is checked at send time, not at list-build time.

### 2.7 Voice

| Model | Key fields | Phase |
|---|---|---|
| **VoiceAgent** | `workspace_id`, `name`, `status`, `current_version_id` | ◐ |
| **VoiceAgentVersion** | `agent_id`, `version`, `prompt`, `first_message`, `model`, `languages[]`, `voice`, `tools jsonb`, `published_at` | ◐ |
| **KnowledgeBaseCollection** | `workspace_id`, `name` | ◐ |
| **KnowledgeBaseDocument** | `collection_id`, `title`, `file_path`, `url`, `status`, `chunk_count` | ◐ |
| **PhoneNumber** | `workspace_id`, `e164`, `country`, `provider`, `status`, `assigned_agent_id` | ○ |
| **CallCampaign** | `workspace_id`, `audience_id`, `agent_id`, `from_number_id`, `status`, `schedule jsonb`, `timezone`, `calling_window jsonb` | ○ |
| **CallLog** | `call_campaign_id`, `contact_id`, `status`, `started_at`, `duration_s`, `outcome`, `provider_call_id` | ○ |
| **CallTranscript** | `call_log_id`, `turns jsonb`, `redacted bool` | ○ |
| **CallSummary** | `call_log_id`, `summary`, `extracted jsonb` | ○ |

`VoiceAgent.status`: `draft` \| `published` \| `archived`.

> **Hard rule.** No real call until *all* of: telephony provider configured,
> number owned and verified, consent recorded, timezone + calling window
> enforced, and compliance copy shown. Until then the studio produces drafts
> and a sandbox test only. Transcripts are PII/PCI-redacted server-side before
> storage.

### 2.8 Platform

| Model | Key fields | Phase |
|---|---|---|
| **IntegrationConnection** | `workspace_id`, `kind`, `state`, `external_account_id`, `credential_ref`, `last_sync_at` | ◐ |
| **ApiKey** | `workspace_id`, `name`, `prefix`, `hash`, `last_used_at`, `revoked_at` | ◐ |
| **WebhookEndpoint** | `workspace_id`, `url`, `events[]`, `secret_ref`, `active` | ◐ |
| **WebhookDelivery** | `endpoint_id`, `event`, `status`, `attempts`, `response_code` | ◐ |
| **AuditLog** | `workspace_id`, `actor_id`, `action`, `target_type`, `target_id`, `meta jsonb` | ◐ |

`IntegrationConnection.state`: `intent` \| `connecting` \| `connected` \|
`error` \| `revoked`. Onboarding CRM answers land as **`intent`** — a recorded
preference, not a connection.

**Credentials are never columns.** `credential_ref` points at Supabase Vault or
an equivalent secret store. API keys store a hash plus a display prefix, never
the key.

---

## 3. Supabase implementation

- **Auth** — Supabase Auth is the identity source. `auth.uid()` is the anchor
  for every policy.
- **RLS on every workspace-owned table**, without exception. The canonical
  predicate:

```sql
using (exists (
  select 1 from workspace_members m
  where m.workspace_id = <table>.workspace_id
    and m.user_id = auth.uid()
))
```

  Write policies additionally check `m.role in ('owner','admin','member')`;
  `viewer` is read-only. The current single-owner policies
  (`owner_id = auth.uid()`) migrate to this form when `workspace_members`
  lands.
- **Service-role key never reaches the browser.** Browser uses the publishable
  key under RLS; workers use service-role server-side only.
- **Storage buckets:** `workspace-logos`, `csv-imports`, `kb-documents`,
  `voice-samples`, `call-assets` — all path-prefixed by `workspace_id` with
  membership-scoped policies.
- **Realtime** for table cell updates, job status and campaign/call progress.
- **Queue/worker** for scraping, enrichment, imports, campaigns and calls.
  Long-running work never runs in a browser request or a route handler.

---

## 4. Provider interfaces

Every external capability sits behind one interface. Swapping vendors is an
implementation change, never a UI change.

```ts
interface Provider<Cfg, Req, Res> {
  readonly id: string;
  configStatus(): 'unconfigured' | 'configured' | 'invalid';
  credentialStatus(): 'missing' | 'present' | 'expired';
  submit(req: Req): Promise<{ providerRequestId: string }>;
  poll(providerRequestId: string): Promise<JobState<Res>>;
  normalise(raw: unknown): Res;
  classifyError(e: unknown): { retryable: boolean; code: string; message: string };
  usage(raw: unknown): { units: number; kind: CreditKind; cost?: number };
}
```

Implementations: `SearchProvider`, `EnrichmentProvider`, `EmailProvider`,
`TelephonyProvider`, `TTSProvider`, `STTProvider`, `LLMProvider`.

> **Sourcing policy.** No brittle browser automation against Google Maps,
> LinkedIn, job boards or CRMs in production. Use approved APIs, licensed data
> providers, or user-authorised integrations. Every stored record keeps its
> `source` and `provider_request_id` so provenance is always answerable.

---

## 5. Data flows

**A — Local business**
`SearchJob(draft)` → filters → `queued` → worker → `SearchResult[]` →
user selects → `TableRow[]` + `Company`/`Contact` → optional `EnrichmentJob` →
`Audience` → campaign draft.

**B — CSV**
Upload to Storage → `ImportJob` → column mapping → validate + dedupe →
`TableRow[]` → optional `Contact`/`Company` → offer enrichment.
Invalid rows are reported, never dropped silently.

**C — Voice**
`VoiceAgent(draft)` → prompt, languages, voice, KB refs → sandbox web test →
*(gated)* number assignment → `CallCampaign` from an `Audience` → workers
produce `CallLog` + transcript + summary + outcome.
Blocked before the gate: consent, provider config, number ownership, timezone,
calling window, compliance.

---

## 6. Phases

| Phase | Scope | Acceptance |
|---|---|---|
| **1** ✅ | Onboarding, local persistence, dashboard, checklist, icon system | Flow completes; state survives reload; build clean |
| **2** ◑ | Supabase Auth, workspaces/members/RLS, real persistence, protected routes | Auth ✅, workspaces + RLS ✅, sync ✅; **`workspace_members` + role policies outstanding** |
| **3** | Tables/columns/rows, CSV import, search UI, job architecture | A demo table renders 1k rows; import maps and validates; jobs show real state |
| **4** | Approved provider integration, enrichment jobs, credit ledger | A real provider returns normalised rows; ledger balances; retry works |
| **5** | Audiences, campaign drafts, email integration | Draft built from an audience; send blocked without verified sender |
| **6** | Voice studio, KB, sandbox, telephony + compliance | Agent draft + version history; **no live call until every gate passes** |

Per phase: identify pages, components, tables, API contracts and acceptance
criteria; label demo behaviour visibly; preserve the visual theme; run
type/build verification; leave landing and auth styling alone.

---

## 7. TypeScript types

Canonical types live in `src/lib/types/models.ts`. They mirror this schema and
are the contract the UI codes against, ahead of the tables existing — so a
component written in Phase 3 does not change shape in Phase 4.
