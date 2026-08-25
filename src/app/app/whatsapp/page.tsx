'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { PageHeader, DemoTag, EmptyState, useToast } from '@/components/app';
import { SelectField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { stamp } from '@/lib/demo-storage/store';

const CHECKLIST = [
  'Connect the WhatsApp Cloud API to a business phone number',
  'Verify your Meta Business account',
  'Submit a message template for approval',
  'Assign a voice or text agent to the number'
];

export default function WhatsAppPage() {
  const ctx = useWorkspace();
  const { push } = useToast();
  const [agentId, setAgentId] = useState('');

  if (!ctx) return <PageSkeleton />;

  const { workspaceId, data, product, persistProduct } = ctx;
  const deployment = product.whatsapp;

  const saveSelection = async (id: string) => {
    setAgentId(id);
    await persistProduct({
      ...product,
      whatsapp: { id: deployment?.id ?? `wa-${workspaceId}`, workspaceId, agentId: id, status: 'pending', ...stamp() }
    });
    push('Agent selected — connect a number to finish setup', 'success');
  };

  return (
    <>
      <PageHeader title="WhatsApp" description="Deploy a voice or text agent as a WhatsApp conversation." />

      <div className="pa-grid pa-grid--two" style={{ marginTop: 0, marginBottom: 20 }}>
        <div className="pa-panel">
          <p className="pa-h3" style={{ marginBottom: 12 }}>
            Agent selection
          </p>
          {data.agents.length === 0 ? (
            <EmptyState icon="empty-whatsapp" title="No agents yet" description="Draft a voice agent first, then assign it here." />
          ) : (
            <SelectField label="Agent" value={agentId || deployment?.agentId || ''} onChange={(e) => saveSelection(e.target.value)} placeholder="Choose an agent" options={data.agents.map((a) => ({ value: a.id, label: a.name }))} />
          )}

          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)' }}>Number connection:</span>
            <DemoTag kind="not-connected" />
          </div>
        </div>

        <div className="pa-panel">
          <p className="pa-h3" style={{ marginBottom: 12 }}>
            Conversation preview
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Bubble from="them" text="Hi, do you have availability this week?" />
            <Bubble from="me" text="Yes! Let me check the calendar and get back to you shortly." />
          </div>
          <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)', marginTop: 10 }}>
            Illustrates the deployed experience. <DemoTag kind="demo" />
          </p>
        </div>
      </div>

      <div className="pa-panel">
        <p className="pa-h3" style={{ marginBottom: 12 }}>
          Setup checklist
        </p>
        <ul className="pa-check" style={{ margin: 0 }}>
          {CHECKLIST.map((item) => (
            <li key={item} className="pa-check__item" style={{ cursor: 'default' }}>
              <span className="pa-check__box">
                <Check size={11} strokeWidth={3.4} style={{ opacity: 0 }} />
              </span>
              <span className="pa-check__label" style={{ fontWeight: 400 }}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Bubble({ from, text }: { from: 'me' | 'them'; text: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: from === 'me' ? 'flex-end' : 'flex-start' }}>
      <span
        style={{
          maxWidth: '80%',
          padding: '9px 13px',
          borderRadius: 12,
          fontSize: 'var(--lp-t-sm)',
          background: from === 'me' ? 'rgba(40,95,255,.16)' : 'var(--lp-glass-strong)',
          color: from === 'me' ? 'var(--lp-blue-mid)' : 'var(--lp-text-soft)'
        }}
      >
        {text}
      </span>
    </div>
  );
}
