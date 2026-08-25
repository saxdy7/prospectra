'use client';

import { useRouter } from 'next/navigation';
import { Plus, Upload } from 'lucide-react';
import { PageHeader, EmptyState, DataTable, useToast } from '@/components/app';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { createTable, localBusinessColumns, type DemoTable } from '@/lib/workspace/store';
import { logActivity } from '@/lib/demo-storage/store';

export default function TablesPage() {
  const router = useRouter();
  const ctx = useWorkspace();
  const { push } = useToast();

  if (!ctx) return <PageSkeleton />;

  const { workspaceId, data, persistData } = ctx;

  const newTable = async () => {
    const t = createTable(workspaceId, 'Untitled table', 'leads', localBusinessColumns());
    await persistData({ ...data, tables: [...data.tables, t] });
    await logActivity(workspaceId, 'table', `Created table "${t.name}"`);
    push('Table created', 'success');
    router.push(`/app/tables/${t.id}`);
  };

  return (
    <>
      <PageHeader
        title="Tables"
        description="Every list in Prospectra is a table — sourced, imported, or built from scratch."
        actions={
          <>
            <button className="pa-btn pa-btn--ghost" onClick={() => router.push('/app/imports/new')}>
              <Upload size={15} />
              Import CSV
            </button>
            <button className="pa-btn" onClick={newTable}>
              <Plus size={15} />
              New table
            </button>
          </>
        }
      />

      {data.tables.length === 0 ? (
        <EmptyState
          icon="empty-tables"
          title="No tables yet"
          description="Import a CSV you already keep, or start from an empty grid and add columns as you go."
          action={
            <button className="pa-btn" onClick={() => router.push('/app/imports/new')}>
              <Upload size={15} />
              Import a CSV
            </button>
          }
          secondaryAction={
            <button className="pa-btn pa-btn--ghost" onClick={newTable}>
              <Plus size={15} />
              Start blank
            </button>
          }
        />
      ) : (
        <DataTable<DemoTable>
          columns={[
            { key: 'name', label: 'Name', render: (t) => <span style={{ fontWeight: 600, color: 'var(--lp-text)' }}>{t.name}</span> },
            { key: 'kind', label: 'Kind', render: (t) => t.kind, width: '120px' },
            {
              key: 'rows',
              label: 'Rows',
              width: '100px',
              render: (t) => (data.rows[t.id] ?? []).length
            },
            { key: 'columns', label: 'Columns', width: '100px', render: (t) => t.columns.length },
            {
              key: 'updated',
              label: 'Updated',
              width: '160px',
              render: (t) => new Date(t.updatedAt).toLocaleDateString()
            }
          ]}
          rows={data.tables}
          searchKeys={['name']}
          searchPlaceholder="Search tables…"
          onRowClick={(t) => router.push(`/app/tables/${t.id}`)}
          footer={<span>{data.tables.length} tables</span>}
        />
      )}
    </>
  );
}
