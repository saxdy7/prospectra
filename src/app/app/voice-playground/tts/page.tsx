'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { PageHeader, DemoTag } from '@/components/app';
import { TextareaField, SelectField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';

const VOICES = ['Rhea — warm, neutral', 'Quinn — confident, US', 'Magnus — deep, UK', 'Ella — bright, Indian'];
const SAMPLE_RATES = ['8 kHz (telephony)', '16 kHz', '24 kHz (studio)'];

export default function TtsPage() {
  const ctx = useWorkspace();
  const [text, setText] = useState('Hi, this is Prospectra calling on behalf of your team — is now a good time?');
  const [voice, setVoice] = useState(VOICES[0]);
  const [speed, setSpeed] = useState('1');
  const [rate, setRate] = useState(SAMPLE_RATES[1]);
  const [playing, setPlaying] = useState(false);

  if (!ctx) return <PageSkeleton />;

  const preview = () => {
    setPlaying(true);
    window.setTimeout(() => setPlaying(false), 2200);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Voice playground', href: '/app/voice-playground' }, { label: 'Text to speech' }]}
        title="Text to speech"
        description="Preview how a voice reads your text — a mocked player until a TTS provider is connected."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 420px) 1fr', gap: 20 }}>
        <div className="pa-panel">
          <TextareaField label="Text" rows={5} value={text} onChange={(e) => setText(e.target.value)} />
          <SelectField label="Voice" value={voice} onChange={(e) => setVoice(e.target.value)} options={VOICES.map((v) => ({ value: v, label: v }))} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <SelectField
              label="Speed"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              options={[
                { value: '0.85', label: '0.85×' },
                { value: '1', label: '1× (normal)' },
                { value: '1.15', label: '1.15×' }
              ]}
            />
            <SelectField label="Sample rate" value={rate} onChange={(e) => setRate(e.target.value)} options={SAMPLE_RATES.map((r) => ({ value: r, label: r }))} />
          </div>
          <button className="pa-btn" style={{ marginTop: 8 }} onClick={preview} disabled={!text.trim()}>
            <Play size={15} />
            {playing ? 'Playing…' : 'Preview'}
          </button>
        </div>

        <div className="pa-panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p className="pa-h3" style={{ margin: 0 }}>
              Player
            </p>
            <DemoTag kind="simulation" />
          </div>
          <div
            style={{
              borderRadius: 12,
              padding: 20,
              background: 'linear-gradient(160deg, #0a1a4a 0%, var(--lp-blue-core) 55%, var(--lp-blue-mid) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              minHeight: 96
            }}
          >
            {Array.from({ length: 26 }).map((_, i) => (
              <span
                key={i}
                style={{
                  width: 3,
                  height: `${20 + Math.abs(Math.sin(i * 0.7)) * 60}%`,
                  borderRadius: 3,
                  background: 'rgba(255,255,255,.85)',
                  display: 'block',
                  transition: 'height .3s ease',
                  animation: playing ? 'pa-spin 0.001ms' : undefined
                }}
              />
            ))}
          </div>
          <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)' }}>
            No audio is generated in this milestone — connect a TTS provider on{' '}
            <Link href="/app/integrations" style={{ color: 'var(--lp-blue-mid)' }}>
              Integrations
            </Link>{' '}
            to hear a real render.
          </p>
        </div>
      </div>
    </>
  );
}
