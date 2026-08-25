'use client';

import { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { PageHeader, EmptyState, Drawer, ConfirmDialog, StatusPill, useToast } from '@/components/app';
import { TextField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { newId, stamp } from '@/lib/demo-storage/store';
import { logActivity } from '@/lib/demo-storage/store';
import type { WebhookEndpoint } from '@/lib/types/models';

const EVENTS = ['search.completed', 'import.completed', 'enrichment.completed', 'campaign.step.sent', 'call.completed'];

export default function WebhooksPage() {
  const ctx = useWorkspace();
  const { push } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [events, setEvents] = useState<string[]>([EVENTS[0]]);
  const [pendingDelete, setPendingDelete] = useState<WebhookEndpoint | null>(null);

  if (!ctx) return <PageSkeleton />;

  const { workspaceId, product, persistProduct } = ctx;

  const create = async () => {
    if (!/^https?:\/\//.test(url)) return;
    const wh: WebhookEndpoint = { id: newId(), workspaceId, url: url.trim(), events, secretRef: `whsec_${newId().slice(0, 12)}`, active: true, ...stamp() };
    await persistProduct({ ...product, webhooks: [wh, ...product.webhooks] });
    await logActivity(workspaceId, 'workspace', `Created webhook for ${events.length} event${events.length === 1 ? '' : 's'}`);
    push('Webhook created', 'success');
    setDrawerOpen(false);
    setUrl('');
  };

  const remove = async (id: string) => {
    await persistProduct({ ...product, webhooks: product.webhooks.filter((w) => w.id !== id) });
    push('Webhook deleted', 'success');
  };

  return (
    <>
      <PageHeader
        title="Webhooks"
        description="Notify an external system when something happens in this workspace."
        actions={
          <button className="pa-btn" onClick={() => setDrawerOpen(true)}>
            <Plus size={15} />
            Create webhook
          </button>
        }
      />

      {product.webhooks.length === 0 ? (
        <EmptyState
          icon="empty-webhooks"
          title="No webhooks yet"
          description="Add an endpoint and choose which events should notify it."
          action={
            <button className="pa-btn" onClick={() => setDrawerOpen(true)}>
              <Plus size={15} />
              Create webhook
            </button>
          }
        />
      ) : (
        <>
          <div className="pa-table-scroll" style={{ marginBottom: 24 }}>
            <table className="pa-table">
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>Events</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {product.webhooks.map((w) => (
                  <tr key={w.id}>
                    <td style={{ color: 'var(--lp-text)', fontFamily: 'monospace', fontSize: 12 }}>{w.url}</td>
                    <td>{w.events.length}</td>
                    <td>
                      <StatusPill label={w.active ? 'Active' : 'Paused'} tone={w.active ? 'success' : 'muted'} />
                    </td>
                    <td>
                      <button className="pa-icon-btn" aria-label={`Delete webhook ${w.url}`} onClick={() => setPendingDelete(w)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pa-panel">
            <p className="pa-h3" style={{ marginBottom: 10 }}>
              Delivery log
            </p>
            <EmptyState icon="empty-webhooks" title="No deliveries yet" description="Deliveries appear here once a real event fires — nothing has triggered a webhook yet." />
          </div>
        </>
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Create webhook"
        footer={
          <>
            <button className="pa-btn pa-btn--ghost" onClick={() => setDrawerOpen(false)}>
              Cancel
            </button>
            <button className="pa-btn" onClick={create} disabled={!/^https?:\/\//.test(url) || events.length === 0}>
              Create
            </button>
          </>
        }
      >
        <TextField label="Endpoint URL" placeholder="https://example.com/webhooks/prospectra" value={url} onChange={(e) => setUrl(e.target.value)} />
        <fieldset>
          <legend className="pa-label" style={{ marginBottom: 8 }}>
            Events
          </legend>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {EVENTS.map((ev) => (
              <label key={ev} className="pa-choice" style={{ padding: '9px 12px' }}>
                <input
                  type="checkbox"
                  className="pa-choice__input"
                  checked={events.includes(ev)}
                  onChange={() => setEvents((prev) => (prev.includes(ev) ? prev.filter((x) => x !== ev) : [...prev, ev]))}
                />
                <span className="pa-choice__text">
                  <span className="pa-choice__label" style={{ fontFamily: 'monospace', fontWeight: 500 }}>
                    {ev}
                  </span>
                </span>
                <span className="pa-choice__mark">
                  <Check size={12} strokeWidth={3.4} />
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </Drawer>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove(pendingDelete.id)}
        title="Delete this webhook?"
        description={`Deliveries to "${pendingDelete?.url}" will stop immediately.`}
        confirmLabel="Delete webhook"
      />
    </>
  );
}
