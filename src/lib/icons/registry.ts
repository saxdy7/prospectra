import {
  ArrowUpRight,
  BarChart3,
  Binoculars,
  Building2,
  Compass,
  Cpu,
  Database,
  FileSpreadsheet,
  Headphones,
  Layers,
  MapPin,
  Mic,
  PenLine,
  PhoneIncoming,
  PhoneOutgoing,
  Plug,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Table2,
  UserSearch,
  Users
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Central icon registry — the one place asset paths live.
 * =============================================================================
 *
 * Every illustrated slot in onboarding and the workspace resolves through here.
 * Each entry always carries a Lucide fallback, and *optionally* an `asset` path
 * pointing at a locally stored isometric icon under `public/icons/bnb/`.
 *
 * ## Current state: no BnbIcons assets are present
 *
 * Every `asset` below is intentionally undefined, so the UI renders the Lucide
 * fallback. That is not an oversight — it is the licensing position:
 *
 *   · bnbicons.com publishes no licence terms. `/terms` and `/license` both
 *     return 404, and neither the homepage nor the pricing page states what
 *     rights a generated icon carries.
 *   · It is a credit-based AI generation service, so assets cannot be obtained
 *     without an account and paid credits.
 *
 * Until someone with authority obtains assets under terms that permit use here,
 * shipping them would mean shipping art with no established right to it.
 *
 * ## Adding assets later
 *
 * 1. Save the approved file as `public/icons/bnb/<name>.png` (or .webp/.svg),
 *    using the filename already listed in `suggestedFile` below.
 * 2. Set `asset: '/icons/bnb/<name>.png'` on that entry.
 * 3. Nothing else changes. `IconIllustration` picks it up, and any file that
 *    fails to load falls back to Lucide at runtime.
 *
 * See `public/icons/bnb/README.md` for the full manifest.
 */

export type IconName =
  /* Step 2 — primary goal */
  | 'goal-local-business'
  | 'goal-company-list'
  | 'goal-find-people'
  | 'goal-enrich-list'
  | 'goal-outreach'
  | 'goal-voice-agent'
  | 'goal-explore'
  /* Step 3 — starting point */
  | 'source-local-search'
  | 'source-company-search'
  | 'source-people-search'
  | 'source-csv-import'
  | 'source-crm-connect'
  | 'source-blank-table'
  | 'source-later'
  /* Step 4 — what to prepare */
  | 'prep-verify'
  | 'prep-company-enrichment'
  | 'prep-decision-makers'
  | 'prep-tech-signals'
  | 'prep-ai-research'
  | 'prep-personalisation'
  | 'prep-call-ready'
  | 'prep-hiring-signals'
  | 'prep-voice-draft'
  | 'prep-knowledge-base'
  | 'prep-segments'
  /* Step 5 — calling */
  | 'call-none'
  | 'call-web-test'
  | 'call-outbound'
  | 'call-inbound'
  | 'call-analytics'
  /* Dashboard */
  | 'action-find-leads'
  | 'action-import-data'
  | 'action-build-table'
  | 'action-enrich-contacts'
  | 'action-campaign-draft'
  | 'action-voice-draft'
  | 'empty-voice'
  | 'empty-audiences'
  | 'empty-campaigns'
  | 'empty-tables'
  | 'empty-find-leads'
  | 'empty-analytics'
  | 'empty-settings'
  | 'next-step';

export interface IconSpec {
  /** Always present. Renders whenever `asset` is absent or fails to load. */
  fallback: LucideIcon;
  /**
   * Path to a locally stored asset, e.g. '/icons/bnb/goal-local-business.png'.
   * Undefined until an approved asset exists — never a remote URL.
   */
  asset?: string;
  /**
   * Alt text for when the image carries meaning on its own. Slots whose label
   * already states the meaning leave this undefined and render decoratively.
   */
  alt?: string;
  /** Filename to use when an approved asset is added. Keeps naming stable. */
  suggestedFile: string;
  /** What the artwork should depict, for whoever sources it. */
  brief: string;
}

export const ICONS: Record<IconName, IconSpec> = {
  /* ---------------- Step 2 — primary goal ---------------- */
  'goal-local-business': {
    fallback: MapPin,
    suggestedFile: 'goal-local-business.png',
    brief: 'Isometric map pin over a small storefront'
  },
  'goal-company-list': {
    fallback: Building2,
    suggestedFile: 'goal-company-list.png',
    brief: 'Isometric office building'
  },
  'goal-find-people': {
    fallback: UserSearch,
    suggestedFile: 'goal-find-people.png',
    brief: 'Isometric group of profile cards or people'
  },
  'goal-enrich-list': {
    fallback: Layers,
    suggestedFile: 'goal-enrich-list.png',
    brief: 'Isometric database stack with a sparkle'
  },
  'goal-outreach': {
    fallback: Send,
    suggestedFile: 'goal-outreach.png',
    brief: 'Isometric paper plane or message envelope'
  },
  'goal-voice-agent': {
    fallback: Mic,
    suggestedFile: 'goal-voice-agent.png',
    brief: 'Isometric microphone with a sound wave'
  },
  'goal-explore': {
    fallback: Compass,
    suggestedFile: 'goal-explore.png',
    brief: 'Isometric compass or telescope'
  },

  /* ---------------- Step 3 — starting point ---------------- */
  'source-local-search': {
    fallback: Search,
    suggestedFile: 'source-local-search.png',
    brief: 'Isometric magnifier over a map'
  },
  'source-company-search': {
    fallback: Building2,
    suggestedFile: 'source-company-search.png',
    brief: 'Isometric magnifier over an office block'
  },
  'source-people-search': {
    fallback: Users,
    suggestedFile: 'source-people-search.png',
    brief: 'Isometric magnifier over a profile card'
  },
  'source-csv-import': {
    fallback: FileSpreadsheet,
    suggestedFile: 'source-csv-import.png',
    brief: 'Isometric spreadsheet file with an upload arrow'
  },
  'source-crm-connect': {
    fallback: Plug,
    suggestedFile: 'source-crm-connect.png',
    brief: 'Isometric plug and socket, deliberately not yet joined'
  },
  'source-blank-table': {
    fallback: Table2,
    suggestedFile: 'source-blank-table.png',
    brief: 'Isometric empty grid or table'
  },
  'source-later': {
    fallback: Compass,
    suggestedFile: 'source-later.png',
    brief: 'Isometric hourglass or bookmark'
  },

  /* ---------------- Step 4 — what to prepare ---------------- */
  'prep-verify': {
    fallback: ShieldCheck,
    suggestedFile: 'prep-verify.png',
    brief: 'Isometric shield with a tick'
  },
  'prep-company-enrichment': {
    fallback: Building2,
    suggestedFile: 'prep-company-enrichment.png',
    brief: 'Isometric building with data cards fanning out'
  },
  'prep-decision-makers': {
    fallback: UserSearch,
    suggestedFile: 'prep-decision-makers.png',
    brief: 'Isometric org chart with one node highlighted'
  },
  'prep-tech-signals': {
    fallback: Cpu,
    suggestedFile: 'prep-tech-signals.png',
    brief: 'Isometric chip or server stack'
  },
  'prep-ai-research': {
    fallback: Binoculars,
    suggestedFile: 'prep-ai-research.png',
    brief: 'Isometric binoculars or magnifier over a document'
  },
  'prep-personalisation': {
    fallback: PenLine,
    suggestedFile: 'prep-personalisation.png',
    brief: 'Isometric pen writing on a letter'
  },
  'prep-call-ready': {
    fallback: Headphones,
    suggestedFile: 'prep-call-ready.png',
    brief: 'Isometric headset beside a contact card'
  },
  'prep-hiring-signals': {
    fallback: Sparkles,
    suggestedFile: 'prep-hiring-signals.png',
    brief: 'Isometric job board or briefcase with a badge'
  },
  'prep-voice-draft': {
    fallback: Mic,
    suggestedFile: 'prep-voice-draft.png',
    brief: 'Isometric microphone beside a script page'
  },
  'prep-knowledge-base': {
    fallback: Database,
    suggestedFile: 'prep-knowledge-base.png',
    brief: 'Isometric stack of documents or a small library'
  },
  'prep-segments': {
    fallback: Layers,
    suggestedFile: 'prep-segments.png',
    brief: 'Isometric stacked layers splitting apart'
  },

  /* ---------------- Step 5 — calling ---------------- */
  'call-none': {
    fallback: Compass,
    suggestedFile: 'call-none.png',
    brief: 'Isometric muted or paused indicator'
  },
  'call-web-test': {
    fallback: Headphones,
    suggestedFile: 'call-web-test.png',
    brief: 'Isometric browser window with a headset — a test call, not a live one'
  },
  'call-outbound': {
    fallback: PhoneOutgoing,
    suggestedFile: 'call-outbound.png',
    brief: 'Isometric handset with an outgoing arrow'
  },
  'call-inbound': {
    fallback: PhoneIncoming,
    suggestedFile: 'call-inbound.png',
    brief: 'Isometric handset with an incoming arrow'
  },
  'call-analytics': {
    fallback: BarChart3,
    suggestedFile: 'call-analytics.png',
    brief: 'Isometric waveform resolving into a bar chart'
  },

  /* ---------------- Dashboard ---------------- */
  'action-find-leads': {
    fallback: Search,
    suggestedFile: 'action-find-leads.png',
    brief: 'Isometric magnifier over a map pin'
  },
  'action-import-data': {
    fallback: FileSpreadsheet,
    suggestedFile: 'action-import-data.png',
    brief: 'Isometric file with an upload arrow'
  },
  'action-build-table': {
    fallback: Table2,
    suggestedFile: 'action-build-table.png',
    brief: 'Isometric grid being assembled'
  },
  'action-enrich-contacts': {
    fallback: Sparkles,
    suggestedFile: 'action-enrich-contacts.png',
    brief: 'Isometric contact card gaining fields'
  },
  'action-campaign-draft': {
    fallback: Send,
    suggestedFile: 'action-campaign-draft.png',
    brief: 'Isometric paper plane over a sequence of steps'
  },
  'action-voice-draft': {
    fallback: Mic,
    suggestedFile: 'action-voice-draft.png',
    brief: 'Isometric microphone with a draft script'
  },
  'empty-voice': {
    fallback: Mic,
    suggestedFile: 'empty-voice.png',
    brief: 'Larger isometric microphone and waveform, for an empty state'
  },
  'empty-audiences': {
    fallback: Users,
    suggestedFile: 'empty-audiences.png',
    brief: 'Larger isometric group of contact cards, for an empty state'
  },
  'empty-campaigns': {
    fallback: Send,
    suggestedFile: 'empty-campaigns.png',
    brief: 'Larger isometric campaign sequence, for an empty state'
  },
  'empty-tables': {
    fallback: Table2,
    suggestedFile: 'empty-tables.png',
    brief: 'Larger isometric data grid, for an empty state'
  },
  'empty-find-leads': {
    fallback: Search,
    suggestedFile: 'empty-find-leads.png',
    brief: 'Larger isometric search scene, for an empty state'
  },
  'empty-analytics': {
    fallback: BarChart3,
    suggestedFile: 'empty-analytics.png',
    brief: 'Larger isometric dashboard chart, for an empty state'
  },
  'empty-settings': {
    fallback: Plug,
    suggestedFile: 'empty-settings.png',
    brief: 'Larger isometric control panel, for an empty state'
  },
  'next-step': {
    fallback: ArrowUpRight,
    suggestedFile: 'next-step.png',
    brief: 'Isometric signpost or upward arrow, for the recommended action'
  }
};

/** True once at least one approved asset has been wired in. */
export const hasBnbAssets = Object.values(ICONS).some((i) => Boolean(i.asset));

/** The manifest, for the README and for reporting what is still missing. */
export function missingAssets(): { name: IconName; file: string; brief: string }[] {
  return (Object.keys(ICONS) as IconName[])
    .filter((k) => !ICONS[k].asset)
    .map((k) => ({ name: k, file: ICONS[k].suggestedFile, brief: ICONS[k].brief }));
}
