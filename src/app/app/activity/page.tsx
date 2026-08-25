'use client';

import { useState } from 'react';
import { PageHeader, EmptyState } from '@/components/app';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import type { ActivityCategory } from '@/lib/types/product';

const CATEGORIES: { id: ActivityCategory; label: string }[] = [
  { id: 'search', label: 'Search' },
  { id: 'table', label: 'Tables' },
  { id: 'enrichment', label: 'Enrichment' },
  { id: 'campaign', label: 'Campaigns' },
  { id: 'voice', label: 'Voice' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'integration', label: 'Integrations' }
];

export default function ActivityPage() {
  const ctx = useWorkspace();
  const [filter, setFilter] = useState<'all' | ActivityCategory>('all');

  if (!ctx) return <PageSkeleton />;

  const { product } = ctx;
  const events = product.activity.filter((e) => filter === 'all' || e.category === filter);

  return (
    <>
      <PageHeader title="Activity" description="Every real action taken in this workspace, in order." />

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        <button className="pa-chip" style={filter === 'all' ? { borderColor: 'var(--lp-blue-core)', color: 'var(--lp-blue-mid)' } : undefined} onClick={() => setFilter('all')}>
          All
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className="pa-chip" style={filter === c.id ? { borderColor: 'var(--lp-blue-core)', color: 'var(--lp-blue-mid)' } : undefined} onClick={() => setFilter(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon="empty-activity"
          title="Nothing here yet"
          description="Searches, imports, drafts and everything else you do in the workspace will show up here, in order."
        />
      ) : (
        <div className="pa-panel">
          <ol style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18, paddingLeft: 20, margin: 0 }}>
            <span aria-hidden="true" style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 1, background: 'var(--lp-line-strong)' }} />
            {events.map((e) => (
              <li key={e.id} style={{ position: 'relative' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: -20, top: 5, width: 9, height: 9, borderRadius: '50%', background: 'var(--lp-blue-core)', border: '2px solid var(--pa-surface-solid)' }} />
                <p style={{ fontSize: 'var(--lp-t-sm)', fontWeight: 500, color: 'var(--lp-text)', margin: 0 }}>{e.label}</p>
                {e.detail && <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)', margin: '2px 0 0' }}>{e.detail}</p>}
                <time style={{ fontSize: 11, color: 'var(--lp-text-faint)', display: 'block', marginTop: 2 }} dateTime={e.createdAt}>
                  {new Date(e.createdAt).toLocaleString()}
                </time>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}
