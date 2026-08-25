'use client';

import type {
  ApiKey,
  IntegrationConnection,
  KnowledgeBaseCollection,
  KnowledgeBaseDocument,
  PhoneNumber,
  WebhookDelivery,
  WebhookEndpoint
} from '@/lib/types/models';
import type {
  ActivityEvent,
  Claygent,
  ConcurrencySettings,
  FunctionDef,
  McpSettings,
  WhatsAppDeployment,
  Workflow
} from '@/lib/types/product';

/**
 * Demo-storage — localStorage-backed state for the product-surface entities
 * added in the frontend milestone (Claygents, functions, workflows, MCP,
 * concurrency, webhooks, WhatsApp, phone numbers, knowledge base,
 * integration "intent" clicks, activity, API keys).
 *
 * Sibling to `lib/workspace/store.ts`, which already owns tables, rows,
 * search jobs, audiences, campaigns and voice agents. Split into a second
 * file rather than folded into that one so each stays a manageable, focused
 * read of what it owns.
 *
 * Same rule as the sibling store: nothing here fabricates data. Every array
 * starts empty; the only way it fills is a real click in the UI — including
 * clicking a "Load sample data" action, which calls `seedDemoContent()`
 * below and is always an explicit, labelled user choice.
 */

export interface ProductData {
  version: 1;
  claygents: Claygent[];
  functions: FunctionDef[];
  workflows: Workflow[];
  webhooks: WebhookEndpoint[];
  webhookDeliveries: WebhookDelivery[];
  mcp: McpSettings | null;
  concurrency: ConcurrencySettings | null;
  whatsapp: WhatsAppDeployment | null;
  phoneNumbers: PhoneNumber[];
  kbCollections: KnowledgeBaseCollection[];
  kbDocuments: KnowledgeBaseDocument[];
  /** Tracks "Request access" clicks in the integrations directory — intent
      only, never an actual connection (see IntegrationState in models.ts). */
  integrationConnections: IntegrationConnection[];
  activity: ActivityEvent[];
  apiKeys: ApiKey[];
}

export interface ProductDataStore {
  read(): Promise<ProductData>;
  write(data: ProductData): Promise<void>;
  clear(): Promise<void>;
}

export const PRODUCT_DATA_KEY = 'prospectra:product:v1';

function empty(): ProductData {
  return {
    version: 1,
    claygents: [],
    functions: [],
    workflows: [],
    webhooks: [],
    webhookDeliveries: [],
    mcp: null,
    concurrency: null,
    whatsapp: null,
    phoneNumbers: [],
    kbCollections: [],
    kbDocuments: [],
    integrationConnections: [],
    activity: [],
    apiKeys: []
  };
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export const localProductStore: ProductDataStore = {
  async read() {
    if (!isBrowser()) return empty();
    try {
      const raw = window.localStorage.getItem(PRODUCT_DATA_KEY);
      if (!raw) return empty();
      const parsed = JSON.parse(raw) as Partial<ProductData>;
      if (parsed.version !== 1) return empty();
      const base = empty();
      return { ...base, ...parsed, version: 1 };
    } catch {
      return empty();
    }
  },

  async write(data) {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(PRODUCT_DATA_KEY, JSON.stringify(data));
    } catch {
      /* Quota exceeded or blocked — session stays usable in memory. */
    }
  },

  async clear() {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(PRODUCT_DATA_KEY);
    } catch {
      /* Nothing actionable. */
    }
  }
};

/** TODO(backend): swap for a Supabase-backed implementation. */
export const productStore: ProductDataStore = localProductStore;

export function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

export function stamp() {
  const now = new Date().toISOString();
  return { createdAt: now, updatedAt: now };
}

/**
 * Record one activity-feed entry and persist it. Pages call this after a
 * mock create/update/delete so the activity feed reflects real user actions
 * — never invented history.
 */
export async function logActivity(
  workspaceId: string,
  category: ActivityEvent['category'],
  label: string,
  detail?: string
) {
  const data = await productStore.read();
  const event: ActivityEvent = {
    id: newId(),
    workspaceId,
    category,
    label,
    detail,
    actor: 'you',
    ...stamp()
  };
  data.activity = [event, ...data.activity].slice(0, 200);
  await productStore.write(data);
  return event;
}
