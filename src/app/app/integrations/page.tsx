'use client';

import { useState } from 'react';
import { PageHeader, StatusPill } from '@/components/app';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { INTEGRATIONS, INTEGRATION_CATEGORY_LABELS } from '@/lib/mock-data/integrations';
import type { IntegrationCategory } from '@/lib/types/product';

const CATEGORIES: IntegrationCategory[] = ['crm', 'enrichment', 'llm', 'email', 'telephony', 'storage'];

export default function IntegrationsPage() {
  const ctx = useWorkspace();
  const [filter, setFilter] = useState<'all' | IntegrationCategory>('all');

  if (!ctx) return <PageSkeleton />;

  const filtered = INTEGRATIONS.filter((i) => filter === 'all' || i.category === filter);

  return (
    <>
      <PageHeader title="Integrations" description="Every provider Prospectra can connect to. None are connected yet in this milestone." />

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        <button className="pa-chip" style={filter === 'all' ? { borderColor: 'var(--lp-blue-core)', color: 'var(--lp-blue-mid)' } : undefined} onClick={() => setFilter('all')}>
          All
        </button>
        {CATEGORIES.map((c) => (
          <button key={c} className="pa-chip" style={filter === c ? { borderColor: 'var(--lp-blue-core)', color: 'var(--lp-blue-mid)' } : undefined} onClick={() => setFilter(c)}>
            {INTEGRATION_CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="pa-grid pa-grid--two" style={{ marginTop: 0 }}>
        {filtered.map((i) => (
          <div key={i.id} className="pa-panel" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p className="pa-h3" style={{ fontSize: '0.9375rem' }}>
                {i.name}
              </p>
              <StatusPill label={i.status === 'coming_soon' ? 'Coming soon' : 'Not connected'} tone="muted" />
            </div>
            <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)', lineHeight: 1.5, flex: 1 }}>{i.blurb}</p>
            <button className="pa-btn pa-btn--ghost" style={{ height: 36 }} disabled>
              Connect
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
