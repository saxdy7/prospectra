# Prospectra — Frontend Route Inventory

Every route in the app, what it's for, its primary action, which states it
supports, and — critically — what on the page is real (backed by
`localStorage` via `lib/workspace/store.ts` / `lib/demo-storage/store.ts`)
versus demo/illustrative (backed by `lib/mock-data/`). See
`docs/MOCK_DATA_BOUNDARIES.md` for the rules that govern the latter, and
`docs/UI_IMPLEMENTATION_SPEC.md` for the visual system every route inherits.

**Shared across every `/app/*` route**, not repeated per row below:

- Auth/onboarding gate: `useWorkspace()` → no session → `/signin`; no
  completed onboarding → `/onboarding`. Renders `PageSkeleton` while
  resolving.
- Shell: `src/app/app/layout.tsx` → `AppShell` (sidebar, compact top bar,
  `ToastProvider`, persistent AI dock). Individual pages render only their
  content.
- Theme: the product defaults to the dark Prospectra theme on every
  first-time visit. Light is available from the header toggle as an
  explicit, persisted opt-in — it never overrides the initial dark
  presentation. See `docs/UI_IMPLEMENTATION_SPEC.md` §0.
- Keyboard: every control is a real `<button>`/`<input>`/`<a>`/`<Link>` —
  no `div onClick`. Drawers and dialogs trap focus and close on Escape.
  Global focus ring: 2px `--lp-blue-mid`, 3px offset.
- Responsive: sidebar → drawer below 900px; tables scroll horizontally
  rather than compress; touch targets ≥44px via `.pa-btn`/`.pa-icon-btn`
  sizing.
- Reduced motion: the global `.pa` `prefers-reduced-motion` block collapses
  every transition/animation duration to ~0, including the shimmer,
  drawer/dialog/toast entrances.

---

## A. Public and onboarding

| Route | Purpose | Primary action | States | Notes |
|---|---|---|---|---|
| `/` | Marketing landing page | Start Prospecting Free → `/signup` | — | Light-themed landing surface (`.lp`), independent of the product's dark default |
| `/signin` | Sign in | Sign in | default, error (bad credentials), loading | Real Supabase auth |
| `/signup` | Create account | Create account | default, error, loading, email-confirmation-sent | Real Supabase auth; redirects to `/onboarding` |
| `/forgot-password` | Password reset | Send reset link | default, error, sent | Real Supabase auth |
| `/onboarding` | 5-step workspace setup | Continue | per-step validation, saved-indicator, finish | Already dark by default. See §3 of the UI spec |

## B. Home

| Route | Purpose | Primary action | States |
|---|---|---|---|
| `/app` | Orient the user, surface the next useful action | The onboarding-computed "recommended next step" | Loading (skeleton), honest-zero first-run, populated once tables/audiences/campaigns/agents exist |

Real: workspace name/logo/team size, setup checklist (persisted,
dismissible), quick-action tiles (route to the relevant page), recent
activity (only real onboarding-derived events — never invented), table/row
counts. The "Getting started guide" card links to real sections of
`/app/help`. The "Calling setup" card only renders when onboarding recorded
interest in calling.

## C. Lead sourcing (`/app/find-leads/**`)

| Route | Purpose | Primary action | Fields |
|---|---|---|---|
| `/app/find-leads` | Hub — five cards, one per search kind | Pick a kind | — |
| `/app/find-leads/local-businesses` | Map-style search | Save search | Category, location, radius, min rating, result limit |
| `/app/find-leads/companies` | Company-list builder | Save search | Industry, size, location, keywords, type, technology, limit |
| `/app/find-leads/people` | People-list builder | Save search | Role, seniority, department, company, location, limit |
| `/app/find-leads/jobs` | Job/hiring-signal search | Save search | Title, location, remote preference, skills, seniority, date posted |
| `/app/find-leads/lookalikes` | Similar-company search | Save search | Seed company, match criteria, limit |

