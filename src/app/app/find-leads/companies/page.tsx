'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Search } from 'lucide-react';
import { PageHeader, useToast } from '@/components/app';
import { TextField, SelectField } from '@/components/app/FormControls';
import { SearchResultsPanel } from '@/components/app/SearchResultsPanel';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { createSearchJob } from '@/lib/workspace/store';
import { logActivity } from '@/lib/demo-storage/store';
import { DEMO_COMPANIES } from '@/lib/mock-data/companies';

const SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
const TYPES = ['Private', 'Public', 'Non-profit', 'Government'];

export default function CompanySearchPage() {
  const ctx = useWorkspace();
  const { push } = useToast();
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [location, setLocation] = useState('');
  const [keywords, setKeywords] = useState('');
  const [type, setType] = useState('');
  const [technology, setTechnology] = useState('');
  const [limit, setLimit] = useState('50');

  if (!ctx) return <PageSkeleton />;

  const { workspaceId, data, persistData } = ctx;
  const jobs = data.searchJobs.filter((j) => j.kind === 'company');
  const canSave = industry.trim().length > 1;

  const save = async () => {
    if (!canSave) return;
    const job = createSearchJob(workspaceId, 'company', {
      industry: industry.trim(),
      size: size || undefined,
      location: location.trim() || undefined,
      keywords: keywords.trim() || undefined,
      type: type || undefined,
      technology: technology.trim() || undefined,
      limit: Number(limit) || 50
    });
    await persistData({ ...data, searchJobs: [job, ...data.searchJobs] });
    await logActivity(workspaceId, 'search', `Saved company search: ${industry}`);
    push('Search saved as draft', 'success');
    setIndustry('');
    setKeywords('');
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Find leads', href: '/app/find-leads' }, { label: 'Companies' }]}
        title="Companies"
        description="Build a company list by industry, size, location, keywords and technology."
      />

      <div className="pa-grid--split" style={{ '--pa-rail': 'minmax(280px, 360px)', gap: 20 } as CSSProperties}>
        <div className="pa-panel" style={{ height: 'fit-content', display: 'flex', flexDirection: 'column' }}>
          <p className="pa-h3" style={{ marginBottom: 10 }}>
            New search
          </p>
          <TextField label="Industry" placeholder="Fintech" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          <SelectField
            label="Company size"
            optional
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Any size"
            options={SIZES.map((s) => ({ value: s, label: `${s} employees` }))}
          />
          <TextField label="Location" optional placeholder="Bengaluru, India" value={location} onChange={(e) => setLocation(e.target.value)} />
          <TextField label="Keywords" optional placeholder="B2B, SaaS, payments" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
          <SelectField
            label="Company type"
            optional
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Any"
            options={TYPES.map((t) => ({ value: t, label: t }))}
          />
          <TextField label="Technology used" optional placeholder="Salesforce, React" value={technology} onChange={(e) => setTechnology(e.target.value)} />
          <SelectField
            label="Result limit"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            options={['10', '50', '100', '500'].map((n) => ({ value: n, label: n }))}
          />
          <button className="pa-btn" style={{ marginTop: 10 }} onClick={save} disabled={!canSave}>
            <Search size={15} />
            Save search
          </button>
        </div>

        <SearchResultsPanel
          jobs={jobs}
          emptyIcon="empty-find-leads"
          filterSummary={(j) => {
            const f = j.filters as Record<string, unknown>;
            return `${f.industry}${f.location ? ` · ${f.location}` : ''}${f.size ? ` · ${f.size}` : ''}`;
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
                    <th>Domain</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_COMPANIES.slice(0, 6).map((c) => (
                    <tr key={c.id}>
                      <td style={{ color: 'var(--lp-text)', fontWeight: 500 }}>{c.name}</td>
                      <td>{c.industry}</td>
                      <td>{c.headcount}</td>
                      <td>{c.location}</td>
                      <td>{c.domain}</td>
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
