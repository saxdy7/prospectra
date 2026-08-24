'use client';

import type {
  ColumnType,
  ImportJob,
  JobStatus,
  SearchJob,
  SearchKind,
  Table,
  TableColumn,
  TableRow
} from '@/lib/types/models';

/**
 * Phase-3 workspace data store.
 * =============================================================================
 *
 * Tables, rows and jobs, persisted locally. Deliberately shaped like the
 * Postgres schema in `docs/PRODUCT_BLUEPRINT.md` — same field names, same
 * status enums, same foreign keys — so the Supabase implementation replaces
 * this file and nothing else.
 *
 * Rows are stored as a flat `Record<columnKey, unknown>` rather than as the
 * normalised `TableCell` rows the schema defines. That is a deliberate
 * divergence for the local store only: a cell-per-record layout costs a join
 * on every read and buys nothing until enrichment needs per-cell status.
 * `toCells()` exists so the migration is mechanical when it does.
 *
 * Nothing here fabricates data. A table is empty until a user imports into it.
 */

export interface DemoTable extends Table {
  columns: TableColumn[];
}

export interface DemoRow extends TableRow {
  values: Record<string, unknown>;
  /** Per-cell status, only populated once something has run against the row. */
  cellStatus?: Record<string, 'queued' | 'running' | 'filled' | 'failed'>;
}

export interface WorkspaceData {
  version: 1;
  tables: DemoTable[];
  rows: Record<string, DemoRow[]>;
  searchJobs: SearchJob[];
  importJobs: ImportJob[];
}

export interface WorkspaceDataStore {
  read(): Promise<WorkspaceData>;
  write(data: WorkspaceData): Promise<void>;
  clear(): Promise<void>;
}

export const DATA_KEY = 'prospectra:data:v1';

function empty(): WorkspaceData {
  return { version: 1, tables: [], rows: {}, searchJobs: [], importJobs: [] };
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export const localDataStore: WorkspaceDataStore = {
  async read() {
    if (!isBrowser()) return empty();
    try {
      const raw = window.localStorage.getItem(DATA_KEY);
      if (!raw) return empty();
      const parsed = JSON.parse(raw) as Partial<WorkspaceData>;
      if (parsed.version !== 1) return empty();
      return {
        version: 1,
        tables: Array.isArray(parsed.tables) ? parsed.tables : [],
        rows: typeof parsed.rows === 'object' && parsed.rows ? parsed.rows : {},
        searchJobs: Array.isArray(parsed.searchJobs) ? parsed.searchJobs : [],
        importJobs: Array.isArray(parsed.importJobs) ? parsed.importJobs : []
      };
    } catch {
      /* Malformed JSON or a private-mode denial. Degrading to an empty
         workspace beats crashing the page. */
      return empty();
    }
  },

  async write(data) {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(DATA_KEY, JSON.stringify(data));
    } catch {
      /* Quota exceeded. The session stays usable in memory; only persistence
         across reloads is lost. */
    }
  },

  async clear() {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(DATA_KEY);
    } catch {
      /* Nothing actionable. */
    }
  }
};

/** TODO(backend): swap for a Supabase-backed implementation. */
export const dataStore: WorkspaceDataStore = localDataStore;

/* ==========================================================================
   Helpers
   ========================================================================== */

export function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

function stamp() {
  const now = new Date().toISOString();
  return { createdAt: now, updatedAt: now };
}

export function makeColumn(
  label: string,
  type: ColumnType,
  position: number,
  config?: Record<string, unknown>
): TableColumn {
  return {
    id: newId(),
    tableId: '',
    key: label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, ''),
    label,
    type,
    position,
    config,
    ...stamp()
  };
}

/** The column set a local-business search produces, per docs/01. */
export function localBusinessColumns(): TableColumn[] {
  return [
    makeColumn('Status', 'status', 0),
    makeColumn('Business name', 'text', 1),
    makeColumn('Category', 'text', 2),
    makeColumn('Phone', 'phone', 3),
    makeColumn('Address', 'text', 4),
    makeColumn('Rating', 'rating', 5),
    makeColumn('Reviews', 'number', 6),
    makeColumn('Website', 'url', 7)
  ];
}

export function createTable(
  workspaceId: string,
  name: string,
  kind: Table['kind'],
  columns: TableColumn[]
): DemoTable {
  const id = newId();
  return {
    id,
    workspaceId,
    name,
    kind,
    rowCount: 0,
    columns: columns.map((c) => ({ ...c, tableId: id })),
    ...stamp()
  };
}

export function createRow(
  tableId: string,
  position: number,
  values: Record<string, unknown>,
  source: TableRow['provenance']['source'],
  provider?: string
): DemoRow {
  return {
    id: newId(),
    tableId,
    position,
    status: 'ready',
    values,
    provenance: { source, provider, fetchedAt: new Date().toISOString() },
    ...stamp()
  };
}

/**
 * Flatten a row into the normalised `TableCell` shape the schema defines.
 * Unused by the local store; exists so the Supabase migration is mechanical
 * rather than a rewrite.
 */
export function toCells(row: DemoRow, columns: TableColumn[]) {
  return columns.map((col) => ({
    rowId: row.id,
    columnId: col.id,
    value: row.values[col.key] ?? null,
    status: row.cellStatus?.[col.key] ?? ('filled' as const)
  }));
}

export function createSearchJob(
  workspaceId: string,
  kind: SearchKind,
  filters: Record<string, unknown>
): SearchJob {
  return {
    id: newId(),
    workspaceId,
    kind,
    filters,
    status: 'draft',
    resultCount: 0,
    retryCount: 0,
    ...stamp()
  };
}

/** Human label for a job state. Colour is never the only signal. */
export const JOB_LABEL: Record<JobStatus, string> = {
  draft: 'Draft',
  queued: 'Queued',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled'
};

export const JOB_TONE: Record<JobStatus, 'muted' | 'soft' | 'success' | 'warn'> = {
  draft: 'muted',
  queued: 'soft',
  running: 'soft',
  completed: 'success',
  failed: 'warn',
  cancelled: 'muted'
};
