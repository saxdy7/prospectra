/**
 * Prospectra domain models.
 * =============================================================================
 *
 * The contract the UI codes against. These mirror the schema in
 * `docs/PRODUCT_BLUEPRINT.md` and exist ahead of the tables, so a component
 * written in an early phase does not change shape when its table lands.
 *
 * Conventions:
 *   · every workspace-owned model carries `workspaceId`
 *   · timestamps are ISO 8601 strings (what Supabase returns over the wire)
 *   · status values are string unions, never bare strings
 *   · provider-derived records keep `source` and `providerRequestId`, so the
 *     provenance of any row is always answerable
 *
 * Phase markers in comments: [P1] shipped · [P3]… planned · [prov] provider-managed
 */

/* ==========================================================================
   Shared
   ========================================================================== */

export interface Entity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceScoped extends Entity {
  workspaceId: string;
}

/** Where a record came from. Never inferred — always recorded at write time. */
export interface Provenance {
  source: 'manual' | 'csv' | 'search' | 'enrichment' | 'integration';
  provider?: string;
  providerRequestId?: string;
  fetchedAt?: string;
}

/** The lifecycle every asynchronous job shares. */
export type JobStatus =
  | 'draft'
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface JobError {
  code: string;
  message: string;
  retryable: boolean;
  occurredAt: string;
}

/* ==========================================================================
   Identity  [P1 / P2]
   ========================================================================== */

export interface Profile extends Entity {
  userId: string;
  fullName?: string;
  avatarUrl?: string;
  locale?: string;
}

export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer';
export type TeamSize = 'solo' | '2-10' | '11-50' | '51+';

export interface Workspace extends Entity {
  ownerId: string;
  name: string;
  logoUrl?: string | null;
  teamSize?: TeamSize;
  plan?: string;
}

export interface WorkspaceMember extends Entity {
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  invitedBy?: string;
  joinedAt?: string;
}

export interface SetupChecklistItem {
  workspaceId: string;
  itemId: string;
  done: boolean;
}

/* ==========================================================================
   Credits  [P4]
   Ledger is append-only; `balance` is a projection, never edited in place.
   ========================================================================== */

export type CreditKind = 'enrichment' | 'research' | 'voice_minutes' | 'storage';

export interface CreditWallet extends WorkspaceScoped {
  kind: CreditKind;
  balance: number;
  reserved: number;
}

export interface CreditLedgerEntry extends Entity {
  walletId: string;
  delta: number;
  reason: string;
  refType?: string;
  refId?: string;
  balanceAfter: number;
}

export interface UsageEvent extends WorkspaceScoped {
  kind: CreditKind;
  quantity: number;
  unitCost?: number;
  refType?: string;
  refId?: string;
}

/* ==========================================================================
   Lead sourcing  [P3 / P4]
   ========================================================================== */

export type SearchKind = 'local_business' | 'company' | 'people' | 'job' | 'lookalike';

export interface SearchJob extends WorkspaceScoped {
  projectId?: string;
  kind: SearchKind;
  filters: Record<string, unknown>;
  status: JobStatus;
  provider?: string;
  providerRequestId?: string;
  resultCount: number;
  error?: JobError;
  retryCount: number;
}

export interface SearchResult extends Entity {
  jobId: string;
  /** Untouched provider payload, kept for reprocessing without a refetch. */
  raw: Record<string, unknown>;
  normalised: Record<string, unknown>;
  dedupeKey?: string;
  importedRowId?: string;
}

/* ==========================================================================
   Table engine  [P3]
   ========================================================================== */

export type ColumnType =
  | 'text'
  | 'url'
  | 'email'
  | 'phone'
  | 'number'
  | 'rating'
  | 'status'
  | 'date'
  | 'enrichment'
  | 'ai_formula';

export type CellStatus = 'empty' | 'queued' | 'running' | 'filled' | 'failed' | 'skipped';
export type RowStatus = 'new' | 'enriching' | 'ready' | 'failed' | 'archived';

export interface Table extends WorkspaceScoped {
  name: string;
  kind: 'leads' | 'companies' | 'contacts' | 'jobs' | 'custom';
  rowCount: number;
}

