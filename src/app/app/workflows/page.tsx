'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader, EmptyState, DataTable, useToast } from '@/components/app';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { newId, stamp } from '@/lib/demo-storage/store';
import { logActivity } from '@/lib/demo-storage/store';
import { WORKFLOW_TEMPLATES } from '@/lib/mock-data/workflow-templates';
import type { Workflow } from '@/lib/types/product';
import { WorkflowCanvas } from '@/components/app/WorkflowCanvas';

export default function WorkflowsPage() {
  const ctx = useWorkspace();
  const { push } = useToast();
  const [openId, setOpenId] = useState<string | null>(null);

  if (!ctx) return <PageSkeleton />;

  const { workspaceId, product, persistProduct } = ctx;

  const fromTemplate = async (t: (typeof WORKFLOW_TEMPLATES)[number]) => {
    const wf: Workflow = { id: newId(), workspaceId, ...t, isTemplate: false, ...stamp() };
    await persistProduct({ ...product, workflows: [wf, ...product.workflows] });
    await logActivity(workspaceId, 'workspace', `Created workflow "${wf.name}" from template`);
    push(`Workflow created from "${t.name}"`, 'success');
    setOpenId(wf.id);
  };

  const blank = async () => {
    const wf: Workflow = {
      id: newId(),
      workspaceId,
      name: 'Untitled workflow',
      description: '',
      status: 'draft',
      isTemplate: false,
      nodes: [{ id: newId(), kind: 'trigger', label: 'Manual trigger', x: 60, y: 140 }],
      edges: [],
      ...stamp()
    };
    await persistProduct({ ...product, workflows: [wf, ...product.workflows] });
    push('Blank workflow created', 'success');
    setOpenId(wf.id);
  };

  const open = product.workflows.find((w) => w.id === openId);

  if (open) {
    return (
      <>
        <PageHeader
          crumbs={[{ label: 'Workflows', href: '/app/workflows' }, { label: open.name }]}
          title={open.name}
          description="Visual builder — no workflow executes yet. Save it, and it runs the moment triggers connect."
          actions={
            <button className="pa-btn pa-btn--ghost" onClick={() => setOpenId(null)}>
              Back to workflows
            </button>
          }
        />
        <WorkflowCanvas
          workflow={open}
          onChange={(next) =>
            persistProduct({
              ...product,
              workflows: product.workflows.map((w) => (w.id === next.id ? next : w))
            })
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Workflows"
        description="Connect sourcing, enrichment, and outreach into one automated chain."
        actions={
          <button className="pa-btn" onClick={blank}>
            <Plus size={15} />
            New workflow
          </button>
        }
      />

      <p className="pa-h3" style={{ marginBottom: 14 }}>
        Templates
      </p>
      <div className="pa-grid pa-grid--two" style={{ marginTop: 0, marginBottom: 28 }}>
        {WORKFLOW_TEMPLATES.map((t) => (
          <button key={t.name} className="pa-panel" style={{ textAlign: 'left', cursor: 'pointer' }} onClick={() => fromTemplate(t)}>
            <p className="pa-h3" style={{ fontSize: '0.9375rem', marginBottom: 6 }}>
              {t.name}
            </p>
            <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)', lineHeight: 1.5 }}>{t.description}</p>
            <p style={{ fontSize: 11, color: 'var(--lp-text-faint)', marginTop: 8 }}>{t.nodes.length} steps</p>
          </button>
        ))}
      </div>

      <p className="pa-h3" style={{ marginBottom: 14 }}>
        Your workflows
      </p>
      {product.workflows.length === 0 ? (
        <EmptyState icon="empty-workflows" title="No workflows yet" description="Start from a template above, or build one from scratch." />
      ) : (
        <DataTable<Workflow>
          columns={[
            { key: 'name', label: 'Name', render: (w) => <span style={{ fontWeight: 600, color: 'var(--lp-text)' }}>{w.name}</span> },
            { key: 'nodes', label: 'Steps', width: '90px', render: (w) => w.nodes.length },
            { key: 'status', label: 'Status', width: '100px', render: (w) => w.status }
          ]}
          rows={product.workflows}
          onRowClick={(w) => setOpenId(w.id)}
        />
      )}
    </>
  );
}
