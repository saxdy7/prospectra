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
import { DEMO_JOBS } from '@/lib/mock-data/jobs';

const REMOTE = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' }
];
const SENIORITIES = [
  { value: 'entry', label: 'Entry' },
  { value: 'mid', label: 'Mid' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'exec', label: 'Executive' }
];
const POSTED = [
  { value: '24h', label: 'Past 24 hours' },
  { value: '7d', label: 'Past week' },
  { value: '30d', label: 'Past month' }
];

export default function JobSearchPage() {
  const ctx = useWorkspace();
  const { push } = useToast();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [remote, setRemote] = useState('');
  const [skills, setSkills] = useState('');
  const [seniority, setSeniority] = useState('');
  const [posted, setPosted] = useState('7d');

  if (!ctx) return <PageSkeleton />;

  const { workspaceId, data, persistData } = ctx;
  const jobs = data.searchJobs.filter((j) => j.kind === 'job');
  const canSave = title.trim().length > 1;

  const save = async () => {
    if (!canSave) return;
    const job = createSearchJob(workspaceId, 'job', {
      title: title.trim(),
      location: location.trim() || undefined,
      remote: remote || undefined,
      skills: skills.trim() || undefined,
      seniority: seniority || undefined,
      datePosted: posted
    });
    await persistData({ ...data, searchJobs: [job, ...data.searchJobs] });
    await logActivity(workspaceId, 'search', `Saved job search: ${title}`);
    push('Search saved as draft', 'success');
    setTitle('');
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Find leads', href: '/app/find-leads' }, { label: 'Jobs' }]}
        title="Jobs"
        description="Find open roles and hiring signals — a lead for recruiting outreach or a listing for the job hunter."
      />

      <div className="pa-grid--split" style={{ '--pa-rail': 'minmax(280px, 360px)', gap: 20 } as CSSProperties}>
        <div className="pa-panel" style={{ height: 'fit-content', display: 'flex', flexDirection: 'column' }}>
          <p className="pa-h3" style={{ marginBottom: 10 }}>
            New search
          </p>
          <TextField label="Job title" placeholder="Backend Engineer" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField label="Location" optional placeholder="Bengaluru, India" value={location} onChange={(e) => setLocation(e.target.value)} />
          <SelectField
            label="Remote preference"
            optional
            value={remote}
            onChange={(e) => setRemote(e.target.value)}
            placeholder="Any"
            options={REMOTE}
          />
          <TextField label="Skills" optional placeholder="Go, Kubernetes" value={skills} onChange={(e) => setSkills(e.target.value)} />
          <SelectField
            label="Seniority"
            optional
            value={seniority}
            onChange={(e) => setSeniority(e.target.value)}
            placeholder="Any"
            options={SENIORITIES}
          />
          <SelectField label="Date posted" value={posted} onChange={(e) => setPosted(e.target.value)} options={POSTED} />
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
            return `${f.title}${f.location ? ` · ${f.location}` : ''}`;
          }}
          demoTitle="What a result row looks like"
          demoPreview={
            <div className="pa-table-scroll">
              <table className="pa-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Remote</th>
                    <th>Posted</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_JOBS.slice(0, 6).map((j) => (
                    <tr key={j.id}>
                      <td style={{ color: 'var(--lp-text)', fontWeight: 500 }}>{j.title}</td>
                      <td>{j.company}</td>
                      <td>{j.location}</td>
                      <td>{j.remote}</td>
                      <td>{new Date(j.postedAt).toLocaleDateString()}</td>
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
