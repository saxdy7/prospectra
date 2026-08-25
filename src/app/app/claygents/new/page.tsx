'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, Plus, Trash2 } from 'lucide-react';
import { PageHeader, DemoTag, useToast } from '@/components/app';
import { TextField, TextareaField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { newId, stamp } from '@/lib/demo-storage/store';
import { logActivity } from '@/lib/demo-storage/store';
import { CLAYGENT_TEMPLATES } from '@/lib/mock-data/claygent-templates';
import type { Claygent, ClaygentOutputColumn } from '@/lib/types/product';

export default function NewClaygentPage() {
  const router = useRouter();
  const params = useSearchParams();
  const ctx = useWorkspace();
  const { push } = useToast();

  const initial = CLAYGENT_TEMPLATES.find((t) => t.template === params.get('template'));

  const [name, setName] = useState(initial?.name ?? '');
  const [prompt, setPrompt] = useState(initial?.prompt ?? '');
  const [inputDescription, setInputDescription] = useState(initial?.inputDescription ?? '');
  const [outputs, setOutputs] = useState<ClaygentOutputColumn[]>(
    initial?.outputColumns ?? [{ id: newId(), label: '', type: 'text', description: '' }]
  );

  if (!ctx) return <PageSkeleton />;

  const { workspaceId, product, persistProduct } = ctx;

  const updateOutput = (id: string, patch: Partial<ClaygentOutputColumn>) =>
    setOutputs((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));

  const create = async () => {
    const agent: Claygent = {
      id: newId(),
      workspaceId,
      name: name.trim() || 'Untitled research agent',
      template: initial?.template ?? 'prospecting',
      prompt: prompt.trim(),
      inputDescription: inputDescription.trim(),
      outputColumns: outputs.filter((o) => o.label.trim()),
      runSettings: { model: 'prospectra-research-v1', maxRowsPerRun: 200, creditsPerRow: 2 },
      status: 'ready',
      ...stamp()
    };
    await persistProduct({ ...product, claygents: [agent, ...product.claygents] });
    await logActivity(workspaceId, 'workspace', `Created research agent "${agent.name}"`);
    push('Research agent saved', 'success');
    router.push('/app/claygents');
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Claygent research', href: '/app/claygents' }, { label: 'New' }]}
        title="Build a research agent"
        description="Write the prompt, describe the input, and pick what it should fill in — runs activate once a model provider is connected."
        actions={
          <button className="pa-btn pa-btn--ghost" onClick={() => router.push('/app/claygents')}>
            <ArrowLeft size={15} />
            Cancel
          </button>
        }
      />

      <div className="pa-panel" style={{ maxWidth: 640 }}>
        <TextField label="Name" placeholder="Prospecting research" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField
          label="Input"
          hint="What table/column this agent reads from."
          placeholder="A table with a company name and website column."
          value={inputDescription}
          onChange={(e) => setInputDescription(e.target.value)}
        />
        <TextareaField label="Prompt" rows={6} value={prompt} onChange={(e) => setPrompt(e.target.value)} />

        <div className="pa-field">
          <label className="pa-label">Output columns</label>
          {outputs.map((o, i) => (
            <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '1fr 130px 32px', gap: 8, marginBottom: 8 }}>
              <input
                className="pa-input"
                placeholder="Column label"
                value={o.label}
                onChange={(e) => updateOutput(o.id, { label: e.target.value })}
              />
              <select className="pa-input pa-select" value={o.type} onChange={(e) => updateOutput(o.id, { type: e.target.value as ClaygentOutputColumn['type'] })}>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="status">Status</option>
                <option value="url">URL</option>
              </select>
              <button
                className="pa-icon-btn"
                aria-label={`Remove output ${i + 1}`}
                onClick={() => setOutputs((prev) => prev.filter((x) => x.id !== o.id))}
                disabled={outputs.length === 1}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            className="pa-btn pa-btn--ghost"
            style={{ height: 36 }}
            onClick={() => setOutputs((prev) => [...prev, { id: newId(), label: '', type: 'text', description: '' }])}
          >
            <Plus size={14} />
            Add output column
          </button>
        </div>

        <div className="pa-panel" style={{ marginTop: 8, borderColor: 'rgba(245,181,68,.25)', background: 'rgba(245,181,68,.06)' }}>
          <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-soft)', margin: 0 }}>
            Runs need a connected model provider. This saves the agent, ready to run the moment one is
            connected. <DemoTag kind="not-connected" />
          </p>
        </div>

        <button className="pa-btn" style={{ marginTop: 16 }} onClick={create} disabled={!name.trim() || !prompt.trim()}>
          <Check size={15} />
          Save research agent
        </button>
      </div>
    </>
  );
}
