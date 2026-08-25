'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Send } from 'lucide-react';
import { PageHeader, EmptyState, DemoTag, StatusPill, ConfirmDialog, useToast } from '@/components/app';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';

export default function CampaignDetailPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = use(params);
  const router = useRouter();
  const ctx = useWorkspace();
  const { push } = useToast();
  const [confirmSend, setConfirmSend] = useState(false);

  if (!ctx) return <PageSkeleton />;

  const { data, persistData } = ctx;
  const campaign = data.campaigns.find((c) => c.id === campaignId);

  if (!campaign) {
    return (
      <EmptyState
        icon="empty-campaigns"
        title="Campaign not found"
        description="This campaign may have been deleted, or the link is out of date."
        action={
          <button className="pa-btn" onClick={() => router.push('/app/campaigns')}>
            <ArrowLeft size={15} />
            Back to campaigns
          </button>
        }
      />
    );
  }

  const audience = data.audiences.find((a) => a.id === campaign.audienceId);

  const markCompleted = async () => {
    await persistData({
      ...data,
      campaigns: data.campaigns.map((c) => (c.id === campaign.id ? { ...c, status: 'completed' as const } : c))
    });
    push('Marked as completed (demo)', 'success');
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Campaigns', href: '/app/campaigns' }, { label: campaign.name }]}
        title={campaign.name}
        description={`${campaign.channel} · ${campaign.steps.length} step${campaign.steps.length === 1 ? '' : 's'}`}
        actions={
          <>
            <StatusPill label={campaign.status === 'completed' ? 'Completed' : 'Draft'} tone={campaign.status === 'completed' ? 'success' : 'muted'} />
            <button className="pa-btn" onClick={() => setConfirmSend(true)} disabled={campaign.status === 'completed'}>
              <Send size={15} />
              Send
            </button>
          </>
        }
      />

      <div className="pa-grid pa-grid--two" style={{ marginTop: 0, marginBottom: 20 }}>
        <div className="pa-panel">
          <p className="pa-h3" style={{ marginBottom: 10 }}>
            Summary
          </p>
          <dl style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 'var(--lp-t-sm)' }}>
            <Row label="Channel" value={campaign.channel} />
            <Row label="Audience" value={audience ? `${audience.name} (${audience.memberIds.length})` : 'None'} />
            <Row label="Created" value={new Date(campaign.createdAt).toLocaleString()} />
            <Row label="Updated" value={new Date(campaign.updatedAt).toLocaleString()} />
          </dl>
        </div>

        <div className="pa-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <p className="pa-h3" style={{ margin: 0 }}>
              Performance
            </p>
            <DemoTag kind="not-connected" />
          </div>
          <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)', lineHeight: 1.6 }}>
            Delivery, open, reply and call-outcome figures appear here once this campaign actually
            sends. Showing zeroes now would suggest something ran and performed badly — nothing has
            run at all.
          </p>
        </div>
      </div>

      <div className="pa-panel" style={{ marginBottom: 20 }}>
        <p className="pa-h3" style={{ marginBottom: 14 }}>
          Sequence
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {campaign.steps.map((step, i) => (
            <div key={step.id} className="pa-panel" style={{ padding: 16 }}>
              <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)', marginBottom: 6 }}>
                Step {i + 1}
                {i > 0 && ` · after ${step.delayDays} day${step.delayDays === 1 ? '' : 's'}`}
              </p>
              {step.subject && <p style={{ fontWeight: 600, color: 'var(--lp-text)', margin: '0 0 6px' }}>{step.subject}</p>}
              <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-soft)', margin: 0, whiteSpace: 'pre-wrap' }}>
                {step.body || '—'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="pa-panel">
        <p className="pa-h3" style={{ marginBottom: 10 }}>
          Members
        </p>
        {!audience || audience.memberIds.length === 0 ? (
          <EmptyState icon="empty-audiences" title="No members" description="Attach an audience to this campaign to see who is included." />
        ) : (
          <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)' }}>
            {audience.memberIds.length} members from{' '}
            <Link href={`/app/audiences/${audience.id}`} style={{ color: 'var(--lp-blue-mid)' }}>
              {audience.name}
            </Link>
            .
          </p>
        )}
      </div>

      <ConfirmDialog
        open={confirmSend}
        onClose={() => setConfirmSend(false)}
        onConfirm={markCompleted}
        tone="neutral"
        title="Sending needs a connected provider"
        description={`No ${campaign.channel} provider is connected, so this cannot actually send. Mark it as completed anyway, to see what that state looks like? (Demo only — no message is sent.)`}
        confirmLabel={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Check size={14} />
            Mark as completed
          </span>
        }
      />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
      <dt style={{ color: 'var(--lp-text-faint)' }}>{label}</dt>
      <dd style={{ color: 'var(--lp-text)', margin: 0 }}>{value}</dd>
    </div>
  );
}
