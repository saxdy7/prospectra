'use client';

import { use, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, Mic, Phone, PhoneOff, Send } from 'lucide-react';
import { EmptyState, DemoTag, Tabs } from '@/components/app';
import { SelectField, TextField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';

const COUNTRY_CODES = [
  { value: '+91', label: '+91 India' },
  { value: '+1', label: '+1 United States/Canada' },
  { value: '+44', label: '+44 United Kingdom' },
  { value: '+33', label: '+33 France' },
  { value: '+61', label: '+61 Australia' }
];

type Turn = { speaker: 'agent' | 'you'; text: string };

/** A short, deterministic canned exchange — this is a simulation, not a model call. */
function nextAgentLine(turns: Turn[], firstMessage: string): string {
  const count = turns.filter((t) => t.speaker === 'agent').length;
  if (count === 0) return firstMessage || 'Hi, thanks for calling — how can I help?';
  const lines = [
    'Got it. Can you tell me a bit more about what you are looking for?',
    'That makes sense. Would you like me to note this down and have someone follow up?',
    'Understood — I have logged that. Anything else before we wrap up?'
  ];
  return lines[Math.min(count - 1, lines.length - 1)];
}

export default function VoiceAgentTestPage({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = use(params);
  const router = useRouter();
  const ctx = useWorkspace();
  const [mode, setMode] = useState<'webcall' | 'telephony' | 'chat'>('webcall');
  const [running, setRunning] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns]);

  if (!ctx) return <PageSkeleton />;

  const { data } = ctx;
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

  const start = () => {
    setTurns([{ speaker: 'agent', text: nextAgentLine([], latest?.firstMessage ?? '') }]);
    setRunning(true);
  };

  const end = () => {
    setRunning(false);
    setTurns([]);
  };

  const send = () => {
    if (!input.trim()) return;
    const withYou: Turn[] = [...turns, { speaker: 'you', text: input.trim() }];
    setInput('');
    setTurns(withYou);
    window.setTimeout(() => {
      setTurns((t) => [...t, { speaker: 'agent', text: nextAgentLine(withYou, latest?.firstMessage ?? '') }]);
    }, 500);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <button className="pa-btn pa-btn--ghost" style={{ marginBottom: 10 }} onClick={() => router.push(`/app/voice-agents/${agent.id}`)}>
            <ArrowLeft size={15} />
            {agent.name}
          </button>
          <h1 className="pa-pagehead__title">Test call</h1>
        </div>
        <DemoTag kind="simulation" label="Simulation mode — no real call is placed" />
      </div>

      <div style={{ marginBottom: 18 }}>
        <Tabs
          items={[
            { id: 'webcall', label: 'Webcall' },
            { id: 'telephony', label: 'Telephony' },
            { id: 'chat', label: 'Chat' }
          ]}
          active={mode}
          onChange={(id) => {
            end();
            setMode(id as typeof mode);
          }}
        />
      </div>

      {mode === 'telephony' ? (
        <div className="pa-panel" style={{ maxWidth: 460 }}>
          <p className="pa-h3" style={{ marginBottom: 6 }}>
            Call a real number
          </p>
          <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)', marginBottom: 16, lineHeight: 1.55 }}>
            Dial out from this agent once a telephony provider is connected. Nothing here places a
            real call yet — the fields save your preferred test number for when one is.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 10 }}>
            <SelectField label="Country" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} options={COUNTRY_CODES} />
            <TextField label="Phone number" placeholder="98765 43210" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>
          <button className="pa-btn" disabled style={{ marginTop: 14 }}>
            <Phone size={15} />
            Call {countryCode} {phoneNumber || '…'}
          </button>
          <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)', marginTop: 10 }}>
            <DemoTag kind="not-connected" /> Connect a provider in{' '}
            <a href="/app/integrations" style={{ color: 'var(--lp-blue-mid)' }}>
              Integrations
            </a>{' '}
            to enable outbound test calls.
          </p>
        </div>
      ) : (
        <div className="pa-grid--split" style={{ '--pa-rail': 'minmax(220px, 280px)', gap: 20 } as CSSProperties}>
          <div className="pa-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '32px 20px' }}>
            {mode === 'webcall' ? (
              <div
                aria-hidden="true"
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 30%, var(--lp-blue-mid), var(--lp-blue-deep) 70%)',
                  boxShadow: running ? '0 0 0 10px rgba(40,95,255,.14), 0 0 40px rgba(40,95,255,.4)' : '0 0 0 0 rgba(40,95,255,0)',
                  transition: 'box-shadow .6s ease',
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                <Mic size={30} color="#fff" />
              </div>
            ) : (
              <div
                aria-hidden="true"
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: '50%',
                  background: 'var(--lp-glass-strong)',
                  border: '1px solid var(--lp-line-strong)',
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                <MessageSquare size={28} color="var(--lp-blue-mid)" />
              </div>
            )}
            <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)', textAlign: 'center', margin: 0 }}>
              {running
                ? mode === 'webcall'
                  ? 'Call in progress (simulated)'
                  : 'Chat in progress (simulated)'
                : mode === 'webcall'
                  ? 'Ready to start a simulated call'
                  : 'Ready to start a simulated chat'}
            </p>

            {!running ? (
              <button className="pa-btn" onClick={start}>
                {mode === 'webcall' ? <Mic size={15} /> : <MessageSquare size={15} />}
                {mode === 'webcall' ? 'Start test call' : 'Start chat'}
              </button>
            ) : (
              <button className="pa-btn pa-btn--ghost" style={{ color: '#ff8a8a', borderColor: 'rgba(255,122,122,.3)' }} onClick={end}>
                <PhoneOff size={15} />
                {mode === 'webcall' ? 'End call' : 'End chat'}
              </button>
            )}

            <div style={{ width: '100%', paddingTop: 14, borderTop: '1px solid var(--lp-line)', fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)' }}>
              <p style={{ margin: 0 }}>Voice: {latest?.voice ?? '—'}</p>
              <p style={{ margin: '4px 0 0' }}>Languages: {latest?.languages.join(', ') || '—'}</p>
            </div>
          </div>

          <div className="pa-panel" style={{ display: 'flex', flexDirection: 'column', minHeight: 420 }}>
            <p className="pa-h3" style={{ marginBottom: 12 }}>
              Transcript
            </p>
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {turns.length === 0 ? (
                <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)' }}>
                  {mode === 'webcall'
                    ? 'Start a test call to see a simulated conversation here.'
                    : 'Start a chat to see a simulated conversation here.'}
                </p>
              ) : (
                turns.map((t, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: t.speaker === 'agent' ? 'flex-start' : 'flex-end' }}>
                    <span
                      style={{
                        maxWidth: '75%',
                        padding: '9px 13px',
                        borderRadius: 12,
                        fontSize: 'var(--lp-t-sm)',
                        background: t.speaker === 'agent' ? 'rgba(40,95,255,.14)' : 'var(--lp-glass-strong)',
                        color: t.speaker === 'agent' ? 'var(--lp-blue-mid)' : 'var(--lp-text-soft)'
                      }}
                    >
                      {t.text}
                    </span>
                  </div>
                ))
              )}
            </div>

            {running && (
              <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--lp-line)' }}>
                <input
                  className="pa-input"
                  placeholder="Type what you would say…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                />
                <button className="pa-icon-btn" onClick={send} aria-label="Send">
                  <Send size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
