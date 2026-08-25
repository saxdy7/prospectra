'use client';

import { useRef, useState } from 'react';
import {
  Bot,
  Clock,
  Filter,
  Mic,
  Search,
  Send,
  Sparkles,
  Webhook as WebhookIcon
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { newId } from '@/lib/demo-storage/store';
import type { Workflow, WorkflowNode, WorkflowNodeKind } from '@/lib/types/product';

const NODE_META: Record<WorkflowNodeKind, { label: string; icon: LucideIcon; color: string }> = {
  trigger: { label: 'Trigger', icon: Sparkles, color: '#8aa8ff' },
  search: { label: 'Search', icon: Search, color: '#4d7bff' },
  enrich: { label: 'Enrich', icon: Filter, color: '#285fff' },
  filter: { label: 'Filter', icon: Filter, color: '#6d92ff' },
  claygent: { label: 'Claygent', icon: Bot, color: '#b6c9ff' },
  campaign: { label: 'Campaign', icon: Send, color: '#4d7bff' },
  voice_call: { label: 'Voice call', icon: Mic, color: '#8aa8ff' },
  webhook: { label: 'Webhook', icon: WebhookIcon, color: '#285fff' },
  delay: { label: 'Delay', icon: Clock, color: '#6d92ff' }
};

const PALETTE: WorkflowNodeKind[] = ['trigger', 'search', 'enrich', 'filter', 'claygent', 'campaign', 'voice_call', 'webhook', 'delay'];

const NODE_W = 176;
const NODE_H = 60;

/**
 * A real, draggable node canvas. Nothing here executes — this is the
 * frontend-only builder the milestone asks for, not a runtime.
 */
export function WorkflowCanvas({ workflow, onChange }: { workflow: Workflow; onChange: (next: Workflow) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const selectedNode = workflow.nodes.find((n) => n.id === selected);

  const startDrag = (e: React.PointerEvent, node: WorkflowNode) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragState.current = { id: node.id, offsetX: e.clientX - rect.left - node.x, offsetY: e.clientY - rect.top - node.y };
    setSelected(node.id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onDrag = (e: React.PointerEvent) => {
    const drag = dragState.current;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!drag || !rect) return;
    const x = Math.max(0, e.clientX - rect.left - drag.offsetX);
    const y = Math.max(0, e.clientY - rect.top - drag.offsetY);
    onChange({ ...workflow, nodes: workflow.nodes.map((n) => (n.id === drag.id ? { ...n, x, y } : n)) });
  };

  const endDrag = () => {
    dragState.current = null;
  };

  const addNode = (kind: WorkflowNodeKind) => {
    const node: WorkflowNode = { id: newId(), kind, label: NODE_META[kind].label, x: 60 + workflow.nodes.length * 24, y: 60 + workflow.nodes.length * 24 };
    onChange({ ...workflow, nodes: [...workflow.nodes, node] });
  };

  const removeNode = (id: string) => {
    onChange({
      ...workflow,
      nodes: workflow.nodes.filter((n) => n.id !== id),
      edges: workflow.edges.filter((e) => e.fromNodeId !== id && e.toNodeId !== id)
    });
    if (selected === id) setSelected(null);
  };

  const clickNode = (id: string) => {
    if (connecting && connecting !== id) {
      onChange({ ...workflow, edges: [...workflow.edges, { id: newId(), fromNodeId: connecting, toNodeId: id }] });
      setConnecting(null);
      return;
    }
    setSelected(id);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 260px', gap: 14 }}>
      {/* Palette */}
      <div className="pa-panel" style={{ padding: 12 }}>
        <p style={{ fontSize: 'var(--lp-t-caption)', fontWeight: 700, color: 'var(--lp-text-faint)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.04em' }}>
          Add a node
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {PALETTE.map((kind) => {
            const meta = NODE_META[kind];
            return (
              <button
                key={kind}
                className="pa-nav__item"
                style={{ width: '100%' }}
                onClick={() => addNode(kind)}
              >
                <meta.icon size={14} strokeWidth={1.9} style={{ color: meta.color }} />
                <span className="pa-nav__label">{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        onPointerMove={onDrag}
        onPointerUp={endDrag}
        style={{
          position: 'relative',
          minHeight: 460,
          borderRadius: 'var(--pa-r-lg)',
          border: '1px solid var(--lp-line-strong)',
          background:
            'radial-gradient(var(--lp-line-strong) 1px, transparent 1px) 0 0 / 22px 22px, var(--lp-void)',
          overflow: 'hidden'
        }}
      >
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {workflow.edges.map((edge) => {
            const from = workflow.nodes.find((n) => n.id === edge.fromNodeId);
            const to = workflow.nodes.find((n) => n.id === edge.toNodeId);
            if (!from || !to) return null;
            const x1 = from.x + NODE_W;
            const y1 = from.y + NODE_H / 2;
            const x2 = to.x;
            const y2 = to.y + NODE_H / 2;
            const mid = (x1 + x2) / 2;
            return (
              <path
                key={edge.id}
                d={`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`}
                stroke="var(--lp-blue-mid)"
                strokeWidth={1.5}
                fill="none"
                opacity={0.7}
              />
            );
          })}
        </svg>

        {workflow.nodes.map((node) => {
          const meta = NODE_META[node.kind];
          return (
            <div
              key={node.id}
              onPointerDown={(e) => startDrag(e, node)}
              onClick={() => clickNode(node.id)}
              style={{
                position: 'absolute',
                left: node.x,
                top: node.y,
                width: NODE_W,
                height: NODE_H,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '0 12px',
                borderRadius: 12,
                border: `1px solid ${selected === node.id ? 'var(--lp-blue-core)' : 'var(--lp-line-strong)'}`,
                background: 'var(--pa-surface-solid)',
                backdropFilter: 'blur(10px)',
                cursor: 'grab',
                boxShadow: selected === node.id ? '0 0 0 3px rgba(40,95,255,.2)' : '0 8px 20px -12px rgba(0,0,0,.5)'
              }}
            >
              <span style={{ width: 28, height: 28, borderRadius: 8, display: 'grid', placeItems: 'center', background: 'var(--lp-glass-strong)', flexShrink: 0 }}>
                <meta.icon size={14} color={meta.color} />
              </span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--lp-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {node.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Inspector */}
      <div className="pa-panel" style={{ padding: 16 }}>
        <p className="pa-h3" style={{ marginBottom: 12, fontSize: '0.9375rem' }}>
          Inspector
        </p>
        {!selectedNode ? (
          <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)' }}>
            Select a node to edit it, or click a node then another to connect them.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label className="pa-field" style={{ marginBottom: 0 }}>
              <span className="pa-label">Label</span>
              <input
                className="pa-input"
                value={selectedNode.label}
                onChange={(e) =>
                  onChange({
                    ...workflow,
                    nodes: workflow.nodes.map((n) => (n.id === selectedNode.id ? { ...n, label: e.target.value } : n))
                  })
                }
              />
            </label>
            <button className="pa-btn pa-btn--ghost" style={{ height: 34 }} onClick={() => setConnecting(selectedNode.id)}>
              Connect to…
            </button>
            {connecting === selectedNode.id && (
              <p style={{ fontSize: 11, color: 'var(--lp-blue-mid)' }}>Now click another node to connect.</p>
            )}
            <button
              className="pa-btn pa-btn--ghost"
              style={{ height: 34, color: '#ff8a8a', borderColor: 'rgba(255,122,122,.3)' }}
              onClick={() => removeNode(selectedNode.id)}
            >
              Delete node
            </button>
          </div>
        )}

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--lp-line)' }}>
          <label className="pa-field" style={{ marginBottom: 0 }}>
            <span className="pa-label">Workflow name</span>
            <input className="pa-input" value={workflow.name} onChange={(e) => onChange({ ...workflow, name: e.target.value })} />
          </label>
        </div>
      </div>
    </div>
  );
}
