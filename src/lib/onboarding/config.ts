import type { IconName } from '@/lib/icons/registry';
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
  /** Registry key. The registry decides asset-vs-Lucide, not this file. */
  icon?: IconName;
  /**
   * Illustrative scale only, shown under an "Estimated setup usage" label.
   * Nothing here is a price, a rate, or a live credit balance.
   */
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
   Step 2 — primary goal
   ========================================================================== */

export const GOALS: Option<GoalId>[] = [
  {
    id: 'local-business',
    label: 'Find local businesses',
    blurb: 'Pull shops, clinics and contractors from the map, with phone and rating.',
    icon: 'goal-local-business'
  },
  {
    id: 'company-list',
    label: 'Build a company list',
    blurb: 'Filter by industry, headcount and technology into one working table.',
    icon: 'goal-company-list'
  },
  {
    id: 'find-people',
    label: 'Find decision-makers',
    blurb: 'Reach the person who signs off, not a shared inbox.',
    icon: 'goal-find-people'
  },
  {
    id: 'enrich-list',
    label: 'Enrich an existing list',
    blurb: 'Fill the gaps in rows you already have, and flag what has gone stale.',
    icon: 'goal-enrich-list'
  },
  {
    id: 'outreach',
    label: 'Launch outreach',
    blurb: 'Sequence email now; add voice and messaging as those channels land.',
    icon: 'goal-outreach'
  },
  {
    id: 'voice-agent',
    label: 'Build a voice agent',
    blurb: 'Draft the agent today, ready for when calling opens up.',
    icon: 'goal-voice-agent'
  },
  {
    id: 'explore',
    label: 'Explore the workspace',
    blurb: 'Look around first, and decide once you have seen it work.',
    icon: 'goal-explore'
  }
];

/* ==========================================================================
   Step 3 — starting point
   ========================================================================== */

const DATA_SOURCES: Record<DataSourceId, Option<DataSourceId>> = {
  'search-web': {
    id: 'search-web',
    label: 'Search local businesses',
    blurb: 'Name a category and a place, and rows arrive as they are found.',
    icon: 'source-local-search'
  },
  'find-companies': {
    id: 'find-companies',
    label: 'Search companies',
    blurb: 'Start from firmographic filters rather than a list you already own.',
    icon: 'source-company-search'
  },
  'find-people': {
    id: 'find-people',
    label: 'Search people',
    blurb: 'Start from roles and seniority across the accounts you care about.',
    icon: 'source-people-search'
  },
  'import-csv': {
    id: 'import-csv',
    label: 'Import a CSV',
    blurb: 'Bring a list you already keep, and map the columns once.',
    icon: 'source-csv-import'
  },
  'connect-crm': {
    id: 'connect-crm',
    label: 'Connect a CRM later',
    blurb: 'Tell us what you use — we will help you connect it when it is ready.',
    icon: 'source-crm-connect'
  },
  'blank-table': {
    id: 'blank-table',
    label: 'Start with a blank table',
    blurb: 'Build the columns yourself and add rows as you go.',
    icon: 'source-blank-table'
  },
  later: {
    id: 'later',
    label: 'Decide later',
    blurb: 'Set the workspace up now and bring data in when you are ready.',
    icon: 'source-later'
  }
};

/** Ordered by fit, so the most likely answer reads first. */
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
  { id: 'other', label: 'Other' }
];

/* ==========================================================================
   Step 4 — what to prepare
   ========================================================================== */