export interface TableColumn extends Entity {
  tableId: string;
  key: string;
  label: string;
  type: ColumnType;
  position: number;
  /** Type-specific settings: provider chain, prompt, enum options, format. */
  config?: Record<string, unknown>;
}

export interface TableRow extends Entity {
  tableId: string;
  position: number;
  status: RowStatus;
  dedupeKey?: string;
  provenance: Provenance;
}

export interface TableCell extends Entity {
  rowId: string;
  columnId: string;
  value: unknown;
  status: CellStatus;
  providerMeta?: Record<string, unknown>;
}

export interface TableView extends Entity {
  tableId: string;
  name: string;
  filters: Record<string, unknown>;
  sorts: { columnId: string; direction: 'asc' | 'desc' }[];
  hiddenColumns: string[];
}

export interface ImportJob extends WorkspaceScoped {
  tableId?: string;
  filePath: string;
  mapping: Record<string, string>;
  status: JobStatus;
  /** Invalid rows are reported here, never dropped silently. */
  rowCounts: { total: number; imported: number; duplicate: number; invalid: number };
  error?: JobError;
}

/* ==========================================================================
   Enrichment  [P4]
   ========================================================================== */

export interface EnrichmentJob extends WorkspaceScoped {
  tableId: string;
  columnId: string;
  /** Tried in order; first hit wins and is the only one charged. */
  providerChain: string[];
  status: JobStatus;
  rowTotal: number;
  rowDone: number;
  error?: JobError;
}

export interface EnrichmentResult extends Entity {
  jobId: string;
  rowId: string;
  provider: string;
  value: unknown;
  confidence?: number;
  creditsUsed: number;
  providerRequestId?: string;
  error?: JobError;
}

export interface ResearchTask extends Entity {
  rowId: string;
  prompt: string;
  model: string;
  output?: Record<string, unknown>;
  tokens?: number;
  status: JobStatus;
}

/* ==========================================================================
   Contacts, audiences, outreach  [P5]
   ========================================================================== */

export type ConsentState = 'unknown' | 'opted_in' | 'opted_out' | 'suppressed';

export interface Company extends WorkspaceScoped {
  name: string;
  domain?: string;
  industry?: string;
  headcount?: number;
  location?: string;
  enrichment?: Record<string, unknown>;
  provenance: Provenance;
}

export interface Contact extends WorkspaceScoped {
  companyId?: string;
  fullName: string;
  title?: string;
  email?: string;
  phone?: string;
  consentState: ConsentState;
  provenance: Provenance;
}

export interface Audience extends WorkspaceScoped {
  name: string;
  sourceTableId?: string;
  filters: Record<string, unknown>;
  memberCount: number;
}

export interface AudienceMember extends Entity {
  audienceId: string;
  contactId: string;
  state: 'active' | 'removed' | 'suppressed';
}

export type CampaignChannel = 'email' | 'voice' | 'multi';
export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'paused' | 'completed';

export interface Campaign extends WorkspaceScoped {
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  audienceId?: string;
}

export interface CampaignStep extends Entity {
  campaignId: string;
  position: number;
  delayDays: number;
  template: Record<string, unknown>;
}

export interface CampaignMember extends Entity {
  campaignId: string;
  contactId: string;
  state: 'pending' | 'active' | 'replied' | 'bounced' | 'stopped';
  currentStep: number;
}

/* ==========================================================================
   Voice  [P6] — draft-only until every compliance gate passes
   ========================================================================== */

export type VoiceAgentStatus = 'draft' | 'published' | 'archived';

export interface VoiceAgent extends WorkspaceScoped {
  name: string;
  status: VoiceAgentStatus;
  currentVersionId?: string;
}

export interface VoiceAgentVersion extends Entity {
  agentId: string;
  version: number;
  prompt: string;
  firstMessage?: string;
  model: string;
  languages: string[];
  voice: string;
  tools?: Record<string, unknown>;
  publishedAt?: string;
}

export interface KnowledgeBaseCollection extends WorkspaceScoped {
  name: string;
}

export interface KnowledgeBaseDocument extends Entity {
  collectionId: string;
  title: string;
  filePath?: string;
  url?: string;
  status: JobStatus;
  chunkCount?: number;
}

export interface PhoneNumber extends WorkspaceScoped {
  e164: string;
  country: string;
  provider: string;
  status: 'pending' | 'active' | 'released';
  assignedAgentId?: string;
}

