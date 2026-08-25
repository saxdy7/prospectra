'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Copy } from 'lucide-react';
import { PageHeader, useToast } from '@/components/app';
import { TextField, SelectField } from '@/components/app/FormControls';
import { SearchResultsPanel } from '@/components/app/SearchResultsPanel';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { createSearchJob } from '@/lib/workspace/store';
import { logActivity } from '@/lib/demo-storage/store';
import { DEMO_COMPANIES } from '@/lib/mock-data/companies';

const CRITERIA = [
  { value: 'industry', label: 'Same industry' },
  { value: 'size', label: 'Similar employee count' },
  { value: 'location', label: 'Similar location' },
  { value: 'tech', label: 'Similar technology' }
];

export default function LookalikesSearchPage() {
  const ctx = useWorkspace();
  const { push } = useToast();
  const [seed, setSeed] = useState('');
  const [criteria, setCriteria] = useState('industry');
  const [limit, setLimit] = useState('50');

  if (!ctx) return <PageSkeleton />;

  const { workspaceId, data, persistData } = ctx;
  const jobs = data.searchJobs.filter((j) => j.kind === 'lookalike');
  const canSave = seed.trim().length > 1;

  const save = async () => {
    if (!canSave) return;
    const job = createSearchJob(workspaceId, 'lookalike', {
      seedCompany: seed.trim(),
      criteria,
      limit: Number(limit) || 50
    });
    await persistData({ ...data, searchJobs: [job, ...data.searchJobs] });
    await logActivity(workspaceId, 'search', `Saved lookalike search from ${seed}`);
    push('Search saved as draft', 'success');
    setSeed('');
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Find leads', href: '/app/find-leads' }, { label: 'Lookalikes' }]}
        title="Lookalikes"
        description="Start from a company you already like, and find more that share its shape."
      />

      <div className="pa-grid--split" style={{ '--pa-rail': 'minmax(280px, 360px)', gap: 20 } as CSSProperties}>
        <div className="pa-panel" style={{ height: 'fit-content', display: 'flex', flexDirection: 'column' }}>
          <p className="pa-h3" style={{ marginBottom: 10 }}>
            New search
          </p>
          <TextField
            label="Seed company"
            placeholder="HyperScale Cloud"
            hint="A domain or company name to base the match on."
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
          />
          <SelectField label="Match on" value={criteria} onChange={(e) => setCriteria(e.target.value)} options={CRITERIA} />
          <SelectField
            label="Result limit"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            options={['10', '50', '100'].map((n) => ({ value: n, label: n }))}
          />
          <button className="pa-btn" style={{ marginTop: 10 }} onClick={save} disabled={!canSave}>
            <Copy size={15} />
            Save search
          </button>
        </div>

        <SearchResultsPanel
          jobs={jobs}
          emptyIcon="empty-find-leads"
          filterSummary={(j) => {
            const f = j.filters as Record<string, unknown>;
            return `Like "${f.seedCompany}" · matched on ${f.criteria}`;
          }}
          demoTitle="What a result row looks like"
          demoPreview={
            <div className="pa-table-scroll">
              <table className="pa-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Industry</th>
                    <th>Employees</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_COMPANIES.slice(6, 12).map((c) => (
                    <tr key={c.id}>
                      <td style={{ color: 'var(--lp-text)', fontWeight: 500 }}>{c.name}</td>
                      <td>{c.industry}</td>
                      <td>{c.headcount}</td>
                      <td>{c.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        />
      </div>
    </>
  );
}
