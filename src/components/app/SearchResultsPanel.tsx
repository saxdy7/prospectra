'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Plug } from 'lucide-react';
import { DemoTag, JobStatusPill } from './Tags';
import { EmptyState } from './EmptyState';
import type { SearchJob } from '@/lib/types/models';
import type { IconName } from '@/lib/icons/registry';

/**
 * The right-hand half of every find-leads sub-page: the provider gate, the
 * list of saved searches for this kind, and a clearly labelled demo results
 * preview so the page shows what a real result would look like without
 * pretending a provider ran it.
 */
export function SearchResultsPanel({
  jobs,
  emptyIcon,
  filterSummary,
  demoTitle,
  demoPreview
}: {
  jobs: SearchJob[];
  emptyIcon: IconName;
  filterSummary: (job: SearchJob) => string;
  demoTitle: string;
  demoPreview: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        className="pa-panel"
        style={{
          display: 'flex',
          gap: 12,
          borderColor: 'rgba(245,181,68,.25)',
          background: 'linear-gradient(150deg, rgba(245,181,68,.1) 0%, var(--lp-glass) 60%)'
        }}
      >
        <Plug size={17} style={{ flexShrink: 0, marginTop: 2, color: '#f5b544' }} />
        <div>
          <p style={{ fontSize: 'var(--lp-t-sm)', fontWeight: 600, color: 'var(--lp-text)', margin: 0 }}>
            No data provider connected
          </p>
          <p style={{ marginTop: 4, fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)', lineHeight: 1.55 }}>
            Searches save as drafts and stay that way. Prospectra does not scrape sites directly
            — running a search needs an approved data provider, and none is configured yet. Your
            saved filters run unchanged the moment one is. Connect one from{' '}
            <Link href="/app/integrations" style={{ color: 'var(--lp-blue-mid)' }}>
              Integrations
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="pa-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <p className="pa-h3">Saved searches</p>
          <span style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)' }}>
            {jobs.length ? `${jobs.length} saved` : 'None yet'}
          </span>
        </div>

        {jobs.length === 0 ? (
          <EmptyState
            icon={emptyIcon}
            title="No searches yet"
            description="Describe who you are looking for on the left. It saves here, ready to run."
          />
        ) : (
          <ul style={{ display: 'flex', flexDirection: 'column' }}>
            {jobs.map((j) => (
              <li
                key={j.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '12px 0',
                  borderTop: '1px solid var(--lp-line)'
                }}
              >
                <span style={{ minWidth: 0, fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-soft)' }}>
                  {filterSummary(j)}
                </span>
                <JobStatusPill status={j.status} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pa-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <p className="pa-h3" style={{ margin: 0 }}>
            {demoTitle}
          </p>
          <DemoTag kind="demo" />
        </div>
        {demoPreview}
      </div>
    </div>
  );
}