Real: every search saves as a genuine `SearchJob` (`draft` status) in
`WorkspaceData.searchJobs`, scoped by `kind`, and appears in the "Saved
searches" list with a real `JobStatusPill`. Demo: the "what a result row
looks like" preview table on each page, sourced from
`lib/mock-data/{local-businesses,companies,contacts,jobs}.ts` and always
carrying a `DemoTag`. No search ever produces real results — a provider
gate says so plainly. Empty state: "No searches yet" per kind.

## D. Tables and imports

| Route | Purpose | Primary action | States |
|---|---|---|---|
| `/app/tables` | Directory | New table / Import CSV | empty, populated (searchable `DataTable`) |
| `/app/tables/[tableId]` | Reactive grid: Grid / Views / Activity tabs | Add rows | empty, loading (skeleton rows), populated, not-found (invalid id → friendly message + back link) |
| `/app/imports` | Import history | New import | empty, populated |
| `/app/imports/new` | CSV upload → column mapping → validation preview → commit | Import | pick, map, done |

Real: tables/rows/columns are genuine, persisted `DemoTable`/`DemoRow`
records. CSV import parses the actual file client-side, dedupes, validates,
and reports real counts — nothing is fabricated. Grid supports real
search/sort/multi-select (`src/components/workspace/tables/DataTable.tsx`,
kept from the pre-milestone build). Demo/gated: the "Add column" drawer's
`enrichment`/`ai_formula` column types explain they activate once a
provider connects; "Auto-run" carries a `DemoTag`; the "Views" tab is an
honest "not built yet" state (`coming-soon`); "Activity" is an honest empty
state (no per-table event log exists yet).

## E. Research and automation

| Route | Purpose | Primary action | Notes |
|---|---|---|---|
| `/app/claygents` | Starter templates + your agents | New research agent | Templates (Prospecting, Account Scoring, Contact Scoring, Copywriting) are real static content from `lib/mock-data/claygent-templates.ts`, not a live provider |
| `/app/claygents/new` | Prompt, input description, output columns, run settings | Save | Pre-fills from `?template=` |
| `/app/functions` | Formula/enrichment registry | Create function | 16 built-in functions (`lib/mock-data/functions.ts`) + real custom ones a user creates, both searchable/filterable by category |
| `/app/workflows` | Templates + your workflows + visual canvas | New workflow | `WorkflowCanvas`: real drag-to-move nodes, click-to-connect edges, editable labels. **Nothing executes** — this is explicitly a frontend-only builder |
| `/app/mcp` | Client permissions, credit defaults, function visibility | Copy endpoint | Endpoint URL is real (workspace-derived); client "connections" are honestly `not_connected` — authorizing a real client needs account-level API keys, which don't exist yet |

## F. Audiences and campaigns

| Route | Purpose | Primary action | States |
|---|---|---|---|
| `/app/audiences` | Directory | New audience | empty (no tables), empty (no audiences), populated |
| `/app/audiences/[audienceId]` | Member table + linked campaigns | Start a campaign | not-found, empty members, populated |
| `/app/campaigns` | Directory, tabbed by channel/status | New campaign | Tabs: All / Email / Voice / WhatsApp / Drafts / Completed |
| `/app/campaigns/new` | 4-step wizard: Audience → Channel → Draft → Review | Save draft | Per-step validation; accepts `?audience=` to preselect |
| `/app/campaigns/[campaignId]` | Summary, sequence, members, honestly-empty performance | Send (→ confirms no provider is connected) | not-found |

Real: audiences are real slices of real tables; campaigns are real drafts
with real steps, persisted. "Send" opens a `ConfirmDialog` that states no
provider is connected and offers to mark the draft `completed` **as a
demo-only state change** — it never sends anything. Performance numbers
are an honest empty state, not zeroes (a `0%` open rate would imply
something sent and failed; nothing sent).

## G. Voice studio

