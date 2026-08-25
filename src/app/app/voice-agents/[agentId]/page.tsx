'use client';

import { use, useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Copy, PhoneCall } from 'lucide-react';
import { PageHeader, Tabs, DemoTag, EmptyState, useToast } from '@/components/app';
import { TextareaField, SelectField, TextField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { DEMO_CALL_LOGS, DEMO_CALL_SUMMARIES, DEMO_CALL_TRANSCRIPTS } from '@/lib/mock-data/call-logs';
import { DEMO_CONTACTS } from '@/lib/mock-data/contacts';

const VOICES = ['Rhea — warm, neutral', 'Quinn — confident, US', 'Magnus — deep, UK', 'Ella — bright, Indian'];
const MODELS = ['prospectra-voice-v2', 'GPT 4.1', 'Gemini Flash'];
const LANGS = ['English', 'Hindi', 'Hindi-English', 'Spanish', 'French'];

const TABS = [
  { id: 'prompt', label: 'Prompt' },
  { id: 'branches', label: 'Branches' },
  { id: 'settings', label: 'Agent settings' },
  { id: 'speech', label: 'Speech' },
  { id: 'tools', label: 'Tools' },
  { id: 'numbers', label: 'Phone numbers' },
  { id: 'metrics', label: 'Post-call metrics' },
  { id: 'conversations', label: 'Conversations' },
  { id: 'widget', label: 'Widget' }
];

export default function VoiceAgentStudioPage({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = use(params);
  const router = useRouter();
  const ctx = useWorkspace();
  const { push } = useToast();
  const [tab, setTab] = useState('prompt');

  if (!ctx) return <PageSkeleton />;

  const { data, persistData } = ctx;
  const agent = data.agents.find((a) => a.id === agentId);

  if (!agent) {
    return (
      <EmptyState
        icon="empty-voice"
        title="Agent not found"
        description="This agent may have been deleted, or the link is out of date."
        action={
          <button className="pa-btn" onClick={() => router.push('/app/voice-agents')}>
            <ArrowLeft size={15} />
            Back to voice agents
          </button>
        }
      />
    );
  }

  const latest = agent.versions[agent.versions.length - 1];

  const saveVersion = async (patch: Partial<typeof latest>) => {
    const nextVersion = { ...latest, ...patch, version: agent.versions.length + 1, savedAt: new Date().toISOString() };
    await persistData({
      ...data,
      agents: data.agents.map((a) =>
        a.id === agent.id ? { ...a, versions: [...a.versions, nextVersion], updatedAt: new Date().toISOString() } : a
      )
    });
    push('Saved a new version', 'success');
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Voice agents', href: '/app/voice-agents' }, { label: agent.name }]}
        title={agent.name}
        description={`${agent.versions.length} version${agent.versions.length === 1 ? '' : 's'} · draft`}
        actions={
          <button className="pa-btn" onClick={() => router.push(`/app/voice-agents/${agent.id}/test`)}>
            <PhoneCall size={15} />
            Test agent
          </button>
        }
        tabs={<Tabs items={TABS} active={tab} onChange={setTab} />}
      />

      {tab === 'prompt' && (
        <div className="pa-panel" style={{ maxWidth: 680 }}>
          <PromptEditor initial={latest?.prompt ?? ''} onSave={(prompt) => saveVersion({ prompt })} />
        </div>
      )}

      {tab === 'branches' && (
        <EmptyState
          icon="empty-voice"
          title="Conversation branches"
          description="Conditional branches (if the caller says X, go to Y) are designed but not built in this milestone — today the agent follows one linear prompt."
          action={<DemoTag kind="coming-soon" />}
        />
      )}

      {tab === 'settings' && (
        <div className="pa-panel" style={{ maxWidth: 480 }}>
          <SelectField
            label="Model"
            defaultValue={latest?.model}
            onChange={(e) => saveVersion({ model: e.target.value })}
            options={MODELS.map((m) => ({ value: m, label: m }))}
          />
          <fieldset style={{ marginTop: 4 }}>
            <legend className="pa-label" style={{ marginBottom: 8 }}>
              Languages
            </legend>
            <div className="pa-chips">
              {LANGS.map((l) => (
                <label key={l} className="pa-chip">
                  <input
                    type="checkbox"
                    checked={latest?.languages.includes(l) ?? false}
                    onChange={() => {
                      const next = latest?.languages.includes(l)
                        ? latest.languages.filter((x) => x !== l)
                        : [...(latest?.languages ?? []), l];
                      saveVersion({ languages: next });
                    }}
                  />
                  {l}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      {tab === 'speech' && (
        <div className="pa-panel" style={{ maxWidth: 480 }}>
          <SelectField
            label="Voice"
            defaultValue={latest?.voice}
            onChange={(e) => saveVersion({ voice: e.target.value })}
            options={VOICES.map((v) => ({ value: v, label: v }))}
          />
          <TextField label="Speaking speed" type="range" min={0.75} max={1.25} step={0.05} defaultValue={1} disabled />
          <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)' }}>
            Speed and pause tuning activate once a TTS provider is connected. Preview in the{' '}
            <Link href="/app/voice-playground/tts" style={{ color: 'var(--lp-blue-mid)' }}>
              voice playground
            </Link>
            .
          </p>
        </div>
      )}

      {tab === 'tools' && (
        <div className="pa-panel" style={{ maxWidth: 480 }}>
          {['Calendar booking', 'CRM lookup', 'Knowledge-base lookup'].map((t) => (
            <label key={t} className="pa-choice" style={{ marginBottom: 8 }}>
              <input type="checkbox" className="pa-choice__input" defaultChecked={t === 'Calendar booking'} />
              <span className="pa-choice__text">
                <span className="pa-choice__label">{t}</span>
              </span>
              <span className="pa-choice__mark">
                <Check size={12} strokeWidth={3.4} />
              </span>
            </label>
          ))}
        </div>
      )}

      {tab === 'numbers' && (
        <EmptyState
          icon="empty-phone-numbers"
          title="No phone number assigned"
          description="Assign a number from Phone Numbers once telephony is connected, so this agent can place and receive calls."
          action={
            <button className="pa-btn pa-btn--ghost" onClick={() => router.push('/app/phone-numbers')}>
              Go to phone numbers
            </button>
          }
        />
      )}

      {tab === 'metrics' && <PostCallMetrics />}

      {tab === 'conversations' && <Conversations />}

      {tab === 'widget' && (
        <div className="pa-panel" style={{ maxWidth: 560 }}>
          <p className="pa-h3" style={{ marginBottom: 8 }}>
            Embed widget
          </p>
          <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)', marginBottom: 14 }}>
            Add a chat-style widget for this agent to any site. Activates once a provider is connected —
            the snippet is real, but loading it will not start a live conversation yet.
          </p>
          <div
            style={{
              position: 'relative',
              padding: 14,
              borderRadius: 10,
              background: '#05070f',
              border: '1px solid var(--lp-line-strong)',
              fontFamily: 'monospace',
              fontSize: 12,
              color: 'var(--lp-text-soft)',
              overflowX: 'auto'
            }}
          >
            {`<script src="https://cdn.prospectra.ai/widget.js" data-agent="${agent.id}"></script>`}
          </div>
          <button
            className="pa-btn pa-btn--ghost"
            style={{ marginTop: 12 }}
            onClick={() => {
              navigator.clipboard?.writeText(`<script src="https://cdn.prospectra.ai/widget.js" data-agent="${agent.id}"></script>`);
              push('Copied to clipboard', 'success');
            }}
          >
            <Copy size={14} />
            Copy snippet
          </button>
        </div>
      )}
    </>
  );
}

function PromptEditor({ initial, onSave }: { initial: string; onSave: (v: string) => void }) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <TextareaField label="Role & objective" rows={10} value={value} onChange={(e) => setValue(e.target.value)} />
      <button className="pa-btn" style={{ marginTop: 8 }} onClick={() => onSave(value)} disabled={!value.trim()}>
        <Check size={15} />
        Save new version
      </button>
    </>
  );
}

function PostCallMetrics() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="pa-panel" style={{ display: 'flex', gap: 10, borderColor: 'rgba(245,181,68,.25)', background: 'rgba(245,181,68,.06)' }}>
        <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-soft)', margin: 0 }}>
          This agent has not placed any real calls. The rows below illustrate the shape of the metrics
          once calling is connected. <DemoTag kind="demo" />
        </p>
      </div>
      <div className="pa-table-wrap">
        <div className="pa-table-scroll">
          <table className="pa-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_CALL_LOGS.map((c) => {
                const contact = DEMO_CONTACTS.find((k) => k.id === c.contactId);
                return (
                  <tr key={c.id}>
                    <td style={{ color: 'var(--lp-text)' }}>{contact?.fullName ?? c.contactId}</td>
                    <td>{c.status}</td>
                    <td>{c.durationS ? `${Math.round(c.durationS / 60)}m ${c.durationS % 60}s` : '—'}</td>
                    <td>{c.outcome ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Conversations() {
  const [openId, setOpenId] = useState(DEMO_CALL_TRANSCRIPTS[0]?.id);
  const active = DEMO_CALL_TRANSCRIPTS.find((t) => t.id === openId);
  const summary = DEMO_CALL_SUMMARIES.find((s) => s.callLogId === active?.callLogId);

  return (
    <div className="pa-grid--split" style={{ '--pa-rail': 'minmax(220px, 280px)', gap: 16 } as CSSProperties}>
      <div className="pa-panel" style={{ padding: 8 }}>
        {DEMO_CALL_TRANSCRIPTS.map((t) => (
          <button
            key={t.id}
            onClick={() => setOpenId(t.id)}
            className="pa-nav__item"
            aria-current={openId === t.id ? 'page' : undefined}
            style={{ width: '100%' }}
          >
            <span className="pa-nav__label">Call {t.callLogId.replace('call-', '#')}</span>
          </button>
        ))}
      </div>
      <div className="pa-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <p className="pa-h3" style={{ margin: 0 }}>
            Transcript
          </p>
          <DemoTag kind="demo" />
        </div>
        {summary && (
          <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)', marginBottom: 14 }}>{summary.summary}</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {active?.turns.map((turn, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, justifyContent: turn.speaker === 'agent' ? 'flex-start' : 'flex-end' }}>
              <span
                style={{
                  maxWidth: '75%',
                  padding: '9px 13px',
                  borderRadius: 12,
                  fontSize: 'var(--lp-t-sm)',
                  background: turn.speaker === 'agent' ? 'rgba(40,95,255,.14)' : 'var(--lp-glass-strong)',
                  color: turn.speaker === 'agent' ? 'var(--lp-blue-mid)' : 'var(--lp-text-soft)'
                }}
              >
                {turn.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