export interface CallCampaign extends WorkspaceScoped {
  audienceId: string;
  agentId: string;
  fromNumberId?: string;
  status: CampaignStatus;
  timezone: string;
  callingWindow: { startHour: number; endHour: number; days: number[] };
  /** Every gate must be true before a real call may be placed. */
  complianceChecks: {
    consentCaptured: boolean;
    providerConfigured: boolean;
    numberVerified: boolean;
    windowConfigured: boolean;
  };
}

export interface CallLog extends Entity {
  callCampaignId: string;
  contactId: string;
  status: 'queued' | 'ringing' | 'connected' | 'completed' | 'failed' | 'no_answer';
  startedAt?: string;
  durationS?: number;
  outcome?: string;
  providerCallId?: string;
}

export interface CallTranscript extends Entity {
  callLogId: string;
  turns: { speaker: 'agent' | 'contact'; text: string; atMs: number }[];
  /** PII/PCI redaction happens server-side before storage, never client-side. */
  redacted: boolean;
}

export interface CallSummary extends Entity {
  callLogId: string;
  summary: string;
  extracted?: Record<string, unknown>;
}

/* ==========================================================================
   Platform  [P4–P6]
   ========================================================================== */

export type IntegrationKind =
  | 'salesforce'
  | 'hubspot'
  | 'pipedrive'
  | 'zoho'
  | 'attio'
  | 'other';

/**
 * `intent` is what onboarding records — a stated preference, not a connection.
 * Nothing is authorised and no data moves until the state advances.
 */
export type IntegrationState =
  | 'intent'
  | 'connecting'
  | 'connected'
  | 'error'
  | 'revoked';

export interface IntegrationConnection extends WorkspaceScoped {
  kind: IntegrationKind;
  state: IntegrationState;
  externalAccountId?: string;
  /** Pointer into a secret store. Credentials are never columns. */
  credentialRef?: string;
  lastSyncAt?: string;
}

export interface ApiKey extends WorkspaceScoped {
  name: string;
  /** Display prefix only. The key itself is stored hashed and shown once. */
  prefix: string;
  lastUsedAt?: string;
  revokedAt?: string;
}

export interface WebhookEndpoint extends WorkspaceScoped {
  url: string;
  events: string[];
  secretRef: string;
  active: boolean;
}

export interface WebhookDelivery extends Entity {
  endpointId: string;
  event: string;
  status: 'pending' | 'delivered' | 'failed';
  attempts: number;
  responseCode?: number;
}

export interface AuditLog extends WorkspaceScoped {
  actorId?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  meta?: Record<string, unknown>;
}

/* ==========================================================================
   Provider interface
   Swapping a vendor is an implementation change, never a UI change.
   ========================================================================== */

export type ConfigStatus = 'unconfigured' | 'configured' | 'invalid';
export type CredentialStatus = 'missing' | 'present' | 'expired';

export interface JobState<T> {
  status: JobStatus;
  result?: T;
  error?: JobError;
  usage?: { units: number; kind: CreditKind; cost?: number };
}

export interface Provider<Req, Res> {
  readonly id: string;
  configStatus(): ConfigStatus;
  credentialStatus(): CredentialStatus;
  submit(req: Req): Promise<{ providerRequestId: string }>;
  poll(providerRequestId: string): Promise<JobState<Res>>;
  normalise(raw: unknown): Res;
  classifyError(e: unknown): JobError;
}

export type SearchProvider = Provider<
  { kind: SearchKind; filters: Record<string, unknown>; limit: number },
  SearchResult[]
>;
export type EnrichmentProvider = Provider<
  { rows: { id: string; input: Record<string, unknown> }[]; field: string },
  EnrichmentResult[]
>;
export type EmailProvider = Provider<
  { to: string; from: string; subject: string; body: string },
  { messageId: string }
>;
export type TelephonyProvider = Provider<
  { from: string; to: string; agentVersionId: string },
  { callId: string }
>;
export type TTSProvider = Provider<{ text: string; voice: string }, { audioUrl: string }>;
export type STTProvider = Provider<{ audioUrl: string }, { text: string }>;
export type LLMProvider = Provider<
  { prompt: string; model: string },
  { text: string; tokens: number }
>;
