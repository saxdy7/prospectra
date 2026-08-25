'use client';

import { useRouter } from 'next/navigation';
import { AudioLines, Mic2, Volume2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/app';

const ITEMS: { href: string; icon: LucideIcon; title: string; desc: string }[] = [
  { href: '/app/voice-playground/tts', icon: Volume2, title: 'Text to speech', desc: 'Preview any voice reading text you type, before wiring it into an agent.' },
  { href: '/app/voice-playground/stt', icon: AudioLines, title: 'Speech to text', desc: 'See how a recording transcribes, with PII/PCI redaction controls.' },
  { href: '/app/voice-playground/voice-cloning', icon: Mic2, title: 'Voice cloning', desc: 'Clone a reference voice for use across your agents.' }
];

export default function VoicePlaygroundPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader title="Voice playground" description="Try the pieces that make up a voice agent, on their own." />
      <div className="pa-grid pa-grid--two" style={{ marginTop: 0 }}>
        {ITEMS.map((i) => (
          <button key={i.href} className="pa-panel" style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10 }} onClick={() => router.push(i.href)}>
            <span style={{ width: 40, height: 40, borderRadius: 11, display: 'grid', placeItems: 'center', background: 'rgba(40,95,255,.12)', color: 'var(--lp-blue-mid)' }}>
              <i.icon size={19} />
            </span>
            <p className="pa-h3">{i.title}</p>
            <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)', lineHeight: 1.5 }}>{i.desc}</p>
          </button>
        ))}
      </div>
    </>
  );
}
