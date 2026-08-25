'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, MessageCircle, Mic, Plus } from 'lucide-react';
import { PageHeader, Tabs, DataTable, EmptyState, StatusPill } from '@/components/app';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import type { DemoCampaign } from '@/lib/workspace/store';

const CHANNEL_ICON = { email: Mail, voice: Mic, whatsapp: MessageCircle } as const;

export default function CampaignsPage() {
  const router = useRouter();
  const ctx = useWorkspace();
  const [tab, setTab] = useState('all');

  if (!ctx) return <PageSkeleton />;

  const { data } = ctx;

  const filtered = data.campaigns.filter((c) => {
    if (tab === 'all') return true;
    if (tab === 'drafts') return c.status === 'draft';
    if (tab === 'completed') return c.status === 'completed';
    return c.channel === tab;
  });

  return (
    <>
      <PageHeader
        title="Campaigns"
        description="Write the sequence now; send once a provider is connected."
        actions={
          <button className="pa-btn" onClick={() => router.push('/app/campaigns/new')}>
            <Plus size={15} />
            New campaign
          </button>
        }
        tabs={
          <Tabs
            items={[
              { id: 'all', label: 'All', count: data.campaigns.length },
              { id: 'email', label: 'Email' },
              { id: 'voice', label: 'Voice' },
              { id: 'whatsapp', label: 'WhatsApp' },
              { id: 'drafts', label: 'Drafts' },
              { id: 'completed', label: 'Completed' }
            ]}
            active={tab}
            onChange={setTab}
          />
        }
      />

      {data.campaigns.length === 0 ? (
        <EmptyState
          icon="empty-campaigns"
          title="No campaign drafts"
          description="Sketch an audience and a first message. It saves as a draft."
          action={
            <button className="pa-btn" onClick={() => router.push('/app/campaigns/new')}>
              Draft your first campaign
            </button>
          }
        />
      ) : (
        <DataTable<DemoCampaign>
          columns={[
            {
              key: 'name',
              label: 'Campaign',
              render: (c) => {
                const Icon = CHANNEL_ICON[c.channel];
                return (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: 'var(--lp-text)' }}>
                    <Icon size={14} />
                    {c.name}
                  </span>
                );
              }
            },
            { key: 'channel', label: 'Channel', width: '100px', render: (c) => c.channel },
            { key: 'steps', label: 'Steps', width: '80px', render: (c) => c.steps.length },
            {
              key: 'audience',
              label: 'Audience',
              render: (c) => data.audiences.find((a) => a.id === c.audienceId)?.name ?? '—'
            },
            {
              key: 'status',
              label: 'Status',
              width: '120px',
              render: (c) => <StatusPill label={c.status === 'completed' ? 'Completed' : 'Draft'} tone={c.status === 'completed' ? 'success' : 'muted'} />
            }
          ]}
          rows={filtered}
          searchKeys={['name']}
          searchPlaceholder="Search campaigns…"
          onRowClick={(c) => router.push(`/app/campaigns/${c.id}`)}
          footer={<span>{filtered.length} campaigns</span>}
        />
      )}
    </>
  );
}
