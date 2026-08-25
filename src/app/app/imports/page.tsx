'use client';

import { useRouter } from 'next/navigation';
import { FileSpreadsheet, Plus, Table2 } from 'lucide-react';
import { PageHeader, DataTable, EmptyState } from '@/components/app';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import type { ImportJob } from '@/lib/types/models';

export default function ImportsPage() {
  const router = useRouter();
  const ctx = useWorkspace();

  if (!ctx) return <PageSkeleton />;

  const { data } = ctx;

  return (
    <>
      <PageHeader
        title="Imports"
        description="Every CSV you bring in becomes a table, with a record of what was mapped and what was skipped."
        actions={
          <button className="pa-btn" onClick={() => router.push('/app/imports/new')}>
            <Plus size={15} />
            New import
          </button>
        }
      />

      {data.importJobs.length === 0 ? (
        <EmptyState
          icon="empty-imports"
          title="No imports yet"
          description="Bring in a CSV of leads, contacts or companies you already keep — Prospectra maps the columns and flags duplicates before anything is added."
          action={
            <button className="pa-btn" onClick={() => router.push('/app/imports/new')}>
              <FileSpreadsheet size={15} />
              Import a CSV
            </button>
          }
        />
      ) : (
        <DataTable<ImportJob>
          columns={[
            {
              key: 'file',
              label: 'File',
              render: (j) => <span style={{ fontWeight: 600, color: 'var(--lp-text)' }}>{j.filePath}</span>
            },
            { key: 'status', label: 'Status', width: '120px', render: (j) => j.status },
            {
              key: 'rows',
              label: 'Rows',
              width: '200px',
              render: (j) => `${j.rowCounts.imported} imported · ${j.rowCounts.duplicate} dup · ${j.rowCounts.invalid} invalid`
            },
            {
              key: 'table',
              label: 'Table',
              render: (j) =>
                j.tableId ? (
                  <button
                    className="pa-btn pa-btn--quiet"
                    style={{ padding: '4px 10px', height: 'auto' }}
                    onClick={() => router.push(`/app/tables/${j.tableId}`)}
                  >
                    <Table2 size={13} />
                    Open table
                  </button>
                ) : (
                  '—'
                )
            }
          ]}
          rows={data.importJobs}
          footer={<span>{data.importJobs.length} imports</span>}
        />
      )}
    </>
  );
}