| Route | Purpose | Tabs / steps |
|---|---|---|
| `/app/voice-agents` | Directory | — |
| `/app/voice-agents/new` | 6-step create flow | Name → Role → Languages & voice → First message → Tools → Preview |
| `/app/voice-agents/[agentId]` | Full studio | Prompt, Branches, Agent settings, Speech, Tools, Phone numbers, Post-call metrics, Conversations, Widget |
| `/app/voice-agents/[agentId]/test` | Web-call sandbox | Voice orb, transcript, canned-response simulation |
| `/app/voice-playground` | Hub | — |
| `/app/voice-playground/tts` | Text-to-speech preview | Voice/speed/sample-rate controls, mocked waveform player |
| `/app/voice-playground/stt` | Speech-to-text preview | Simulated recording, PII/PCI redaction toggles, custom vocabulary |
| `/app/voice-playground/voice-cloning` | Voice cloning | Reference upload, explicit consent checkbox (required to submit) |
| `/app/knowledge-base` | Collections/documents | Split pane; add via URL (file upload is local-only) |
| `/app/concurrency` | Capacity allocation | Reserve capacity per agent; visual bar of reserved vs. shared pool |
| `/app/phone-numbers` | Number directory | Honest empty state — purchasing needs a telephony provider |
| `/app/whatsapp` | Deployment | Agent selection (real), number connection (honestly not-connected), conversation preview (demo) |

Real: agent name/prompt/languages/voice/tools/versions all persist and
version on every save (`agent.versions` grows). Concurrency reservations
persist. Demo, always tagged: Post-call metrics and Conversations
(`lib/mock-data/call-logs.ts` — this agent has placed zero real calls, the
page says so before showing the illustrative rows), the TTS player, the STT
transcript, the WhatsApp conversation preview. The test-call page says
**"Simulation mode"** explicitly — it is a canned back-and-forth, not a
model call, and never claims otherwise.

## H. Analytics and operations

| Route | Purpose | Notes |
|---|---|---|
| `/app/analytics` | Overview, phone performance, call patterns, daily stats, agent leaderboard | Top block ("Workspace — live counts") is 100% real derived from `WorkspaceData`. Everything below a `DemoTag`-labelled divider is `lib/mock-data/analytics.ts` |
| `/app/activity` | Filterable event feed | 100% real — every entry comes from `logActivity()` calls made by other pages when the user does something (create table, save search, draft campaign, …). Nothing pre-seeded |
| `/app/integrations` | Directory across CRM/enrichment/LLM/email/telephony/storage, with search + category filters | Every item `not_connected` or `coming_soon`; "Connect" is disabled on every card. "Request integration" opens `FeatureRequestModal` |
| `/app/webhooks` | Endpoints + delivery log | Endpoints are real, persisted `WebhookEndpoint` records with a real (random) secret ref. Delivery log is an honest empty state — no event has ever fired one |
| `/app/invoices` | Billing/subscription history | Honest empty state — nothing has been billed; invoices appear once a payment provider is connected and a plan is active |
| `/app/settings` | General / Plan / Credits / Members / Branding / Notifications / Security, in a left mini-nav | General (name, logo, team size, destructive reset) is fully real. Plan shows real pricing-card content (Starter/Growth/Scale) with monthly/yearly toggle; "Upgrade" shows a toast — billing isn't connected. Members/Branding/Security are honest "coming soon" panels. Credits shows the real static 500-credit starting grant. Notification toggles persist locally but state plainly that delivery needs a connected email address |
| `/app/help` | Searchable guide directory | Static content; guide entries without a written article show a toast ("This guide is being written") instead of a dead link. Real "Request a feature" modal |

---

## Route count

**45 page routes** + `/auth/callback` (server route, not a page) = 46 total.

Breakdown: 5 public/onboarding + 1 home + 6 find-leads + 4 tables/imports +
5 research/automation + 5 audiences/campaigns + 12 voice + 7
analytics/operations (including `/app/invoices`).

## Verification performed

- `npx tsc --noEmit` — clean.
- `npm run lint` — clean (0 errors; internal cross-route links use
  `next/link`'s `Link` per `@next/next/no-html-link-for-pages`).
- Live `curl` sweep of every route on `npm run dev`, including the dynamic
  routes with a placeholder id (`/app/tables/abc`, etc., to confirm the
  not-found empty state renders rather than crashing).
- Not verified from this environment (no browser available): actual visual
  rendering, mobile viewport behaviour, and screen-reader announcement —
  these were built to the documented rules (§8/§9 of the UI spec) but a
  human pass with a real browser is the honest remaining step.
