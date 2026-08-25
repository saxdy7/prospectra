'use client';

import { useState } from 'react';
import { Bot, Mail, MessageCircle, Search, Table2, Users, Webhook } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader, useToast } from '@/components/app';

const GUIDES: { category: string; icon: LucideIcon; items: string[] }[] = [
  { category: 'Sourcing leads', icon: Search, items: ['Building your first local-business search', 'Company search filters explained', 'Understanding lookalike matching'] },
  { category: 'Tables & imports', icon: Table2, items: ['Column types explained', 'Mapping a CSV import', 'Adding an AI formula column'] },
  { category: 'Audiences & campaigns', icon: Users, items: ['Building an audience from a table', 'Writing a multi-step email sequence', 'What "sending" needs before it activates'] },
  { category: 'Voice agents', icon: Bot, items: ['Writing an effective agent prompt', 'Testing an agent in simulation mode', 'Connecting a phone number'] },
  { category: 'Developer', icon: Webhook, items: ['Setting up a webhook', 'Connecting an MCP client', 'API keys and credential storage'] }
];

export default function HelpPage() {
  const [query, setQuery] = useState('');
  const { push } = useToast();

  const filtered = GUIDES.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.toLowerCase().includes(query.toLowerCase()))
  })).filter((g) => g.items.length > 0 || !query);

  return (
    <>
      <PageHeader title="Help" description="Guides for every part of the workspace." />

      <label className="pa-table-search" style={{ maxWidth: 420, height: 44, marginBottom: 28 }}>
        <Search size={16} />
        <input placeholder="Search guides…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>

      <div className="pa-grid pa-grid--two" style={{ marginTop: 0, marginBottom: 28 }}>
        {filtered.map((g) => (
          <div key={g.category} className="pa-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ width: 32, height: 32, borderRadius: 9, display: 'grid', placeItems: 'center', background: 'rgba(40,95,255,.12)', color: 'var(--lp-blue-mid)' }}>
                <g.icon size={15} />
              </span>
              <p className="pa-h3" style={{ margin: 0, fontSize: '0.9375rem' }}>
                {g.category}
              </p>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
              {g.items.map((i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => push('This guide is being written. Check back soon.')}
                    style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-soft)', textDecoration: 'none' }}
                  >
                    {i}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pa-panel" style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <span style={{ width: 40, height: 40, borderRadius: 11, display: 'grid', placeItems: 'center', background: 'rgba(40,95,255,.12)', color: 'var(--lp-blue-mid)', flexShrink: 0 }}>
          <MessageCircle size={18} />
        </span>
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ fontWeight: 600, color: 'var(--lp-text)', margin: 0 }}>Still stuck?</p>
          <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)', margin: '2px 0 0' }}>Reach the team directly.</p>
        </div>
        <a href="mailto:support@prospectra.ai" className="pa-btn pa-btn--ghost">
          <Mail size={14} />
          support@prospectra.ai
        </a>
      </div>
    </>
  );
}
