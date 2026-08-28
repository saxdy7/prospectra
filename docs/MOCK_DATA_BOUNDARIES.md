# Prospectra — Mock Data Boundaries

The rule this whole frontend milestone is built on: **the UI can look
finished before the backend exists, but it must never lie about what is
real.** This document is the map of every place that rule gets applied —
what's genuinely persisted, what's illustrative, and the exact language used
to tell them apart on screen.

## The three kinds of data on screen

### 1. Real — persisted, created by an actual user action

Lives in `localStorage`, written only when the user does something:

| Store | Key | Owns |
|---|---|---|
| `lib/onboarding/storage.ts` | `prospectra:workspace:v1` | Onboarding answers, checklist state, workspace name/logo/team size |
| `lib/workspace/store.ts` | `prospectra:data:v1` | Tables, rows, columns, search jobs, import jobs, audiences, campaigns, voice agents |
| `lib/demo-storage/store.ts` | `prospectra:product:v1` | Claygents, functions (custom), workflows, webhooks, MCP settings, concurrency reservations, WhatsApp deployment, phone numbers, knowledge-base collections/documents, integration "intent" clicks, activity log, API keys |
| `lib/demo-storage/preferences.ts` | `prospectra:pref:*` | Sidebar collapsed, table view mode, theme (`'light' \| 'dark'`, defaults to `'dark'`) — UI preference only, never workspace content |

**Nothing in these stores is pre-seeded.** A brand-new workspace starts at
genuine zero across every one of them. This was already the rule for the
pre-milestone build (`lib/workspace/store.ts`'s own comment: *"Nothing here
fabricates data. A table is empty until a user imports into it."*) — this
milestone extended the same rule to every new entity type rather than
relaxing it anywhere.

Every real store follows the same interface shape (`read()`/`write()`/
`clear()`, all `async` even though the localStorage implementation is
synchronous) specifically so swapping in Supabase later is a new
implementation of that interface, not a rewrite of every call site.

### 2. Demo — illustrative content from `lib/mock-data/`, always labelled

Lives in static, version-controlled TypeScript files, never `localStorage`.
Used only to show *what a real result would look like* once a provider is
connected — never presented as something that actually happened.

| File | Illustrates |
|---|---|
| `companies.ts` (18) | Company-search results, campaign/audience member previews |
| `contacts.ts` (20) | People-search results |
| `local-businesses.ts` (18) | Local-business search results |
| `jobs.ts` (14) | Job-search results |
| `call-logs.ts` | A voice agent's post-call metrics + one full transcript, before that agent has placed a single real call |
| `analytics.ts` | The Analytics page's call-performance charts, below the real workspace-counts block |

**Every page that renders one of these carries a visible `DemoTag`** —
"Demo data", never colour alone. The `SearchResultsPanel` component
(§C of the UI spec) bakes this in structurally: the demo preview table is
always in its own labelled panel, physically separated from the real
"Saved searches" list above it.

### 3. Static reference content — real, but not "demo"

A third category that is easy to mis-file as either of the above:

| File | Why it isn't "demo data" |
|---|---|
| `functions.ts` (16 built-ins) | These are the actual formula catalog — like Excel's function list. They aren't standing in for a future live feature; a `SUM`-style function registry is inherently static reference content |
| `claygent-templates.ts` (4) | Real starter prompts a user can copy and edit. The *template* is real; only *running* it against live data needs a provider |
| `integrations.ts` (19) | Real, accurate metadata about what Prospectra can eventually connect to. Every single row is honestly `not_connected`/`coming_soon` — see below |
| `workflow-templates.ts` (3) | Real starter graphs a user can load into the (also real, also non-executing) canvas |

These are never tagged `DemoTag`, because tagging them "demo" would
incorrectly imply they become something *different* once a backend exists —
they don't; the catalog is the catalog.

## The exact vocabulary, and when each word applies

| Word | Means | Example |
|---|---|---|
| **Demo data** | This content is illustrative, sourced from a static file, not from anything that happened | The result-preview table under any find-leads search |
| **Simulation** | This *interaction* is fully working, but nothing behind it is real (no model call, no phone line) | Voice-agent test-call page; TTS/STT playground |
| **Not connected** | A specific provider integration this feature needs does not exist yet | Every row on `/app/integrations`; the phone-numbers empty state |
| **Coming soon** | The feature itself — not just its provider — isn't built yet | Table "Views" tab; Settings → Branding/Security/Members |

A page never mixes these up. "Not connected" is reserved for things that are
otherwise fully built and are only missing a credential; "coming soon" is
for UI that doesn't exist at all yet.

## Hard rules, and where they're enforced

1. **Never imply mock data came from a real provider.** Enforced by the
   `DemoTag` always sitting inside the same visual block as the data it
   labels, not off in a corner — see `SearchResultsPanel`,
   `[agentId]` Post-call metrics/Conversations tabs, and the Analytics
   page's below-the-fold charts.
2. **Never use real personal information.** Every name, email, and phone
   number in `lib/mock-data/` is fictional. Phone numbers use plausible
   country-code formatting but are not allocated numbers. Company domains
   use `.example`/`.io`/`.ai`/`.in` TLDs on names invented for this project.
3. **Never fake a live/active/paid/connected state.** No integration ever
   shows `connected`. No credit balance is invented (the 500-credit grant
   shown in Settings/the sidebar meter is the one real, static number every
   workspace actually starts with per onboarding — not a mock). No call is
   ever shown as currently in progress except inside the explicitly-labelled
   test-call simulation.
4. **Empty is not the same as zero.** A metric that has never run (open
   rate, connect rate on a campaign that hasn't sent) renders as an
   `EmptyState` explaining why, never as `0%` — a zero implies something ran
   and failed, which didn't happen. This rule predates this milestone
   (`AnalyticsSection`'s original comment: *"Showing zeroes now would
   suggest something ran and performed badly — nothing has run at all"*)
   and was carried into every new page that has the same shape of problem
   (campaign performance, phone-number call stats, webhook deliveries).
5. **A "Send"/"Connect"/"Buy"/"Run" action never silently no-ops.** Every one
   of these either opens a `ConfirmDialog` that states plainly what's
   missing (see campaign "Send"), is a `disabled` button with a `title`
   explaining why (Integrations "Connect", phone-numbers "Buy a number"),
   or performs a real, clearly-scoped local action and says so (voice-agent
   "Save version", table "Add column").

## What changes when a real backend/provider lands

Nothing in the UI needs to change shape — only the data source swaps:

- `lib/workspace/store.ts` and `lib/demo-storage/store.ts`'s
  `localDataStore`/`localProductStore` get a Supabase-backed sibling behind
  the same interface (already the documented `TODO(backend)` pattern in both
  files).
- Each `lib/mock-data/*.ts` file's contents get replaced by a real
  `Provider` implementation (the interface is already specified in
  `lib/types/models.ts`'s `SearchProvider`/`EnrichmentProvider`/
  `EmailProvider`/`TelephonyProvider`/`TTSProvider`/`STTProvider`/
  `LLMProvider` types) — the UI that currently renders `DEMO_LOCAL_BUSINESSES`
  renders real `SearchResult[]` instead, through the same table/row
  components.
- Every `DemoTag`/`not_connected` state flips to real once
  `IntegrationConnection.state` genuinely reaches `'connected'` — that field
  already exists and is already read by the UI logic, it just never gets
  set to anything but `'intent'` in this milestone.
