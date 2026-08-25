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
import { DEMO_LOCAL_BUSINESSES } from '@/lib/mock-data/local-businesses';

export default function LocalBusinessesSearchPage() {
  const ctx = useWorkspace();
  const { push } = useToast();
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('10');
  const [minRating, setMinRating] = useState('');
  const [limit, setLimit] = useState('50');

  if (!ctx) return <PageSkeleton />;

  const { workspaceId, data, persistData } = ctx;
  const jobs = data.searchJobs.filter((j) => j.kind === 'local_business');
  const canSave = category.trim().length > 1 && location.trim().length > 1;

  const save = async () => {
    if (!canSave) return;
    const job = createSearchJob(workspaceId, 'local_business', {
      category: category.trim(),
      location: location.trim(),
      radiusKm: Number(radius) || 10,
      minRating: minRating ? Number(minRating) : undefined,
      limit: Number(limit) || 50
    });
    await persistData({ ...data, searchJobs: [job, ...data.searchJobs] });
    await logActivity(workspaceId, 'search', `Saved local-business search: ${category} in ${location}`);
    push('Search saved as draft', 'success');
    setCategory('');
    setLocation('');
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Find leads', href: '/app/find-leads' }, { label: 'Local businesses' }]}
        title="Local businesses"
        description="Search by category and place, like Google Maps — restaurants, clinics, studios, shops."
      />

      <div className="pa-grid--split" style={{ '--pa-rail': 'minmax(280px, 360px)', gap: 20 } as CSSProperties}>
        <div className="pa-panel" style={{ height: 'fit-content', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p className="pa-h3" style={{ marginBottom: 10 }}>
            New search
          </p>
          <TextField
            label="Category"
            placeholder="Dentists"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <TextField
            label="Location"
            placeholder="Manali, India"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <SelectField
              label="Radius"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              options={[
                { value: '5', label: '5 km' },
                { value: '10', label: '10 km' },
                { value: '25', label: '25 km' },
                { value: '50', label: '50 km' }
              ]}
            />
            <SelectField
              label="Min rating"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              options={[
                { value: '3.5', label: '3.5+' },
                { value: '4', label: '4.0+' },
                { value: '4.5', label: '4.5+' }
              ]}
              placeholder="Any"
            />
          </div>
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
            return `${f.category} · ${f.location} · up to ${f.limit} results`;
          }}
          demoTitle="What a result row looks like"
          demoPreview={
            <div className="pa-table-scroll">
              <table className="pa-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>City</th>
                    <th>Rating</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_LOCAL_BUSINESSES.slice(0, 6).map((b) => (
                    <tr key={b.name}>
                      <td style={{ color: 'var(--lp-text)', fontWeight: 500 }}>{b.name}</td>
                      <td>{b.category}</td>
                      <td>{b.city}</td>
                      <td>{b.rating}★ ({b.reviews})</td>
                      <td>{b.phone}</td>
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
