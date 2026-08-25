'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Users } from 'lucide-react';
import { PageHeader, DataTable, EmptyState, Drawer, ConfirmDialog, useToast } from '@/components/app';
import { TextField, SelectField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { newId, type DemoAudience } from '@/lib/workspace/store';
import { logActivity } from '@/lib/demo-storage/store';

export default function AudiencesPage() {
  const router = useRouter();
  const ctx = useWorkspace();
  const { push } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [name, setName] = useState('');
  const [tableId, setTableId] = useState('');
  const [pendingDelete, setPendingDelete] = useState<DemoAudience | null>(null);

  if (!ctx) return <PageSkeleton />;

  const { workspaceId, data, persistData } = ctx;
  const effectiveTableId = tableId || data.tables[0]?.id || '';
  const rows = data.rows[effectiveTableId] ?? [];

  const create = async () => {
    const a: DemoAudience = {
      id: newId(),
      workspaceId,
      name: name.trim() || 'Untitled audience',
      sourceTableId: effectiveTableId,
      memberIds: rows.map((r) => r.id),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await persistData({ ...data, audiences: [a, ...data.audiences] });
    await logActivity(workspaceId, 'workspace', `Created audience "${a.name}"`, `${a.memberIds.length} members`);
    push('Audience created', 'success');
    setDrawerOpen(false);
    setName('');
    router.push(`/app/audiences/${a.id}`);
  };

  const remove = async (id: string) => {
    await persistData({ ...data, audiences: data.audiences.filter((a) => a.id !== id) });
    push('Audience deleted', 'success');
  };

  return (
    <>
      <PageHeader
        title="Audiences"
        description="A saved slice of a table, shaped for one campaign or agent."
        actions={
          data.tables.length > 0 && (
            <button className="pa-btn" onClick={() => setDrawerOpen(true)}>
              <Plus size={15} />
              New audience
            </button>
          )
        }
      />

      {data.tables.length === 0 ? (
        <EmptyState
          icon="empty-audiences"
          title="No tables to build from"
          description="An audience is a slice of a table. Import a CSV or build a table first, then come back."
          action={
            <button className="pa-btn" onClick={() => router.push('/app/tables')}>
              Go to tables
            </button>
          }
        />
      ) : data.audiences.length === 0 ? (
        <EmptyState
          icon="empty-audiences"
          title="No audiences yet"
          description="Group the rows worth saying the same thing to."
          action={
            <button className="pa-btn" onClick={() => setDrawerOpen(true)}>
              <Plus size={15} />
              Build your first audience
            </button>
          }
        />
      ) : (
        <DataTable<DemoAudience>
          columns={[
            {
              key: 'name',
              label: 'Name',
              render: (a) => (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: 'var(--lp-text)' }}>
                  <Users size={14} />
                  {a.name}
                </span>
              )
            },
            { key: 'source', label: 'Source table', render: (a) => data.tables.find((t) => t.id === a.sourceTableId)?.name ?? 'Deleted table' },
            { key: 'members', label: 'Members', width: '110px', render: (a) => a.memberIds.length },
            {
              key: 'actions',
              label: '',
              width: '60px',
              render: (a) => (
                <button
                  className="pa-icon-btn"
                  aria-label={`Delete ${a.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingDelete(a);
                  }}
                >
                  <Trash2 size={14} />
                </button>
              )
            }
          ]}
          rows={data.audiences}
          searchKeys={['name']}
          searchPlaceholder="Search audiences…"
          onRowClick={(a) => router.push(`/app/audiences/${a.id}`)}
          footer={<span>{data.audiences.length} audiences</span>}
        />
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Build an audience"
        footer={
          <>
            <button className="pa-btn pa-btn--ghost" onClick={() => setDrawerOpen(false)}>
              Cancel
            </button>
            <button className="pa-btn" onClick={create} disabled={!effectiveTableId || rows.length === 0}>
              Create audience
            </button>
          </>
        }
      >
        <TextField label="Name" placeholder="Manali hotels, 4★+" value={name} onChange={(e) => setName(e.target.value)} />
        <SelectField
          label="Source table"
          value={effectiveTableId}
          onChange={(e) => setTableId(e.target.value)}
          options={data.tables.map((t) => ({ value: t.id, label: `${t.name} (${(data.rows[t.id] ?? []).length} rows)` }))}
        />
        <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)' }}>
          {rows.length} contacts will be included. Filtering a slice arrives with saved table views.
        </p>
      </Drawer>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove(pendingDelete.id)}
        title="Delete this audience?"
        description={`"${pendingDelete?.name}" will be removed. Any campaigns linked to it will lose their audience.`}
        confirmLabel="Delete audience"
      />
    </>
  );
}