const PREPARE: Record<PrepareId, Option<PrepareId>> = {
  'verify-contacts': {
    id: 'verify-contacts',
    label: 'Verify business or contact details',
    blurb: 'Check numbers and addresses before anyone tries to use them.',
    icon: 'prep-verify',
    estimate: 'light'
  },
  'company-enrichment': {
    id: 'company-enrichment',
    label: 'Enrich company profiles',
    blurb: 'Industry, headcount, revenue band and location on every row.',
    icon: 'prep-company-enrichment',
    estimate: 'moderate'
  },
  'decision-makers': {
    id: 'decision-makers',
    label: 'Find decision-makers',
    blurb: 'Surface who actually owns the budget at each account.',
    icon: 'prep-decision-makers',
    estimate: 'moderate'
  },
  'tech-signals': {
    id: 'tech-signals',
    label: 'Detect technology stack',
    blurb: 'What each company runs, so you can lead with something relevant.',
    icon: 'prep-tech-signals',
    estimate: 'heavier'
  },
  'ai-research': {
    id: 'ai-research',
    label: 'Research companies with AI',
    blurb: 'Read each site and pull out what is worth mentioning.',
    icon: 'prep-ai-research',
    estimate: 'moderate'
  },
  'email-personalisation': {
    id: 'email-personalisation',
    label: 'Write personalized outreach',
    blurb: 'Draft a per-row opening line your sequence can pull from.',
    icon: 'prep-personalisation',
    estimate: 'moderate'
  },
  'call-ready-audience': {
    id: 'call-ready-audience',
    label: 'Build a call-ready audience',
    blurb: 'Shape a contact list for calling, ready for when telephony lands.',
    icon: 'prep-call-ready',
    estimate: 'light'
  },
  'hiring-signals': {
    id: 'hiring-signals',
    label: 'Track job openings and hiring signals',
    blurb: 'Open roles often say more about spend than a headcount figure.',
    icon: 'prep-hiring-signals',
    estimate: 'light'
  },
  'voice-agent-draft': {
    id: 'voice-agent-draft',
    label: 'Draft a voice agent',
    blurb: 'Role, objective and opening line, saved for you to refine.',
    icon: 'prep-voice-draft',
    estimate: 'none'
  },
  'knowledge-base': {
    id: 'knowledge-base',
    label: 'Set aside a knowledge base',
    blurb: 'Somewhere to drop the documents an agent should answer from.',
    icon: 'prep-knowledge-base',
    estimate: 'none'
  },
  'audience-segments': {
    id: 'audience-segments',
    label: 'Split the list into segments',
    blurb: 'Group rows worth saying different things to.',
    icon: 'prep-segments',
    estimate: 'none'
  }
};

const PREPARE_BY_GOAL: Record<GoalId, PrepareId[]> = {
  'local-business': [
    'verify-contacts',
    'company-enrichment',
    'decision-makers',
    'ai-research',
    'call-ready-audience'
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
    'ai-research',
    'email-personalisation'
  ],
  'enrich-list': [
    'verify-contacts',
    'company-enrichment',
    'decision-makers',
    'tech-signals',
    'hiring-signals',
    'ai-research'
  ],
  outreach: [
    'email-personalisation',
    'audience-segments',
    'call-ready-audience',
    'ai-research'
  ],
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
    blurb: 'Keep calling out of the way until you ask for it.',
    icon: 'call-none'
  },
  {
    id: 'test-web-call',
    label: 'Test a web call',
    blurb: 'Try an agent in the browser before anything touches a phone line.',
    icon: 'call-web-test'
  },
  {
    id: 'outbound',
    label: 'Plan outbound calls',
    blurb: 'Reach a list of contacts once telephony is available.',
    icon: 'call-outbound'
  },
  {
    id: 'inbound',
    label: 'Handle inbound calls',
    blurb: 'Answer and route the calls that come to you.',
    icon: 'call-inbound'
  },
  {
    id: 'exploring',
    label: 'Still exploring',
    blurb: 'Curious about it, with no firm plan yet.',
    icon: 'call-analytics'
  }
];

export const CALLING_USE_CASES: Option<CallingUseCase>[] = [
  { id: 'qualification', label: 'Qualify leads' },
  { id: 'booking', label: 'Book meetings' },
  { id: 'follow-up', label: 'Follow up' },
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
  { id: 'transcripts', label: 'Transcripts' },
  { id: 'summaries', label: 'Call summaries' },
  { id: 'transfer', label: 'Transfers' },
  { id: 'knowledge-base', label: 'Knowledge base' },
  { id: 'analytics', label: 'Analytics' }
];

/** Any stance other than "not right now" opens the follow-up questions. */
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
  { id: 'data', label: 'Starting point', required: true },
  { id: 'prepare', label: 'Prepare', required: false },
  { id: 'calling', label: 'Calling', required: false }
];
