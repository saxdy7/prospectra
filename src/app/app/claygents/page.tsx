'use client';

import { useRouter } from 'next/navigation';
import { Bot, Plus } from 'lucide-react';
import { PageHeader, DataTable, EmptyState } from '@/components/app';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { CLAYGENT_TEMPLATES } from '@/lib/mock-data/claygent-templates';
import type { Claygent } from '@/lib/types/product';

export default function ClaygentsPage() {
  const router = useRouter();
  const ctx = useWorkspace();
  if (!ctx) return <PageSkeleton />;

  const { product } = ctx;

  return (
    <>
      <PageHeader
        title="Claygent research"
        description="AI research agents that read a page and fill in the columns you ask for."
        actions={
          <button className="pa-btn" onClick={() => router.push('/app/claygents/new')}>
            <Plus size={15} />
            New research agent
          </button>
        }
      />

      <p className="pa-h3" style={{ marginBottom: 14 }}>
        Starter templates
      </p>
      <div className="pa-grid pa-grid--two" style={{ marginTop: 0, marginBottom: 28 }}>
        {CLAYGENT_TEMPLATES.map((t) => (
          <button
            key={t.name}
            className="pa-panel"
            style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8 }}
            onClick={() => router.push(`/app/claygents/new?template=${t.template}`)}
          >
            <span style={{ width: 36, height: 36, borderRadius: 10, display: 'grid', placeItems: 'center', background: 'rgba(40,95,255,.12)', color: 'var(--lp-blue-mid)' }}>
              <Bot size={16} />
            </span>
            <p className="pa-h3" style={{ fontSize: '0.9375rem' }}>{t.name}</p>
            <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)', lineHeight: 1.5 }}>{t.inputDescription}</p>
          </button>
        ))}
      </div>

      <p className="pa-h3" style={{ marginBottom: 14 }}>
        Your research agents
      </p>
      {product.claygents.length === 0 ? (
        <EmptyState
          icon="empty-claygents"
          title="No research agents yet"
          description="Start from a template above, or build one from scratch — write the prompt and pick the output columns."
          action={
            <button className="pa-btn" onClick={() => router.push('/app/claygents/new')}>
              <Plus size={15} />
              New research agent
            </button>
          }
        />
      ) : (
        <DataTable<Claygent>
          columns={[
            { key: 'name', label: 'Name', render: (c) => <span style={{ fontWeight: 600, color: 'var(--lp-text)' }}>{c.name}</span> },
            { key: 'template', label: 'Template', render: (c) => c.template.replace('_', ' ') },
            { key: 'outputs', label: 'Outputs', render: (c) => c.outputColumns.length },
            { key: 'status', label: 'Status', width: '100px', render: (c) => c.status }
          ]}
          rows={product.claygents}
          searchKeys={['name']}
          footer={<span>{product.claygents.length} agents</span>}
        />
      )}
    </>
  );
}
