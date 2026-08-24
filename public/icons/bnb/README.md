# Isometric icon assets

Locally stored isometric icons used as small accents in onboarding and the
workspace. **This directory is currently empty** — the UI runs on Lucide
fallbacks until approved assets are added here.

## Why it is empty

The request was for BnbIcons (https://bnbicons.com) artwork. Two blockers,
checked 2026-08-24:

**1. No verifiable licence.** `bnbicons.com` states no licence terms;
`/terms` and `/license` both 404; the pricing page lists credit tiers only.
A search snippet claimed "CC BY 4.0" — the article it came from does not say
that and cites no source. Treat that figure as unverified.

**2. No acquisition path.** BnbIcons is a credit-based AI generation service.
Assets require an account plus paid credits ($6 / $12), or credits earned by
posting on social media — none of which can be done on the project's behalf.

Shipping the artwork under these conditions would mean shipping images with no
established right to use them.

## To enable them later

1. Obtain the licence in writing, or choose a source with a clear licence
   (e.g. a CC0 / MIT isometric set). If attribution is required, add it to the
   site footer before shipping.
2. Save each file here using the exact filename from the manifest below.
3. In `src/lib/icons/registry.ts`, set `asset: '/icons/bnb/<file>'` on the
   matching entry. No other code changes — `IconIllustration` picks it up, and
   any file that fails to load falls back to Lucide at runtime.

## Format

PNG or WebP, square, 128×128 or 256×256, transparent background. Must read on
a light surface (`#f4f6fb`) — the frame is a soft blue well, so mid-tone
isometric art with its own colour works best. Rendered at 24–46px.

## Manifest

Generated from `src/lib/icons/registry.ts`. Every entry is on its Lucide
fallback.

| Registry key | File to add | Depicts | Fallback |
|---|---|---|---|
| `goal-local-business` | `goal-local-business.png` | Isometric map pin over a small storefront | `MapPin` |
| `goal-company-list` | `goal-company-list.png` | Isometric office building | `Building2` |
| `goal-find-people` | `goal-find-people.png` | Isometric group of profile cards or people | `UserSearch` |
| `goal-enrich-list` | `goal-enrich-list.png` | Isometric database stack with a sparkle | `Layers` |
| `goal-outreach` | `goal-outreach.png` | Isometric paper plane or message envelope | `Send` |
| `goal-voice-agent` | `goal-voice-agent.png` | Isometric microphone with a sound wave | `Mic` |
| `goal-explore` | `goal-explore.png` | Isometric compass or telescope | `Compass` |
| `source-local-search` | `source-local-search.png` | Isometric magnifier over a map | `Search` |
| `source-company-search` | `source-company-search.png` | Isometric magnifier over an office block | `Building2` |
| `source-people-search` | `source-people-search.png` | Isometric magnifier over a profile card | `Users` |
| `source-csv-import` | `source-csv-import.png` | Isometric spreadsheet file with an upload arrow | `FileSpreadsheet` |
| `source-crm-connect` | `source-crm-connect.png` | Isometric plug and socket, deliberately not yet joined | `Plug` |
| `source-blank-table` | `source-blank-table.png` | Isometric empty grid or table | `Table2` |
| `source-later` | `source-later.png` | Isometric hourglass or bookmark | `Compass` |
| `prep-verify` | `prep-verify.png` | Isometric shield with a tick | `ShieldCheck` |
| `prep-company-enrichment` | `prep-company-enrichment.png` | Isometric building with data cards fanning out | `Building2` |
| `prep-decision-makers` | `prep-decision-makers.png` | Isometric org chart with one node highlighted | `UserSearch` |
| `prep-tech-signals` | `prep-tech-signals.png` | Isometric chip or server stack | `Cpu` |
| `prep-ai-research` | `prep-ai-research.png` | Isometric binoculars or magnifier over a document | `Binoculars` |
| `prep-personalisation` | `prep-personalisation.png` | Isometric pen writing on a letter | `PenLine` |
| `prep-call-ready` | `prep-call-ready.png` | Isometric headset beside a contact card | `Headphones` |
| `prep-hiring-signals` | `prep-hiring-signals.png` | Isometric job board or briefcase with a badge | `Sparkles` |
| `prep-voice-draft` | `prep-voice-draft.png` | Isometric microphone beside a script page | `Mic` |
| `prep-knowledge-base` | `prep-knowledge-base.png` | Isometric stack of documents or a small library | `Database` |
| `prep-segments` | `prep-segments.png` | Isometric stacked layers splitting apart | `Layers` |
| `call-none` | `call-none.png` | Isometric muted or paused indicator | `Compass` |
| `call-web-test` | `call-web-test.png` | Isometric browser window with a headset — a test call, not a live one | `Headphones` |
| `call-outbound` | `call-outbound.png` | Isometric handset with an outgoing arrow | `PhoneOutgoing` |
| `call-inbound` | `call-inbound.png` | Isometric handset with an incoming arrow | `PhoneIncoming` |
| `call-analytics` | `call-analytics.png` | Isometric waveform resolving into a bar chart | `BarChart3` |
| `action-find-leads` | `action-find-leads.png` | Isometric magnifier over a map pin | `Search` |
| `action-import-data` | `action-import-data.png` | Isometric file with an upload arrow | `FileSpreadsheet` |
| `action-build-table` | `action-build-table.png` | Isometric grid being assembled | `Table2` |
| `action-enrich-contacts` | `action-enrich-contacts.png` | Isometric contact card gaining fields | `Sparkles` |
| `action-campaign-draft` | `action-campaign-draft.png` | Isometric paper plane over a sequence of steps | `Send` |
| `action-voice-draft` | `action-voice-draft.png` | Isometric microphone with a draft script | `Mic` |
| `empty-voice` | `empty-voice.png` | Larger isometric microphone and waveform, for an empty state | `Mic` |
| `empty-audiences` | `empty-audiences.png` | Larger isometric group of contact cards, for an empty state | `Users` |
| `empty-campaigns` | `empty-campaigns.png` | Larger isometric campaign sequence, for an empty state | `Send` |
| `empty-tables` | `empty-tables.png` | Larger isometric data grid, for an empty state | `Table2` |
| `empty-find-leads` | `empty-find-leads.png` | Larger isometric search scene, for an empty state | `Search` |
| `empty-analytics` | `empty-analytics.png` | Larger isometric dashboard chart, for an empty state | `BarChart3` |
| `empty-settings` | `empty-settings.png` | Larger isometric control panel, for an empty state | `Plug` |
| `next-step` | `next-step.png` | Isometric signpost or upward arrow, for the recommended action | `ArrowUpRight` |

**44 assets needed.**

