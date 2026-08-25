'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Mail, MessageCircle, Mic, Send } from 'lucide-react';
import { PageHeader, DemoTag, useToast } from '@/components/app';
import { TextField, TextareaField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { newId } from '@/lib/workspace/store';
import type { DemoCampaign, DemoCampaignChannel } from '@/lib/workspace/store';
import { logActivity } from '@/lib/demo-storage/store';

const CHANNELS: { id: DemoCampaignChannel; label: string; icon: typeof Mail; desc: string }[] = [
  { id: 'email', label: 'Email', icon: Mail, desc: 'A multi-step email sequence.' },
  { id: 'voice', label: 'Voice', icon: Mic, desc: 'A voice agent calls the list.' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, desc: 'A WhatsApp conversation flow.' }
];

const STEPS = ['Audience', 'Channel', 'Draft', 'Review'];

export default function NewCampaignPage() {
  const router = useRouter();
  const params = useSearchParams();
  const ctx = useWorkspace();
  const { push } = useToast();

  const [step, setStep] = useState(0);
  const [audienceId, setAudienceId] = useState(params.get('audience') ?? '');
  const [channel, setChannel] = useState<DemoCampaignChannel>('email');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  if (!ctx) return <PageSkeleton />;

  const { workspaceId, data, persistData } = ctx;
  const audience = data.audiences.find((a) => a.id === audienceId);

  const canNext = [Boolean(audienceId), true, name.trim().length > 1 && body.trim().length > 1, true][step];

  const create = async () => {
    const c: DemoCampaign = {
      id: newId(),
      workspaceId,
      name: name.trim() || 'Untitled campaign',
      channel,
      audienceId: audienceId || undefined,
      status: 'draft',
      steps: [{ id: newId(), position: 0, delayDays: 0, subject: subject.trim(), body: body.trim() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await persistData({ ...data, campaigns: [c, ...data.campaigns] });
    await logActivity(workspaceId, 'campaign', `Drafted campaign "${c.name}"`);
    push('Campaign draft saved', 'success');
    router.push(`/app/campaigns/${c.id}`);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Campaigns', href: '/app/campaigns' }, { label: 'New campaign' }]}
        title="New campaign"
        description="Four steps to a ready-to-send draft — audience, channel, message, then review."
      />

      <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
        {STEPS.map((s, i) => (
          <div
            key={s}
            style={{
              flex: 1,
              padding: '8px 4px',
              textAlign: 'center',
              fontSize: 'var(--lp-t-caption)',
              fontWeight: i === step ? 700 : 500,
              color: i <= step ? 'var(--lp-blue-mid)' : 'var(--lp-text-faint)',
              borderBottom: `2px solid ${i <= step ? 'var(--lp-blue-core)' : 'var(--lp-line-strong)'}`
            }}
          >
            {i + 1}. {s}
          </div>
        ))}
      </div>

      <div className="pa-panel" style={{ maxWidth: 640 }}>
        {step === 0 && (
          <>
            <p className="pa-h3" style={{ marginBottom: 12 }}>
              Choose an audience
            </p>
            {data.audiences.length === 0 ? (
              <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)' }}>
                No audiences yet.{' '}
                <Link href="/app/audiences" style={{ color: 'var(--lp-blue-mid)' }}>
                  Build one first
                </Link>
                , or continue without one and attach it later.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.audiences.map((a) => (
                  <label
                    key={a.id}
                    className="pa-choice"
                    style={{ borderColor: audienceId === a.id ? 'var(--lp-blue-core)' : undefined }}
                  >
                    <input
                      type="radio"
                      className="pa-choice__input"
                      name="audience"
                      checked={audienceId === a.id}
                      onChange={() => setAudienceId(a.id)}
                    />
                    <span className="pa-choice__text">
                      <span className="pa-choice__label">{a.name}</span>
                      <span className="pa-choice__blurb">{a.memberIds.length} members</span>
                    </span>
                    <span className="pa-choice__mark">
                      <Check size={12} strokeWidth={3.4} />
                    </span>
                  </label>
                ))}
              </div>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <p className="pa-h3" style={{ marginBottom: 12 }}>
              Choose a channel
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {CHANNELS.map((c) => (
                <label
                  key={c.id}
                  className="pa-choice"
                  style={{ borderColor: channel === c.id ? 'var(--lp-blue-core)' : undefined }}
                >
                  <input
                    type="radio"
                    className="pa-choice__input"
                    name="channel"
                    checked={channel === c.id}
                    onChange={() => setChannel(c.id)}
                  />
                  <span className="pa-choice__icon">
                    <c.icon size={17} />
                  </span>
                  <span className="pa-choice__text">
                    <span className="pa-choice__label">{c.label}</span>
                    <span className="pa-choice__blurb">{c.desc}</span>
                  </span>
                  <span className="pa-choice__mark">
                    <Check size={12} strokeWidth={3.4} />
                  </span>
                </label>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="pa-h3" style={{ marginBottom: 12 }}>
              Draft the {channel === 'voice' ? 'opening line' : 'message'}
            </p>
            <TextField label="Campaign name" placeholder="HyperScale — infra outreach" value={name} onChange={(e) => setName(e.target.value)} />
            {channel === 'email' && (
              <TextField label="Subject" placeholder="Cutting cloud egress at {{company}}" value={subject} onChange={(e) => setSubject(e.target.value)} />
            )}
            <TextareaField
              label={channel === 'voice' ? 'Opening line' : channel === 'whatsapp' ? 'First message' : 'Body'}
              rows={6}
              placeholder="Use {{name}} and {{company}} to personalise per row."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </>
        )}

        {step === 3 && (
          <>
            <p className="pa-h3" style={{ marginBottom: 12 }}>
              Review
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 'var(--lp-t-sm)' }}>
              <Row label="Name" value={name || 'Untitled campaign'} />
              <Row label="Channel" value={channel} />
              <Row label="Audience" value={audience ? `${audience.name} (${audience.memberIds.length})` : 'None yet'} />
              <Row label="Message" value={body || '—'} />
            </div>
            <div
              className="pa-panel"
              style={{ marginTop: 16, borderColor: 'rgba(245,181,68,.25)', background: 'rgba(245,181,68,.06)' }}
            >
              <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-soft)', margin: 0 }}>
                Sending is unavailable until a{' '}
                {channel === 'email' ? 'email' : channel === 'voice' ? 'telephony' : 'WhatsApp'} provider is
                connected. This saves as a draft you can send the moment one is. <DemoTag kind="not-connected" />
              </p>
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button
            className="pa-btn pa-btn--ghost"
            onClick={() => (step === 0 ? router.push('/app/campaigns') : setStep(step - 1))}
          >
            <ArrowLeft size={15} />
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          {step < STEPS.length - 1 ? (
            <button className="pa-btn" onClick={() => setStep(step + 1)} disabled={!canNext}>
              Continue
              <ArrowRight size={15} />
            </button>
          ) : (
            <button className="pa-btn" onClick={create} disabled={!canNext}>
              <Send size={15} />
              Save draft
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingBottom: 10, borderBottom: '1px solid var(--lp-line)' }}>
      <span style={{ color: 'var(--lp-text-faint)' }}>{label}</span>
      <span style={{ color: 'var(--lp-text)', textAlign: 'right', maxWidth: '65%' }}>{value}</span>
    </div>
  );
}
