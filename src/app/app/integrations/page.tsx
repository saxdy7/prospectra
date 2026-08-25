'use client';

import { useState } from 'react';
import { Plug, Search } from 'lucide-react';
import { PageHeader, StatusPill, EmptyState, FeatureRequestModal } from '@/components/app';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { INTEGRATIONS, INTEGRATION_CATEGORY_LABELS } from '@/lib/mock-data/integrations';
import type { IntegrationCategory } from '@/lib/types/product';

const CATEGORIES: IntegrationCategory[] = ['crm', 'enrichment', 'llm', 'email', 'telephony', 'storage'];

export default function IntegrationsPage() {
  const ctx = useWorkspace();
  const [filter, setFilter] = useState<'all' | IntegrationCategory>('all');
  const [query, setQuery] = useState('');
  const [requestOpen, setRequestOpen] = useState(false);

  if (!ctx) return <PageSkeleton />;

  const q = query.trim().toLowerCase();
  const filtered = INTEGRATIONS.filter((i) => {
    if (filter !== 'all' && i.category !== filter) return false;
    if (q && !i.name.toLowerCase().includes(q) && !i.blurb.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        title="Integrations"
        description="Every provider Prospectra can connect to. None are connected yet in this milestone."
        actions={
          <button className="pa-btn pa-btn--ghost" onClick={() => setRequestOpen(true)}>
            <Plug size={15} />
            Request integration
          </button>
        }
      />

      <div className="pa-table-search" style={{ maxWidth: 340, marginBottom: 16 }}>
        <Search size={15} />
        <input
          placeholder="Search integrations…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search integrations"
        />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        <button
          className="pa-chip"
          data-active={filter === 'all' ? '' : undefined}
          onClick={() => setFilter('all')}
        >
          All <span style={{ opacity: 0.6 }}>{INTEGRATIONS.length}</span>
        </button>
        {CATEGORIES.map((c) => {
          const count = INTEGRATIONS.filter((i) => i.category === c).length;
          return (
            <button
              key={c}
              className="pa-chip"
              data-active={filter === c ? '' : undefined}
              onClick={() => setFilter(c)}
            >
              {INTEGRATION_CATEGORY_LABELS[c]} <span style={{ opacity: 0.6 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="empty-integrations"
          title={q ? `No results for "${query}"` : 'No integrations in this category'}
          description={q ? 'Try a different search term, or clear the filter above.' : 'Choose a different category, or view all providers.'}
          action={
            <button className="pa-btn pa-btn--ghost" onClick={() => { setFilter('all'); setQuery(''); }}>
              Clear filters
            </button>
          }
        />
      ) : (
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
      )}

      <FeatureRequestModal open={requestOpen} onClose={() => setRequestOpen(false)} defaultCategory="integration" />
    </>
  );
}
