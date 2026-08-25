'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { PageHeader, Drawer, useToast } from '@/components/app';
import { TextField, TextareaField, SelectField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { newId, stamp } from '@/lib/demo-storage/store';
import { logActivity } from '@/lib/demo-storage/store';
import { FUNCTIONS, FUNCTION_CATEGORIES } from '@/lib/mock-data/functions';
import type { FunctionDef } from '@/lib/types/product';

export default function FunctionsPage() {
  const ctx = useWorkspace();
  const { push } = useToast();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [sig, setSig] = useState('');
  const [cat, setCat] = useState<FunctionDef['category']>('utility');

  if (!ctx) return <PageSkeleton />;

  const { workspaceId, product, persistProduct } = ctx;
  const all = [...FUNCTIONS, ...product.functions];
  const filtered = all.filter((f) => {
    if (category !== 'all' && f.category !== category) return false;
    if (query && !f.name.toLowerCase().includes(query.toLowerCase()) && !f.description.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const create = async () => {
    if (!name.trim()) return;
    const fn: FunctionDef = {
      id: newId(),
      workspaceId,
      name: name.trim().toUpperCase().replace(/\s+/g, '_'),
      category: cat,
      description: desc.trim(),
      signature: sig.trim() || `${name.trim().toUpperCase()}(column)`,
      example: '',
      isBuiltIn: false,
      usageCount: 0,
      ...stamp()
    };
    await persistProduct({ ...product, functions: [fn, ...product.functions] });
    await logActivity(workspaceId, 'workspace', `Created custom function ${fn.name}`);
    push('Function created', 'success');
    setDrawerOpen(false);
    setName('');
    setDesc('');
    setSig('');
  };

  return (
    <>
      <PageHeader
        title="Functions"
        description="Formulas and enrichment functions available on any AI-formula column."
        actions={
          <button className="pa-btn" onClick={() => setDrawerOpen(true)}>
            <Plus size={15} />
            Create function
          </button>
        }
      />

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <label className="pa-table-search" style={{ maxWidth: 280 }}>
          <Search size={15} />
          <input placeholder="Search functions…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button className={`pa-chip${category === 'all' ? ' is-active' : ''}`} style={category === 'all' ? { borderColor: 'var(--lp-blue-core)', color: 'var(--lp-blue-mid)' } : undefined} onClick={() => setCategory('all')}>
            All
          </button>
          {FUNCTION_CATEGORIES.map((c) => (
            <button
              key={c.id}
              className="pa-chip"
              style={category === c.id ? { borderColor: 'var(--lp-blue-core)', color: 'var(--lp-blue-mid)' } : undefined}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pa-grid pa-grid--two" style={{ marginTop: 0 }}>
        {filtered.map((f) => (
          <div key={f.id} className="pa-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <code style={{ fontFamily: 'monospace', fontSize: '0.9375rem', color: 'var(--lp-text)', fontWeight: 600 }}>{f.name}</code>
              <span style={{ fontSize: 10, color: 'var(--lp-text-faint)', textTransform: 'uppercase' }}>{f.category}</span>
            </div>
            <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)', marginBottom: 8 }}>{f.description}</p>
            <code style={{ display: 'block', fontFamily: 'monospace', fontSize: 12, color: 'var(--lp-blue-mid)', background: 'rgba(40,95,255,.08)', padding: '6px 10px', borderRadius: 6 }}>
              {f.signature}
            </code>
          </div>
        ))}
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Create a function"
        footer={
          <>
            <button className="pa-btn pa-btn--ghost" onClick={() => setDrawerOpen(false)}>
              Cancel
            </button>
            <button className="pa-btn" onClick={create} disabled={!name.trim()}>
              Create
            </button>
          </>
        }
      >
        <TextField label="Name" placeholder="Extract Phone" value={name} onChange={(e) => setName(e.target.value)} />
        <SelectField label="Category" value={cat} onChange={(e) => setCat(e.target.value as FunctionDef['category'])} options={FUNCTION_CATEGORIES.map((c) => ({ value: c.id, label: c.label }))} />
        <TextareaField label="Description" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
        <TextField label="Signature" optional placeholder="EXTRACT_PHONE(column)" value={sig} onChange={(e) => setSig(e.target.value)} />
      </Drawer>
    </>
  );
}
