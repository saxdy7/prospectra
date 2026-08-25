'use client';

import { useState } from 'react';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { PageHeader, EmptyState, Drawer, ConfirmDialog, DemoTag, useToast } from '@/components/app';
import { SelectField, TextField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { newId, stamp } from '@/lib/demo-storage/store';
import type { ConcurrencyReservation } from '@/lib/types/product';

const TOTAL_CAPACITY = 10;

export default function ConcurrencyPage() {
  const ctx = useWorkspace();
  const { push } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [agentId, setAgentId] = useState('');
  const [reserved, setReserved] = useState('2');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [pendingDelete, setPendingDelete] = useState<ConcurrencyReservation | null>(null);

  if (!ctx) return <PageSkeleton />;

  const { workspaceId, data, product, persistProduct } = ctx;
  const reservations = product.concurrency?.reservations ?? [];
  const used = reservations.reduce((n, r) => n + r.reserved, 0);
  const shared = TOTAL_CAPACITY - used;

  const addReservation = async () => {
    const agent = data.agents.find((a) => a.id === agentId);
    if (!agent) return;
    const r: ConcurrencyReservation = { id: newId(), agentId: agent.id, agentName: agent.name, reserved: Number(reserved) || 1, priority };
    const next = product.concurrency ?? { id: newId(), workspaceId, totalCapacity: TOTAL_CAPACITY, reservations: [], sharedPool: TOTAL_CAPACITY, ...stamp() };
    await persistProduct({ ...product, concurrency: { ...next, reservations: [...next.reservations, r] } });
    push('Reservation added', 'success');
    setDrawerOpen(false);
  };

  const remove = async (id: string) => {
    if (!product.concurrency) return;
    await persistProduct({ ...product, concurrency: { ...product.concurrency, reservations: product.concurrency.reservations.filter((r) => r.id !== id) } });
    push('Reservation removed', 'success');
  };

  return (
    <>
      <PageHeader
        title="Concurrency"
        description="How many calls each voice agent can run at once, once telephony is connected."
        actions={
          data.agents.length > 0 && (
            <button className="pa-btn" onClick={() => setDrawerOpen(true)} disabled={shared <= 0}>
              <Plus size={15} />
              Reserve capacity
            </button>
          )
        }
      />

      <div className="pa-panel" style={{ marginBottom: 20 }}>
        <p className="pa-h3" style={{ marginBottom: 12 }}>
          Capacity — {used} / {TOTAL_CAPACITY} concurrent calls reserved
        </p>
        <div style={{ display: 'flex', height: 22, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--lp-line-strong)' }}>
          {reservations.map((r, i) => (
            <div
              key={r.id}
              style={{
                width: `${(r.reserved / TOTAL_CAPACITY) * 100}%`,
                background: ['var(--lp-blue-core)', 'var(--lp-blue-mid)', 'var(--lp-blue-lift)'][i % 3]
              }}
              title={`${r.agentName}: ${r.reserved}`}
            />
          ))}
          <div style={{ flex: 1, background: 'var(--lp-glass)' }} title={`Shared pool: ${shared}`} />
        </div>
        <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)', marginTop: 8 }}>
          {shared} slots remain in the shared pool, available to any agent without a reservation.
        </p>
      </div>

      {data.agents.length === 0 ? (
        <EmptyState icon="empty-concurrency" title="No voice agents yet" description="Draft a voice agent first, then come back to reserve capacity for it." />
      ) : reservations.length === 0 ? (
        <EmptyState
          icon="empty-concurrency"
          title="No reservations"
          description="Every agent shares the pool equally by default. Reserve capacity for an agent that needs a guaranteed minimum."
          action={
            <button className="pa-btn" onClick={() => setDrawerOpen(true)}>
              <Plus size={15} />
              Reserve capacity
            </button>
          }
        />
      ) : (
        <div className="pa-table-scroll">
          <table className="pa-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Reserved</th>
                <th>Priority</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td style={{ color: 'var(--lp-text)' }}>{r.agentName}</td>
                  <td>{r.reserved}</td>
                  <td>{r.priority}</td>
                  <td>
                    <button className="pa-icon-btn" aria-label={`Remove reservation for ${r.agentName}`} onClick={() => setPendingDelete(r)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pa-panel" style={{ marginTop: 20, display: 'flex', gap: 10, borderColor: 'rgba(245,181,68,.25)', background: 'rgba(245,181,68,.06)' }}>
        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2, color: '#f5b544' }} />
        <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-soft)', margin: 0 }}>
          Capacity only takes effect once telephony is connected — until then, no calls are placed
          regardless of this configuration. <DemoTag kind="not-connected" />
        </p>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Reserve capacity"
        footer={
          <>
            <button className="pa-btn pa-btn--ghost" onClick={() => setDrawerOpen(false)}>
              Cancel
            </button>
            <button className="pa-btn" onClick={addReservation} disabled={!agentId}>
              Reserve
            </button>
          </>
        }
      >
        <SelectField label="Agent" value={agentId} onChange={(e) => setAgentId(e.target.value)} placeholder="Choose an agent" options={data.agents.map((a) => ({ value: a.id, label: a.name }))} />
        <TextField label="Reserved slots" type="number" min={1} max={shared} value={reserved} onChange={(e) => setReserved(e.target.value)} />
        <SelectField
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'normal' | 'high')}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'normal', label: 'Normal' },
            { value: 'high', label: 'High' }
          ]}
        />
      </Drawer>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove(pendingDelete.id)}
        title="Remove this reservation?"
        description={`${pendingDelete?.agentName} will fall back to the shared pool with no guaranteed minimum.`}
        confirmLabel="Remove reservation"
      />
    </>
  );
}
