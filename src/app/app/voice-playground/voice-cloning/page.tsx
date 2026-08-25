'use client';

import { useState } from 'react';
import { Check, Upload } from 'lucide-react';
import { PageHeader, DemoTag } from '@/components/app';
import { TextField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';

export default function VoiceCloningPage() {
  const ctx = useWorkspace();
  const [fileName, setFileName] = useState<string>();
  const [consent, setConsent] = useState(false);
  const [name, setName] = useState('');

  if (!ctx) return <PageSkeleton />;

  const canSubmit = Boolean(fileName) && consent && name.trim().length > 1;

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Voice playground', href: '/app/voice-playground' }, { label: 'Voice cloning' }]}
        title="Voice cloning"
        description="Clone a reference voice for use across your agents — requires explicit recorded consent."
      />

      <div className="pa-panel" style={{ maxWidth: 520 }}>
        <TextField label="Voice name" placeholder="Founder voice" value={name} onChange={(e) => setName(e.target.value)} />

        <div className="pa-field">
          <label className="pa-label">Reference audio</label>
          <button
            type="button"
            onClick={() => setFileName('reference-sample.wav')}
            style={{
              width: '100%',
              padding: '28px 16px',
              borderRadius: 10,
              border: '1.5px dashed var(--lp-line-strong)',
              background: 'var(--pa-dashed-bg)',
              color: 'var(--lp-text-soft)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Upload size={20} />
            <span style={{ fontSize: 'var(--lp-t-sm)', fontWeight: 600 }}>
              {fileName ?? 'Choose an audio file'}
            </span>
            <span style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)' }}>
              At least 60 seconds of clean, single-speaker audio · WAV or MP3
            </span>
          </button>
        </div>

        <div className="pa-panel" style={{ background: 'rgba(245,181,68,.06)', borderColor: 'rgba(245,181,68,.25)', marginBottom: 16 }}>
          <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-soft)', margin: 0, lineHeight: 1.55 }}>
            Requirements: the speaker must consent to their voice being cloned, and the recording must
            be theirs to use. Prospectra does not verify identity — you are responsible for consent.
          </p>
        </div>

        <label className="pa-choice" style={{ marginBottom: 16 }}>
          <input type="checkbox" className="pa-choice__input" checked={consent} onChange={() => setConsent((v) => !v)} />
          <span className="pa-choice__text">
            <span className="pa-choice__label">I confirm I have consent to clone this voice</span>
          </span>
          <span className="pa-choice__mark" style={consent ? { background: 'var(--lp-blue-core)', borderColor: 'var(--lp-blue-core)' } : undefined}>
            <Check size={12} strokeWidth={3.4} style={{ opacity: consent ? 1 : 0 }} />
          </span>
        </label>

        <button className="pa-btn" disabled={!canSubmit}>
          Start cloning
        </button>
        <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)', marginTop: 10 }}>
          Cloning runs once a voice provider is connected. <DemoTag kind="not-connected" />
        </p>
      </div>
    </>
  );
}
