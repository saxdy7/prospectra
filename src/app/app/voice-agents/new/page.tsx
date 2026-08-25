'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, PhoneCall } from 'lucide-react';
import { PageHeader, DemoTag, useToast } from '@/components/app';
import { TextField, TextareaField, SelectField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { newId } from '@/lib/workspace/store';
import type { DemoVoiceAgent } from '@/lib/workspace/store';
import { logActivity } from '@/lib/demo-storage/store';

const VOICES = ['Rhea — warm, neutral', 'Quinn — confident, US', 'Magnus — deep, UK', 'Ella — bright, Indian'];
const MODELS = ['prospectra-voice-v2', 'GPT 4.1', 'Gemini Flash'];
const LANGS = ['English', 'Hindi', 'Hindi-English', 'Spanish', 'French'];
const TOOLS = ['Calendar booking', 'CRM lookup', 'Knowledge-base lookup'];

const STEPS = ['Name', 'Role', 'Languages & voice', 'First message', 'Tools', 'Preview'];

export default function NewVoiceAgentPage() {
  const router = useRouter();
  const ctx = useWorkspace();
  const { push } = useToast();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [languages, setLanguages] = useState<string[]>(['English']);
  const [voice, setVoice] = useState(VOICES[0]);
  const [model, setModel] = useState(MODELS[0]);
  const [firstMessage, setFirstMessage] = useState('');
  const [tools, setTools] = useState<string[]>([]);

  if (!ctx) return <PageSkeleton />;

  const { workspaceId, data, persistData } = ctx;

  const canNext = [
    name.trim().length > 1,
    prompt.trim().length > 4,
    languages.length > 0,
    firstMessage.trim().length > 1,
    true,
    true
  ][step];

  const create = async () => {
    const a: DemoVoiceAgent = {
      id: newId(),
      workspaceId,
      name: name.trim() || 'Untitled agent',
      status: 'draft',
      versions: [
        {
          version: 1,
          prompt: prompt.trim(),
          firstMessage: firstMessage.trim(),
          model,
          languages,
          voice,
          savedAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await persistData({ ...data, agents: [a, ...data.agents] });
    await logActivity(workspaceId, 'voice', `Drafted voice agent "${a.name}"`);
    push('Voice agent draft saved', 'success');
    router.push(`/app/voice-agents/${a.id}`);
  };

  const toggleLang = (l: string) =>
    setLanguages((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));
  const toggleTool = (t: string) =>
    setTools((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Voice agents', href: '/app/voice-agents' }, { label: 'New agent' }]}
        title="Create a voice agent"
        description="Write the role and script now — testing and calling activate once a provider is connected."
      />

      <div style={{ display: 'flex', gap: 6, marginBottom: 22, flexWrap: 'wrap' }}>
        {STEPS.map((s, i) => (
          <div
            key={s}
            style={{
              flex: '1 1 90px',
              padding: '8px 4px',
              textAlign: 'center',
              fontSize: 11,
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
          <TextField label="Agent name" placeholder="Outbound SDR — English" value={name} onChange={(e) => setName(e.target.value)} />
        )}

        {step === 1 && (
          <TextareaField
            label="Role & objective"
            rows={7}
            placeholder="You are Alex, calling local businesses to introduce automated booking. Qualify interest, then book a demo."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        )}

        {step === 2 && (
          <>
            <fieldset style={{ marginBottom: 20 }}>
              <legend className="pa-label" style={{ marginBottom: 8 }}>
                Languages
              </legend>
              <div className="pa-chips">
                {LANGS.map((l) => (
                  <label key={l} className="pa-chip">
                    <input type="checkbox" checked={languages.includes(l)} onChange={() => toggleLang(l)} />
                    {l}
                  </label>
                ))}
              </div>
            </fieldset>
            <SelectField label="Voice" value={voice} onChange={(e) => setVoice(e.target.value)} options={VOICES.map((v) => ({ value: v, label: v }))} />
            <SelectField label="Model" value={model} onChange={(e) => setModel(e.target.value)} options={MODELS.map((m) => ({ value: m, label: m }))} />
          </>
        )}

        {step === 3 && (
          <TextareaField
            label="First message"
            rows={3}
            placeholder="Hi, this is Prospectra calling on behalf of {{company}} — is now an alright time?"
            value={firstMessage}
            onChange={(e) => setFirstMessage(e.target.value)}
          />
        )}

        {step === 4 && (
          <fieldset>
            <legend className="pa-label" style={{ marginBottom: 8 }}>
              Tools
            </legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TOOLS.map((t) => (
                <label key={t} className="pa-choice">
                  <input type="checkbox" className="pa-choice__input" checked={tools.includes(t)} onChange={() => toggleTool(t)} />
                  <span className="pa-choice__text">
                    <span className="pa-choice__label">{t}</span>
                  </span>
                  <span className="pa-choice__mark">
                    <Check size={12} strokeWidth={3.4} />
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 5 && (
          <>
            <p className="pa-h3" style={{ marginBottom: 12 }}>
              Preview
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 'var(--lp-t-sm)', marginBottom: 16 }}>
              <Row label="Name" value={name || 'Untitled agent'} />
              <Row label="Languages" value={languages.join(', ') || '—'} />
              <Row label="Voice" value={voice} />
              <Row label="First message" value={firstMessage || '—'} />
              <Row label="Tools" value={tools.join(', ') || 'None'} />
            </div>
            <div className="pa-panel" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <PhoneCall size={16} style={{ flexShrink: 0, marginTop: 2, color: 'var(--lp-blue-mid)' }} />
              <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-soft)', margin: 0 }}>
                You can test this agent in the browser once saved — a text/voice simulation, not a real
                phone call. <DemoTag kind="simulation" />
              </p>
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button className="pa-btn pa-btn--ghost" onClick={() => (step === 0 ? router.push('/app/voice-agents') : setStep(step - 1))}>
            <ArrowLeft size={15} />
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          {step < STEPS.length - 1 ? (
            <button className="pa-btn" onClick={() => setStep(step + 1)} disabled={!canNext}>
              Continue
              <ArrowRight size={15} />
            </button>
          ) : (
            <button className="pa-btn" onClick={create}>
              <Check size={15} />
              Save agent
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingBottom: 8, borderBottom: '1px solid var(--lp-line)' }}>
      <span style={{ color: 'var(--lp-text-faint)' }}>{label}</span>
      <span style={{ color: 'var(--lp-text)', textAlign: 'right', maxWidth: '65%' }}>{value}</span>
    </div>
  );
}
