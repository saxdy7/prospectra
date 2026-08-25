'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { PageHeader, DataTable, EmptyState, StatusPill } from '@/components/app';
import { IconFrame } from '@/components/workspace/IconIllustration';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import type { DemoVoiceAgent } from '@/lib/workspace/store';

export default function VoiceAgentsPage() {
  const router = useRouter();
  const ctx = useWorkspace();

  if (!ctx) return <PageSkeleton />;

  const { data } = ctx;

  return (
    <>
      <PageHeader
        title="Voice agents"
        description="Draft the agent now, ready for when calling opens."
        actions={
          <button className="pa-btn" onClick={() => router.push('/app/voice-agents/new')}>
            <Plus size={15} />
            New agent
          </button>
        }
      />

      {data.agents.length === 0 ? (
        <EmptyState
          icon="empty-voice"
          title="No voice agents yet"
          description="Write the role and opening line. The part that takes thought is worth doing before the rest exists."
          action={
            <button className="pa-btn" onClick={() => router.push('/app/voice-agents/new')}>
              Draft your first agent
            </button>
          }
        />
      ) : (
        <DataTable<DemoVoiceAgent>
          columns={[
            {
              key: 'name',
              label: 'Agent',
              render: (a) => (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, color: 'var(--lp-text)' }}>
                  <IconFrame name="action-voice-draft" size={30} />
                  {a.name}
                </span>
              )
            },
            {
              key: 'language',
              label: 'Languages',
              render: (a) => a.versions[a.versions.length - 1]?.languages?.join(', ') || '—'
            },
            {
              key: 'voice',
              label: 'Voice',
              render: (a) => a.versions[a.versions.length - 1]?.voice ?? '—'
            },
            { key: 'calls', label: 'Calls', width: '80px', render: () => 0 },
            {
              key: 'updated',
              label: 'Last updated',
              width: '160px',
              render: (a) => new Date(a.updatedAt).toLocaleDateString()
            },
            { key: 'status', label: 'Status', width: '100px', render: () => <StatusPill label="Draft" tone="muted" /> }
          ]}
          rows={data.agents}
          searchKeys={['name']}
          searchPlaceholder="Search voice agents…"
          onRowClick={(a) => router.push(`/app/voice-agents/${a.id}`)}
          footer={<span>{data.agents.length} agents</span>}
        />
      )}
    </>
  );
}
