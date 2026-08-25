'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { PageHeader, DemoTag, StatusPill, useToast } from '@/components/app';
import { SelectField, TextField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { FUNCTIONS } from '@/lib/mock-data/functions';

const CLIENTS = [
  { id: 'claude-desktop', name: 'Claude Desktop', status: 'not_connected' as const },
  { id: 'cursor', name: 'Cursor', status: 'not_connected' as const },
  { id: 'custom', name: 'Custom MCP client', status: 'not_connected' as const }
];

export default function McpPage() {
  const ctx = useWorkspace();
  const { push } = useToast();
  const [visibility, setVisibility] = useState<'all' | 'allowlist'>('all');
  const [limit, setLimit] = useState('100');

  if (!ctx) return <PageSkeleton />;

  const endpoint = `https://mcp.prospectra.ai/${ctx.workspaceId.slice(0, 8)}`;

  return (
    <>
      <PageHeader
        title="MCP"
        description="Let AI clients call Prospectra's functions directly through the Model Context Protocol."
      />

      <div className="pa-grid pa-grid--two" style={{ marginTop: 0, marginBottom: 20 }}>
        <div className="pa-panel">
          <p className="pa-h3" style={{ marginBottom: 12 }}>
            Connection
          </p>
          <div
            style={{
              position: 'relative',
              padding: 12,
              borderRadius: 10,
              background: '#05070f',
              border: '1px solid var(--lp-line-strong)',
              fontFamily: 'monospace',
              fontSize: 12,
              color: 'var(--lp-text-soft)',
              overflowX: 'auto',
              marginBottom: 10
            }}
          >
            {endpoint}
          </div>
          <button
            className="pa-btn pa-btn--ghost"
            style={{ height: 34 }}
            onClick={() => {
              navigator.clipboard?.writeText(endpoint);
              push('Copied endpoint', 'success');
            }}
          >
            <Copy size={13} />
            Copy endpoint
          </button>
          <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)', marginTop: 10 }}>
            The endpoint is real; authorizing a client against it activates once account-level API keys
            ship. <DemoTag kind="coming-soon" />
          </p>
        </div>

        <div className="pa-panel">
          <p className="pa-h3" style={{ marginBottom: 12 }}>
            Defaults
          </p>
          <TextField
            label="Default credit limit per client"
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            hint="Caps how many credits an MCP client can spend calling functions before it needs re-authorization."
          />
          <SelectField
            label="Function visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as 'all' | 'allowlist')}
            options={[
              { value: 'all', label: 'All functions' },
              { value: 'allowlist', label: 'Only an allowlist' }
            ]}
          />
        </div>
      </div>

      <div className="pa-panel" style={{ marginBottom: 20 }}>
        <p className="pa-h3" style={{ marginBottom: 12 }}>
          Client permissions
        </p>
        <div className="pa-table-scroll">
          <table className="pa-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Status</th>
                <th>Functions allowed</th>
              </tr>
            </thead>
            <tbody>
              {CLIENTS.map((c) => (
                <tr key={c.id}>
                  <td style={{ color: 'var(--lp-text)' }}>{c.name}</td>
                  <td>
                    <StatusPill label="Not connected" tone="muted" />
                  </td>
                  <td>{visibility === 'all' ? 'All' : 'Allowlist only'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {visibility === 'allowlist' && (
        <div className="pa-panel">
          <p className="pa-h3" style={{ marginBottom: 12 }}>
            Allowlisted functions
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FUNCTIONS.slice(0, 8).map((f) => (
              <label key={f.id} className="pa-choice" style={{ padding: '10px 14px' }}>
                <input type="checkbox" className="pa-choice__input" defaultChecked />
                <span className="pa-choice__text">
                  <span className="pa-choice__label" style={{ fontFamily: 'monospace' }}>
                    {f.name}
                  </span>
                </span>
                <span className="pa-choice__mark">
                  <Check size={12} strokeWidth={3.4} />
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
