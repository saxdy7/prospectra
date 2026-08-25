'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Info, Plus, Settings2, Upload } from 'lucide-react';
import { PageHeader, Tabs, Drawer, DemoTag, EmptyState, useToast } from '@/components/app';
import { TextField, SelectField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { DataTable as GridTable } from '@/components/workspace/tables/DataTable';
import { makeColumn } from '@/lib/workspace/store';
import type { ColumnType } from '@/lib/types/models';

const COLUMN_TYPES: { value: ColumnType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'url', label: 'URL' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'rating', label: 'Rating' },
  { value: 'status', label: 'Status' },
  { value: 'date', label: 'Date' },
  { value: 'enrichment', label: 'Enrichment (provider chain)' },
  { value: 'ai_formula', label: 'AI formula' }
];

export default function TableDetailPage({ params }: { params: Promise<{ tableId: string }> }) {
  const { tableId } = use(params);
  const router = useRouter();
  const ctx = useWorkspace();
  const { push } = useToast();
  const [tab, setTab] = useState('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [colLabel, setColLabel] = useState('');
  const [colType, setColType] = useState<ColumnType>('text');
  const [autoRun, setAutoRun] = useState(false);

  if (!ctx) return <PageSkeleton />;

  const { data, persistData } = ctx;
  const table = data.tables.find((t) => t.id === tableId);

  if (!table) {
    return (
      <EmptyState
        icon="empty-tables"
        title="Table not found"
        description="This table may have been deleted, or the link is out of date."
        action={
          <button className="pa-btn" onClick={() => router.push('/app/tables')}>
            <ArrowLeft size={15} />
            Back to tables
          </button>
        }
      />
    );
  }

  const rows = data.rows[table.id] ?? [];

  const addColumn = async () => {
    if (!colLabel.trim()) return;
    const col = makeColumn(colLabel.trim(), colType, table.columns.length);
    const nextTable = { ...table, columns: [...table.columns, { ...col, tableId: table.id }] };
    await persistData({
      ...data,
      tables: data.tables.map((t) => (t.id === table.id ? nextTable : t))
    });
    push(`Added column "${colLabel.trim()}"`, 'success');
    setColLabel('');
    setColType('text');
    setDrawerOpen(false);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Tables', href: '/app/tables' }, { label: table.name }]}
        title={table.name}
        description={`${rows.length} rows · ${table.columns.length} columns`}
        actions={
          <>
            <button
              className="pa-btn pa-btn--ghost"
              onClick={() => setAutoRun((v) => !v)}
              title="Auto-run queues enrichment for every new row automatically"
            >
              {autoRun ? 'Auto-run: on' : 'Auto-run: off'}
              <DemoTag kind="demo" />
            </button>
            <button className="pa-btn pa-btn--ghost" onClick={() => setDrawerOpen(true)}>
              <Settings2 size={15} />
              Manage columns
            </button>
            <button className="pa-btn" onClick={() => router.push('/app/imports/new')}>
              <Upload size={15} />
              Import rows
            </button>
          </>
        }
        tabs={
          <Tabs
            items={[
              { id: 'grid', label: 'Grid' },
              { id: 'views', label: 'Views' },
              { id: 'activity', label: 'Activity' }
            ]}
            active={tab}
            onChange={setTab}
          />
        }
      />

      {tab === 'grid' && (
        <GridTable
          columns={table.columns}
          rows={rows}
          onCreateFirst={() => router.push('/app/imports/new')}
        />
      )}

      {tab === 'views' && (
        <EmptyState
          icon="empty-tables"
          title="Only the default view exists"
          description="Saved views — a named filter and sort combination you can switch back to — are designed but not built in this milestone."
          action={<DemoTag kind="coming-soon" />}
        />
      )}

      {tab === 'activity' && (
        <EmptyState
          icon="empty-activity"
          title="No activity yet"
          description="Column changes, imports and enrichment runs on this table will show up here."
        />
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Add column"
        description="New columns appear at the end of the grid — drag to reorder from the header once added."
        footer={
          <>
            <button className="pa-btn pa-btn--ghost" onClick={() => setDrawerOpen(false)}>
              Cancel
            </button>
            <button className="pa-btn" onClick={addColumn} disabled={!colLabel.trim()}>
              <Plus size={15} />
              Add column
            </button>
          </>
        }
      >
        <TextField
          label="Column name"
          placeholder="e.g. LinkedIn URL"
          value={colLabel}
          onChange={(e) => setColLabel(e.target.value)}
        />
        <SelectField
          label="Column type"
          value={colType}
          onChange={(e) => setColType(e.target.value as ColumnType)}
          options={COLUMN_TYPES}
        />
        {(colType === 'enrichment' || colType === 'ai_formula') && (
          <p style={{ display: 'flex', gap: 8, fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)', alignItems: 'flex-start' }}>
            <Info size={14} style={{ flexShrink: 0, marginTop: 2 }} />
            {colType === 'enrichment'
              ? 'Enrichment columns run against a provider chain once one is connected. Connect a provider on the Integrations page to activate.'
              : 'AI formula columns run against a connected model provider. Connect one on the Integrations page to activate.'}
          </p>
        )}
      </Drawer>
    </>
  );
}
