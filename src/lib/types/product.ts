/**
 * Prospectra product-surface models.
 * =============================================================================
 *
 * Sibling to `models.ts`: the domain objects there mirror the Postgres schema
 * in `docs/PRODUCT_BLUEPRINT.md` directly. The concepts here — Claygents,
 * functions, workflows, MCP settings, concurrency — are frontend-milestone
 * additions with no schema yet, so they are kept separate rather than forcing
 * a premature shape onto the real backend contract.
 *
 * Same conventions as models.ts: every workspace-owned model carries
 * `workspaceId`, timestamps are ISO 8601 strings, status values are string
 * unions.
 */

import type { Entity, WorkspaceScoped, JobStatus } from './models';

/* ==========================================================================
   Claygents — AI research agents
   ========================================================================== */

export type ClaygentTemplateId =
  | 'prospecting'
  | 'account_scoring'
  | 'contact_scoring'
  | 'copywriting';

export interface ClaygentOutputColumn {
  id: string;
  label: string;
  type: 'text' | 'number' | 'status' | 'url';
  description: string;
}

export interface Claygent extends WorkspaceScoped {
  name: string;
  template: ClaygentTemplateId;
  prompt: string;
  inputTableId?: string;
  inputDescription: string;
  outputColumns: ClaygentOutputColumn[];
  runSettings: {
    model: string;
    maxRowsPerRun: number;
    creditsPerRow: number;
  };
  status: 'draft' | 'ready';
  lastRun?: {
    at: string;
    rowCount: number;
    status: JobStatus;
  };
}

/* ==========================================================================
   Functions — the formula / enrichment-function registry
   ========================================================================== */

export type FunctionCategory =
  | 'formatting'
  | 'enrichment'
  | 'validation'
  | 'ai'
  | 'utility';

export interface FunctionDef extends Entity {
  /** Undefined for built-in starter functions, set for a workspace's own. */
  workspaceId?: string;
  name: string;
  category: FunctionCategory;
  description: string;
  signature: string;
  example: string;
  isBuiltIn: boolean;
  usageCount: number;
}

/* ==========================================================================
   Workflows — the visual automation builder
   ========================================================================== */

export type WorkflowNodeKind =
  | 'trigger'
  | 'search'
  | 'enrich'
  | 'filter'
  | 'claygent'
  | 'campaign'
  | 'voice_call'
  | 'webhook'
  | 'delay';

export interface WorkflowNode {
  id: string;
  kind: WorkflowNodeKind;
  label: string;
  x: number;
  y: number;
  config?: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
}

export type WorkflowStatus = 'draft' | 'active' | 'paused';

export interface Workflow extends WorkspaceScoped {
  name: string;
  description: string;
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  /** Always false in this milestone — no workflow actually executes yet. */
  isTemplate: boolean;
}

/* ==========================================================================
   MCP — Model Context Protocol settings
   ========================================================================== */

export interface McpClientPermission {
  clientId: string;
  clientName: string;
  allowedFunctions: string[];
  status: 'not_connected' | 'connected' | 'revoked';
  lastUsedAt?: string;
}

export interface McpSettings extends WorkspaceScoped {
  defaultCreditLimit: number;
  functionVisibility: 'all' | 'allowlist';
  allowlistedFunctionIds: string[];
  clients: McpClientPermission[];
}

/* ==========================================================================
   Concurrency — voice-call capacity allocation
   ========================================================================== */

export interface ConcurrencyReservation {
  id: string;
  agentId: string;
  agentName: string;
  reserved: number;
  priority: 'low' | 'normal' | 'high';
}

export interface ConcurrencySettings extends WorkspaceScoped {
  totalCapacity: number;
  reservations: ConcurrencyReservation[];
  /** Capacity not assigned to any reservation, shared on demand. */
  sharedPool: number;
}

/* ==========================================================================
   Activity feed
   ========================================================================== */

export type ActivityCategory =
  | 'search'
  | 'table'
  | 'enrichment'
  | 'campaign'
  | 'voice'
  | 'workspace'
  | 'integration';

export interface ActivityEvent extends WorkspaceScoped {
  category: ActivityCategory;
  label: string;
  detail?: string;
  actor: string;
}

/* ==========================================================================
   WhatsApp deployment
   ========================================================================== */

export interface WhatsAppDeployment extends WorkspaceScoped {
  agentId?: string;
  numberId?: string;
  status: 'not_configured' | 'pending' | 'active';
}

/* ==========================================================================
   Integrations directory — presentational metadata for /app/integrations
   ========================================================================== */

export type IntegrationCategory =
  | 'crm'
  | 'enrichment'
  | 'llm'
  | 'email'
  | 'telephony'
  | 'storage';

export interface IntegrationListing {
  id: string;
  name: string;
  category: IntegrationCategory;
  blurb: string;
  status: 'not_connected' | 'coming_soon';
}
