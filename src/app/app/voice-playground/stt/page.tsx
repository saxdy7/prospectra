'use client';

import { useState } from 'react';
import { Mic, Shield } from 'lucide-react';
import { PageHeader, DemoTag } from '@/components/app';
import { TextField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';

const SAMPLE_TRANSCRIPT =
  'Hi, thanks for calling — I noticed your business on the map. Do you currently take bookings by phone?';

export default function SttPage() {
  const ctx = useWorkspace();
  const [recording, setRecording] = useState(false);
  const [redactPii, setRedactPii] = useState(true);
  const [redactPci, setRedactPci] = useState(true);
  const [vocab, setVocab] = useState('Prospectra, HyperScale, NeuralGlow');

  if (!ctx) return <PageSkeleton />;

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Voice playground', href: '/app/voice-playground' }, { label: 'Speech to text' }]}
        title="Speech to text"
        description="See how a call transcribes, with PII/PCI redaction and custom vocabulary."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 380px) 1fr', gap: 20 }}>
        <div className="pa-panel">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              padding: '24px 0',
              marginBottom: 16,
              borderBottom: '1px solid var(--lp-line)'
            }}
          >
            <button
              onClick={() => setRecording((v) => !v)}
              aria-pressed={recording}
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                background: recording ? '#c8324b' : 'var(--lp-blue-core)',
                boxShadow: recording ? '0 0 0 8px rgba(200,50,75,.18)' : '0 0 0 0 rgba(40,95,255,0)',
                transition: 'box-shadow .4s ease, background-color .3s ease',
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <Mic size={24} color="#fff" />
            </button>
            <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)' }}>
              {recording ? 'Recording (simulated)…' : 'Tap to simulate a recording'}
            </p>
          </div>

          <TextField label="Custom vocabulary" hint="Comma-separated terms the model should recognise reliably." value={vocab} onChange={(e) => setVocab(e.target.value)} />

          <fieldset style={{ marginTop: 12 }}>
            <legend className="pa-label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={13} />
              Redaction
            </legend>
            <label className="pa-choice" style={{ marginBottom: 8 }}>
              <input type="checkbox" className="pa-choice__input" checked={redactPii} onChange={() => setRedactPii((v) => !v)} />
              <span className="pa-choice__text">
                <span className="pa-choice__label">Redact PII</span>
                <span className="pa-choice__blurb">Names, addresses, phone numbers</span>
              </span>
              <span className="pa-choice__mark" style={redactPii ? { background: 'var(--lp-blue-core)', borderColor: 'var(--lp-blue-core)' } : undefined} />
            </label>
            <label className="pa-choice">
              <input type="checkbox" className="pa-choice__input" checked={redactPci} onChange={() => setRedactPci((v) => !v)} />
              <span className="pa-choice__text">
                <span className="pa-choice__label">Redact PCI</span>
                <span className="pa-choice__blurb">Card and payment details</span>
              </span>
              <span className="pa-choice__mark" style={redactPci ? { background: 'var(--lp-blue-core)', borderColor: 'var(--lp-blue-core)' } : undefined} />
            </label>
          </fieldset>
        </div>

        <div className="pa-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <p className="pa-h3" style={{ margin: 0 }}>
              Transcript
            </p>
            <DemoTag kind="simulation" />
          </div>
          <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-soft)', lineHeight: 1.6 }}>
            {recording ? SAMPLE_TRANSCRIPT : 'Start a simulated recording to see a transcript appear here.'}
          </p>
          {recording && (redactPii || redactPci) && (
            <p style={{ marginTop: 12, fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)' }}>
              Redaction happens server-side before storage — nothing sensitive is ever written to disk
              unredacted, once a real transcription provider is connected.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
