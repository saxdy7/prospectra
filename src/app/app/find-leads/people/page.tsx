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
import { DEMO_CONTACTS } from '@/lib/mock-data/contacts';

const SENIORITIES = [
  { value: 'ic', label: 'Individual contributor' },
  { value: 'manager', label: 'Manager' },
  { value: 'director', label: 'Director' },
  { value: 'vp', label: 'VP' },
  { value: 'c_suite', label: 'C-suite' }
];

export default function PeopleSearchPage() {
  const ctx = useWorkspace();
  const { push } = useToast();
  const [role, setRole] = useState('');
  const [seniority, setSeniority] = useState('');
  const [department, setDepartment] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [limit, setLimit] = useState('50');

  if (!ctx) return <PageSkeleton />;

  const { workspaceId, data, persistData } = ctx;
  const jobs = data.searchJobs.filter((j) => j.kind === 'people');
  const canSave = role.trim().length > 1;

  const save = async () => {
    if (!canSave) return;
    const job = createSearchJob(workspaceId, 'people', {
      role: role.trim(),
      seniority: seniority || undefined,
      department: department.trim() || undefined,
      company: company.trim() || undefined,
      location: location.trim() || undefined,
      limit: Number(limit) || 50
    });
    await persistData({ ...data, searchJobs: [job, ...data.searchJobs] });
    await logActivity(workspaceId, 'search', `Saved people search: ${role}`);
    push('Search saved as draft', 'success');
    setRole('');
    setCompany('');
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Find leads', href: '/app/find-leads' }, { label: 'People' }]}
        title="People"
        description="Filter by role, seniority, department, and company or location."
      />

      <div className="pa-grid--split" style={{ '--pa-rail': 'minmax(280px, 360px)', gap: 20 } as CSSProperties}>
        <div className="pa-panel" style={{ height: 'fit-content', display: 'flex', flexDirection: 'column' }}>
          <p className="pa-h3" style={{ marginBottom: 10 }}>
            New search
          </p>
          <TextField label="Role / title" placeholder="Head of Growth" value={role} onChange={(e) => setRole(e.target.value)} />
          <SelectField
            label="Seniority"
            optional
            value={seniority}
            onChange={(e) => setSeniority(e.target.value)}
            placeholder="Any"
            options={SENIORITIES}
          />
          <TextField label="Department" optional placeholder="Marketing" value={department} onChange={(e) => setDepartment(e.target.value)} />
          <TextField label="Company" optional placeholder="HyperScale Cloud" value={company} onChange={(e) => setCompany(e.target.value)} />
          <TextField label="Location" optional placeholder="San Francisco, US" value={location} onChange={(e) => setLocation(e.target.value)} />
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
            return `${f.role}${f.company ? ` at ${f.company}` : ''}${f.location ? ` · ${f.location}` : ''}`;
          }}
          demoTitle="What a result row looks like"
          demoPreview={
            <div className="pa-table-scroll">
              <table className="pa-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_CONTACTS.slice(0, 6).map((c) => (
                    <tr key={c.id}>
                      <td style={{ color: 'var(--lp-text)', fontWeight: 500 }}>{c.fullName}</td>
                      <td>{c.title}</td>
                      <td>{c.companyName}</td>
                      <td>{c.location}</td>
                      <td>{c.email}</td>
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
