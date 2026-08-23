import {
  Building2,
  Compass,
  Database,
  FileSpreadsheet,
  Globe,
  Headphones,
  Layers,
  Mic,
  Plug,
  Search,
  Send,
  Sparkles,
  Table2,
  Target,
  UserSearch,
  Users,
  Wand2
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type {
  CallingInterest,
  CallingLanguage,
  CallingStance,
  CallingUseCase,
  CrmId,
  DataSourceId,
  GoalId,
  PrepareId,
  TeamSize
} from './types';

export interface Option<T extends string> {
  id: T;
  label: string;
  blurb?: string;
  icon?: LucideIcon;
  /** Illustrative only — never presented as a price or a billing figure. */
  estimate?: string;
}

/* ==========================================================================
   Step 1 — workspace
   ========================================================================== */

export const TEAM_SIZES: Option<TeamSize>[] = [
  { id: 'solo', label: 'Just me' },
  { id: '2-10', label: '2–10' },
  { id: '11-50', label: '11–50' },
  { id: '51+', label: '51+' }
];

export const LOGO_RULES = {
  accept: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'],
  maxBytes: 512 * 1024,
  label: 'PNG, JPG, SVG or WebP · up to 512 KB'
} as const;

/* ==========================================================================
   Step 2 — goal
   ========================================================================== */

export const GOALS: Option<GoalId>[] = [
  {
    id: 'local-business',
    label: 'Find local businesses',
    blurb: 'Pull shops, clinics and contractors from the map with phone and rating.',
    icon: Globe
  },
  {
    id: 'company-list',
    label: 'Build a B2B company list',
    blurb: 'Filter by industry, headcount and technology into one working table.',
    icon: Building2
  },
  {
    id: 'find-people',
    label: 'Find people and decision-makers',
    blurb: 'Reach the person who signs off, not the shared inbox.',
    icon: UserSearch
  },
  {
    id: 'enrich-list',
    label: 'Enrich an existing list',
    blurb: 'Fill the gaps in rows you already have and flag what is stale.',
    icon: Layers
  },
  {
    id: 'outreach',
    label: 'Run outreach campaigns',
    blurb: 'Sequence email now, add voice and messaging as they land.',
    icon: Send
  },
  {
    id: 'voice-agent',
    label: 'Build or test a voice agent',
    blurb: 'Draft an agent today, ready for when calling opens up.',
    icon: Mic
  },
  {
    id: 'explore',
    label: 'Explore Prospectra',
    blurb: 'Look around first and decide once you have seen it work.',
    icon: Compass
  }
];

/* ==========================================================================
   Step 3 — data source
   ========================================================================== */

const DATA_SOURCES: Record<DataSourceId, Option<DataSourceId>> = {
  'search-web': {
    id: 'search-web',
    label: 'Search the web',
    blurb: 'Describe a category and place; rows stream in as they are found.',
    icon: Search
  },
  'find-companies': {
    id: 'find-companies',
    label: 'Find companies',
    blurb: 'Start from firmographic filters rather than a list you own.',
    icon: Building2
  },
  'find-people': {
    id: 'find-people',
    label: 'Find people',
    blurb: 'Start from roles and seniority across companies you care about.',
    icon: Users
  },
  'import-csv': {
    id: 'import-csv',
    label: 'Import a CSV',
    blurb: 'Bring a list you already keep and map the columns once.',
    icon: FileSpreadsheet
  },
  'connect-crm': {
    id: 'connect-crm',
    label: 'Connect a CRM',
    blurb: 'Tell us which system you use — we will set it up when it is ready.',
    icon: Plug
  },
  'blank-table': {
    id: 'blank-table',
    label: 'Start from a blank table',
    blurb: 'Build the columns yourself and add rows as you go.',
    icon: Table2
  },
  later: {
    id: 'later',
    label: "I'll start later",
    blurb: 'Set up the workspace now and bring data in when you are ready.',
    icon: Compass
  }
};

/**
 * Which sources are worth showing per goal. Ordered by how well each fits the
 * stated goal, so the most likely answer is the first thing read.
 */
const SOURCES_BY_GOAL: Record<GoalId, DataSourceId[]> = {
  'local-business': ['search-web', 'import-csv', 'blank-table', 'connect-crm'],
  'company-list': ['find-companies', 'import-csv', 'connect-crm', 'blank-table'],
  'find-people': ['find-people', 'find-companies', 'import-csv', 'connect-crm'],
  'enrich-list': ['import-csv', 'connect-crm', 'blank-table'],
  outreach: ['import-csv', 'connect-crm', 'find-people', 'blank-table'],
  'voice-agent': ['import-csv', 'search-web', 'blank-table', 'connect-crm'],
  explore: [
    'search-web',
    'find-companies',
    'find-people',
    'import-csv',
    'connect-crm',
    'blank-table'
  ]
};

export function dataSourcesFor(goal: GoalId | undefined): Option<DataSourceId>[] {
  const ids = goal ? SOURCES_BY_GOAL[goal] : SOURCES_BY_GOAL.explore;
  return [...ids.map((id) => DATA_SOURCES[id]), DATA_SOURCES.later];
}

export const CRMS: Option<CrmId>[] = [
  { id: 'salesforce', label: 'Salesforce' },
  { id: 'hubspot', label: 'HubSpot' },
  { id: 'pipedrive', label: 'Pipedrive' },
  { id: 'zoho', label: 'Zoho' },
  { id: 'attio', label: 'Attio' },
  { id: 'other', label: 'Something else' }
];

/* ==========================================================================
   Step 4 — what to prepare
   ========================================================================== */

const PREPARE: Record<PrepareId, Option<PrepareId>> = {
  'verify-contacts': {
    id: 'verify-contacts',
    label: 'Verify contact details',
    blurb: 'Check numbers and addresses before anyone tries to use them.',
    icon: Target,
    estimate: '~0.2 credits / row'
  },
  'company-enrichment': {
    id: 'company-enrichment',
    label: 'Company details',
    blurb: 'Industry, headcount, revenue band and location on every row.',
    icon: Building2,
    estimate: '~0.5 credits / row'
  },
  'decision-makers': {
    id: 'decision-makers',
    label: 'Decision-maker discovery',
    blurb: 'Surface who actually owns the budget at each account.',
    icon: UserSearch,
    estimate: '~1 credit / row'
  },
  'tech-signals': {
    id: 'tech-signals',
    label: 'Technology signals',
    blurb: 'What each company runs, so you can lead with something relevant.',
    icon: Database,
    estimate: '~2 credits / row'
  },
  'ai-research': {
    id: 'ai-research',
    label: 'Research and first lines',
    blurb: 'Read each site and draft an opening line worth answering.',
    icon: Wand2,
    estimate: '~1 credit / row'
  },
  'hiring-signals': {
    id: 'hiring-signals',
    label: 'Hiring signals',
    blurb: 'Open roles often say more about spend than a headcount figure.',
    icon: Sparkles,
    estimate: '~0.5 credits / row'
  },
  'email-personalisation': {
    id: 'email-personalisation',
    label: 'Email personalisation',
    blurb: 'Draft per-row opening lines your sequence can pull from.',
    icon: Send,
    estimate: '~1 credit / row'
  },
  'call-ready-phone': {
    id: 'call-ready-phone',
    label: 'Call-ready numbers',
    blurb: 'Normalise and check numbers so a future dialler can use them.',
    icon: Headphones,
    estimate: '~0.5 credits / row'
  },
  'audience-segments': {
    id: 'audience-segments',
    label: 'Audience segments',
    blurb: 'Split the list into groups worth saying different things to.',
    icon: Layers,
    estimate: 'no usage'
  },
  'voice-agent-draft': {
    id: 'voice-agent-draft',
    label: 'A voice-agent draft',
    blurb: 'Role, objective and opening line, saved for you to refine.',
    icon: Mic,
    estimate: 'no usage'
  },
  'call-ready-audience': {
    id: 'call-ready-audience',
    label: 'A call-ready audience',
    blurb: 'A contact list shaped for calling, ready when telephony lands.',
    icon: Users,
    estimate: 'no usage'
  },
  'knowledge-base': {
    id: 'knowledge-base',
    label: 'A knowledge-base slot',
    blurb: 'Somewhere to drop the docs an agent should answer from.',
    icon: Database,
    estimate: 'no usage'
  }
};

const PREPARE_BY_GOAL: Record<GoalId, PrepareId[]> = {
  'local-business': [
    'verify-contacts',
    'company-enrichment',
    'decision-makers',
    'ai-research'
  ],
  'company-list': [
    'company-enrichment',
    'decision-makers',
    'tech-signals',
    'hiring-signals',
    'ai-research'
  ],
  'find-people': [
    'verify-contacts',
    'decision-makers',
    'company-enrichment',
    'ai-research'
  ],
  'enrich-list': [
    'verify-contacts',
    'company-enrichment',
    'decision-makers',
    'tech-signals',
    'hiring-signals',
    'ai-research'
  ],
  outreach: ['email-personalisation', 'call-ready-phone', 'audience-segments'],
  'voice-agent': ['voice-agent-draft', 'call-ready-audience', 'knowledge-base'],
  explore: ['company-enrichment', 'verify-contacts', 'ai-research']
};

export function prepareOptionsFor(goal: GoalId | undefined): Option<PrepareId>[] {
  const ids = goal ? PREPARE_BY_GOAL[goal] : PREPARE_BY_GOAL.explore;
  return ids.map((id) => PREPARE[id]);
}

/* ==========================================================================
   Step 5 — calling
   ========================================================================== */

export const CALLING_STANCES: Option<CallingStance>[] = [
  {
    id: 'not-now',
    label: 'Not right now',
    blurb: 'Keep calling out of the way until you ask for it.'
  },
  {
    id: 'test-web-call',
    label: 'I want to test a web call',
    blurb: 'Try an agent in the browser before anything touches a phone line.'
  },
  {
    id: 'outbound',
    label: 'I plan outbound calling',
    blurb: 'Reach a list of contacts once telephony is available.'
  },
  {
    id: 'inbound',
    label: 'I need inbound call handling',
    blurb: 'Answer and route calls that come to you.'
  },
  {
    id: 'exploring',
    label: "I'm still exploring",
    blurb: 'Curious about it, no firm plan yet.'
  }
];

export const CALLING_USE_CASES: Option<CallingUseCase>[] = [
  { id: 'qualification', label: 'Lead qualification' },
  { id: 'booking', label: 'Appointment booking' },
  { id: 'follow-up', label: 'Follow-up' },
  { id: 'support', label: 'Support' },
  { id: 'collections', label: 'Collections' },
  { id: 'other', label: 'Other' }
];

export const CALLING_LANGUAGES: Option<CallingLanguage>[] = [
  { id: 'english', label: 'English' },
  { id: 'hindi', label: 'Hindi' },
  { id: 'hindi-english', label: 'Hindi + English' },
  { id: 'other', label: 'Other' }
];

export const CALLING_INTERESTS: Option<CallingInterest>[] = [
  { id: 'transcripts', label: 'Call transcripts' },
  { id: 'summaries', label: 'Call summaries' },
  { id: 'transfer', label: 'Call transfer' },
  { id: 'knowledge-base', label: 'Knowledge base' },
  { id: 'analytics', label: 'Call analytics' }
];

/** A stance other than "not right now" opens the follow-up questions. */
export function wantsCalling(stance: CallingStance | undefined): boolean {
  return stance !== undefined && stance !== 'not-now';
}

/* ==========================================================================
   Steps
   ========================================================================== */

export interface StepMeta {
  id: 'workspace' | 'goal' | 'data' | 'prepare' | 'calling';
  label: string;
  /** False when the step can be skipped outright. */
  required: boolean;
}

export const STEPS: StepMeta[] = [
  { id: 'workspace', label: 'Workspace', required: true },
  { id: 'goal', label: 'Goal', required: true },
  { id: 'data', label: 'Data', required: true },
  { id: 'prepare', label: 'Prepare', required: false },
  { id: 'calling', label: 'Calling', required: false }
];
