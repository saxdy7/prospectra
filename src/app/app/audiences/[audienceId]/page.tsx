'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { PageHeader, DataTable, EmptyState } from '@/components/app';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import type { DemoRow } from '@/lib/workspace/store';

export default function AudienceDetailPage({ params }: { params: Promise<{ audienceId: string }> }) {
  const { audienceId } = use(params);
  const router = useRouter();
  const ctx = useWorkspace();

  if (!ctx) return <PageSkeleton />;

  const { data } = ctx;
  const audience = data.audiences.find((a) => a.id === audienceId);

  if (!audience) {
    return (
      <EmptyState
        icon="empty-audiences"
        title="Audience not found"
        description="This audience may have been deleted, or the link is out of date."
        action={
          <button className="pa-btn" onClick={() => router.push('/app/audiences')}>
            <ArrowLeft size={15} />
            Back to audiences
          </button>
        }
      />
    );
  }

  const table = data.tables.find((t) => t.id === audience.sourceTableId);
  const allRows = data.rows[audience.sourceTableId] ?? [];
  const memberRows = allRows.filter((r) => audience.memberIds.includes(r.id));
  const linkedCampaigns = data.campaigns.filter((c) => c.audienceId === audience.id);
  const emailCol = table?.columns.find((c) => c.type === 'email');
  const phoneCol = table?.columns.find((c) => c.type === 'phone');
  const nameCol = table?.columns.find((c) => c.key === 'name' || c.key === 'business_name') ?? table?.columns[0];

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Audiences', href: '/app/audiences' }, { label: audience.name }]}
        title={audience.name}
        description={`${memberRows.length} members · from ${table?.name ?? 'a deleted table'}`}
        actions={
          <button className="pa-btn" onClick={() => router.push(`/app/campaigns/new?audience=${audience.id}`)}>
            <Send size={15} />
            Start a campaign
          </button>
        }
      />

      {linkedCampaigns.length > 0 && (
        <div className="pa-panel" style={{ marginBottom: 18 }}>
          <p className="pa-h3" style={{ marginBottom: 10 }}>
            Linked campaigns
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {linkedCampaigns.map((c) => (
              <button
                key={c.id}
                className="pa-btn pa-btn--ghost"
                style={{ height: 36, padding: '0 14px' }}
                onClick={() => router.push(`/app/campaigns/${c.id}`)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {memberRows.length === 0 ? (
        <EmptyState
          icon="empty-audiences"
          title="No members"
          description="Every row from the source table was removed, or the table is empty."
        />
      ) : (
        <DataTable<DemoRow>
          columns={[
            {
              key: 'name',
              label: 'Contact',
              render: (r) => (
                <span style={{ color: 'var(--lp-text)', fontWeight: 500 }}>
                  {nameCol ? String(r.values[nameCol.key] ?? '—') : r.id.slice(0, 8)}
                </span>
              )
            },
            ...(emailCol ? [{ key: 'email', label: 'Email', render: (r: DemoRow) => String(r.values[emailCol.key] ?? '—') }] : []),
            ...(phoneCol ? [{ key: 'phone', label: 'Phone', render: (r: DemoRow) => String(r.values[phoneCol.key] ?? '—') }] : []),
            { key: 'status', label: 'Row status', width: '120px', render: (r) => r.status }
          ]}
          rows={memberRows}
          footer={<span>{memberRows.length} members</span>}
        />
      )}
    </>
  );
}
