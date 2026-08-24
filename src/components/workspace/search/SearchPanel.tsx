'use client';

import { useState } from 'react';
import { Info, Plug, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconFrame } from '../IconIllustration';
import { JOB_LABEL, JOB_TONE, createSearchJob } from '@/lib/workspace/store';
import type { SearchJob, SearchKind } from '@/lib/types/models';

/**
 * Lead-sourcing UI.
 *
 * Builds a real `SearchJob` from real filters and persists it as a draft. It
 * does **not** run: no search provider is configured, and inventing results
 * would make the whole table untrustworthy. The provider gate is stated
 * plainly instead, so what is missing is obvious rather than hidden behind a
 * spinner that never resolves.
 *
 * TODO(provider): when a SearchProvider is configured, `submit` moves the job
 * draft → queued and a worker advances it. No UI change is needed — the job
 * states below already cover the full lifecycle.
 */

const KINDS: { id: SearchKind; label: string; hint: string }[] = [
  { id: 'local_business', label: 'Local businesses', hint: 'By category and place' },
  { id: 'company', label: 'Companies', hint: 'By industry, size, tech' },
  { id: 'people', label: 'People', hint: 'By role and seniority' },
  { id: 'job', label: 'Job openings', hint: 'By title and location' }
];

/** Whether any search provider is wired up. Hardcoded false — none is. */
const PROVIDER_CONFIGURED = false;

export function SearchPanel({
  workspaceId,
  jobs,
  onCreateJob
}: {
  workspaceId: string;
  jobs: SearchJob[];
  onCreateJob: (job: SearchJob) => void;
}) {
  const [kind, setKind] = useState<SearchKind>('local_business');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [minRating, setMinRating] = useState('');
  const [limit, setLimit] = useState('50');

  const canSave = category.trim().length > 1 && location.trim().length > 1;

  const save = () => {
    if (!canSave) return;
    onCreateJob(
      createSearchJob(workspaceId, kind, {
        category: category.trim(),
        location: location.trim(),
        minRating: minRating ? Number(minRating) : undefined,
        limit: Number(limit) || 50
      })
    );
    setCategory('');
    setLocation('');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(280px,340px)_1fr]">
      {/* ---------------- Filters ---------------- */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-base">New search</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-2">
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1.5 text-xs font-semibold">What are you looking for?</legend>
            {KINDS.map((k) => (
              <label
                key={k.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/70 p-2.5 transition has-[:checked]:border-brand has-[:checked]:bg-accent/50 hover:bg-accent/30"
              >
                <input
                  type="radio"
                  name="search-kind"
                  value={k.id}
                  checked={kind === k.id}
                  onChange={() => setKind(k.id)}
                  className="size-3.5 accent-[var(--brand)]"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{k.label}</span>
                  <span className="block text-xs text-muted-foreground">{k.hint}</span>
                </span>
              </label>
            ))}
          </fieldset>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold">
              {kind === 'local_business' ? 'Category' : kind === 'people' ? 'Role' : 'Keyword'}
            </span>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={kind === 'local_business' ? 'Dentists' : 'Head of Growth'}
              className="h-9 rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold">Location</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Manali, India"
              className="h-9 rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            {kind === 'local_business' && (
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold">Min rating</span>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="h-9 rounded-lg border border-input bg-card px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
                >
                  <option value="">Any</option>
                  <option value="3.5">3.5+</option>
                  <option value="4">4.0+</option>
                  <option value="4.5">4.5+</option>
                </select>
              </label>
            )}
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold">Max results</span>
              <select
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="h-9 rounded-lg border border-input bg-card px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
              >
                {['10', '50', '100', '500'].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <Button variant="brand" onClick={save} disabled={!canSave}>
            <Search className="size-4" />
            Save search
          </Button>
          {!canSave && (
            <p className="text-xs text-muted-foreground">
              Enter what to look for and where.
            </p>
          )}
        </CardContent>
      </Card>

      {/* ---------------- Results / jobs ---------------- */}
      <div className="flex flex-col gap-4">
        {!PROVIDER_CONFIGURED && (
          <Card className="border-amber-200 bg-amber-50/60">
            <CardContent className="flex gap-3 py-4">
              <Plug className="mt-0.5 size-4 shrink-0 text-amber-700" />
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  No search provider connected
                </p>
                <p className="mt-1 text-sm text-amber-800/80">
                  Searches save as drafts and stay that way. Prospectra does not
                  scrape sites directly — running a search needs an approved data
                  provider, and none is configured yet. Your saved filters run
                  unchanged the moment one is.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Saved searches</CardTitle>
            <span className="text-xs text-muted-foreground">
              {jobs.length ? `${jobs.length} saved` : 'None yet'}
            </span>
          </CardHeader>
          <CardContent className="pt-2">
            {jobs.length === 0 ? (
              <div className="py-10 text-center">
                <IconFrame name="empty-find-leads" size={56} tone="lg" />
                <p className="mt-4 text-sm font-semibold">No searches yet</p>
                <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
                  Describe who you are looking for on the left. It saves here,
                  ready to run.
                </p>
              </div>
            ) : (
              <ul className="flex flex-col divide-y divide-border/60">
                {jobs.map((j) => {
                  const f = j.filters as Record<string, unknown>;
                  return (
                    <li key={j.id} className="flex items-center gap-3 py-3 first:pt-0">
                      <IconFrame
                        name={
                          j.kind === 'local_business'
                            ? 'source-local-search'
                            : j.kind === 'company'
                              ? 'source-company-search'
                              : 'source-people-search'
                        }
                        size={38}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {String(f.category ?? 'Untitled')} · {String(f.location ?? '')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {KINDS.find((k) => k.id === j.kind)?.label}
                          {f.minRating ? ` · ${f.minRating}+ rating` : ''}
                          {f.limit ? ` · up to ${f.limit}` : ''}
                        </p>
                      </div>
                      <Badge variant={JOB_TONE[j.status]}>{JOB_LABEL[j.status]}</Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          Every row a search produces keeps its source and provider request id,
          so where a record came from is always answerable.
        </p>
      </div>
    </div>
  );
}
