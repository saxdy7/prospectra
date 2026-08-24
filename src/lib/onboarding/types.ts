/**
 * Onboarding domain types.
 *
 * These describe the shape the UI reads and writes. Persistence is deliberately
 * kept behind `WorkspaceStore` (see ./storage) so the same shape can move from
 * localStorage to Supabase without touching a component.
 */

/** Bumped when the persisted shape changes incompatibly; older blobs are dropped. */
export const ONBOARDING_VERSION = 1;

export type TeamSize = 'solo' | '2-10' | '11-50' | '51+';

/** The single primary goal chosen in step 2. Drives every later branch. */
export type GoalId =
  | 'local-business'
  | 'company-list'
  | 'find-people'
  | 'enrich-list'
  | 'outreach'
  | 'voice-agent'
  | 'explore';

/** Where the first rows come from. */
export type DataSourceId =
  | 'search-web'
  | 'find-companies'
  | 'find-people'
  | 'import-csv'
  | 'connect-crm'
  | 'blank-table'
  | 'later';

export type CrmId = 'salesforce' | 'hubspot' | 'pipedrive' | 'zoho' | 'attio' | 'other';

/** Optional prep work, filtered by goal in step 4. */
export type PrepareId =
  | 'verify-contacts'
  | 'company-enrichment'
  | 'decision-makers'
  | 'tech-signals'
  | 'ai-research'
  | 'hiring-signals'
  | 'email-personalisation'
  | 'audience-segments'
  | 'voice-agent-draft'
  | 'call-ready-audience'
  | 'knowledge-base';

/** Step 5 — how calling fits, if at all. */
export type CallingStance =
  | 'not-now'
  | 'test-web-call'
  | 'outbound'
  | 'inbound'
  | 'exploring';

export type CallingUseCase =
  | 'qualification'
  | 'booking'
  | 'follow-up'
  | 'support'
  | 'collections'
  | 'other';

export type CallingLanguage = 'english' | 'hindi' | 'hindi-english' | 'other';

export type CallingInterest =
  | 'transcripts'
  | 'summaries'
  | 'transfer'
  | 'knowledge-base'
  | 'analytics';

export interface CallingPreferences {
  stance?: CallingStance;
  useCase?: CallingUseCase;
  language?: CallingLanguage;
  interests: CallingInterest[];
}

export interface OnboardingData {
  version: number;
  workspaceName: string;
  /** Data URL for the uploaded mark. Small by construction — see the uploader. */
  workspaceLogo: string | null;
  teamSize?: TeamSize;
  goal?: GoalId;
  dataSource?: DataSourceId;
  /** Connection *intent* only — no OAuth is performed anywhere in this flow. */
  crmIntent: CrmId[];
  prepare: PrepareId[];
  calling: CallingPreferences;
  /** ISO timestamp set when the flow is finished. Absent means incomplete. */
  completedAt?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  hint: string;
}

/** Everything the workspace persists between visits. */
export interface WorkspaceState {
  /**
   * The Supabase user id this local state belongs to.
   *
   * localStorage is a single bucket per browser, not per account — so without
   * this, one person's onboarding would greet the next person who logs in on
   * the same machine (or the same person after their account was deleted and
   * recreated). Read time reconciles: if this does not match the current
   * session's user, the stale state is discarded and onboarding starts clean.
   *
   * `null` means it was captured before sign-in (e.g. the project requires
   * email confirmation), and gets claimed by the first user who owns it.
   */
  ownerId: string | null;
  onboarding: OnboardingData;
  /**
   * Which step to resume on. Stored rather than derived, because the last two
   * steps are optional — an empty `prepare` is a legitimate answer, so there
   * is no way to tell "not reached yet" from "deliberately skipped".
   */
  onboardingStep: number;
  /** Checklist item id → completed. Items themselves are derived, not stored. */
  checklistDone: Record<string, boolean>;
  checklistDismissed: boolean;
}

export function emptyOnboarding(): OnboardingData {
  return {
    version: ONBOARDING_VERSION,
    workspaceName: '',
    workspaceLogo: null,
    crmIntent: [],
    prepare: [],
    calling: { interests: [] }
  };
}

export function emptyWorkspaceState(): WorkspaceState {
  return {
    ownerId: null,
    onboarding: emptyOnboarding(),
    onboardingStep: 0,
    checklistDone: {},
    checklistDismissed: false
  };
}
