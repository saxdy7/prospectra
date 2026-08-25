'use client';

import { useRef, useState } from 'react';
import { AlertTriangle, Check, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconFrame } from '../IconIllustration';
import { SectionHead } from './Modules';
import { LOGO_RULES, TEAM_SIZES } from '@/lib/onboarding/config';
import type { OnboardingData, TeamSize, WorkspaceState } from '@/lib/onboarding/types';
import type { WorkspaceData } from '@/lib/workspace/store';

/* =============================================================================
   Analytics
   -----------------------------------------------------------------------------
   Two kinds of number live here, and the distinction is the whole point:

     · Workspace counts are real — they are what you have actually built.
     · Outcome metrics (opens, replies, answered calls) do not exist, because
       nothing has been sent or dialled. They are shown as an explicit empty
       state rather than as zeroes, which would imply a campaign ran and
       performed badly.
   ============================================================================= */

export function AnalyticsSection({ data }: { data: WorkspaceData }) {
  const rowTotal = Object.values(data.rows).reduce((n, r) => n + r.length, 0);
  const versionTotal = data.agents.reduce((n, a) => n + a.versions.length, 0);

  const counts = [
    { label: 'Tables', value: data.tables.length, sub: 'created' },
    { label: 'Rows', value: rowTotal, sub: 'across all tables' },
    { label: 'Audiences', value: data.audiences.length, sub: 'saved' },
    { label: 'Campaign drafts', value: data.campaigns.length, sub: 'written' },
    { label: 'Voice agents', value: data.agents.length, sub: 'drafted' },
    { label: 'Agent versions', value: versionTotal, sub: 'saved' }
  ];

  return (
    <div className="flex flex-col gap-5">
      <SectionHead
        title="Analytics"
        sub="What exists in the workspace, and what has actually happened."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workspace</CardTitle>
          <span className="text-xs text-muted-foreground">Live counts</span>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="grid gap-4 sm:grid-cols-3">
            {counts.map((c) => (
              <div key={c.label}>
                <div className="font-display text-2xl font-extrabold tabular-nums">
                  {c.value}
                </div>
                <div className="text-sm font-medium">{c.label}</div>
                <div className="text-xs text-muted-foreground">{c.sub}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Outreach performance</CardTitle>
          <Badge variant="muted">No data</Badge>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <IconFrame name="empty-analytics" size={60} tone="lg" />
            <p className="mt-1 font-display text-base font-bold">Nothing has been sent yet</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Delivery, open, reply and call-outcome figures appear here once a
              campaign actually runs. Showing zeroes now would suggest something
              ran and performed badly — nothing has run at all.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* =============================================================================
   Settings — real, editable, persisted.
   ============================================================================= */

export function SettingsSection({
  state,
  onChange,
  onResetData
}: {
  state: WorkspaceState;
  onChange: (next: WorkspaceState) => void;
  onResetData: () => void;
}) {
  const o = state.onboarding;
  const fileRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);
  const [logoError, setLogoError] = useState<string>();
  const [confirmReset, setConfirmReset] = useState(false);

  const patch = (next: Partial<OnboardingData>) => {
    onChange({ ...state, onboarding: { ...o, ...next } });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  const pickLogo = (file: File | undefined) => {
    if (!file) return;
    setLogoError(undefined);

    if (!LOGO_RULES.accept.includes(file.type as (typeof LOGO_RULES.accept)[number])) {
      setLogoError('Use PNG, JPG, SVG or WebP.');
      return;
    }
    if (file.size > LOGO_RULES.maxBytes) {
      setLogoError(`That image is ${Math.round(file.size / 1024)} KB. Keep it under 512 KB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () =>
      patch({ workspaceLogo: typeof reader.result === 'string' ? reader.result : null });
    reader.onerror = () => setLogoError('That file could not be read.');
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionHead
        title="Settings"
        sub="Workspace details. Changes save as you make them."
        action={
          saved ? (
            <span
              className="inline-flex items-center gap-1.5 text-xs text-brand"
              role="status"
              aria-live="polite"
            >
              <Check className="size-3.5" strokeWidth={3} />
              Saved
            </span>
          ) : undefined
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workspace</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 pt-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold">Name</span>
            <input
              value={o.workspaceName}
              onChange={(e) => patch({ workspaceName: e.target.value })}
              className="h-9 max-w-sm rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
            />
            {o.workspaceName.trim().length < 2 && (
              <span className="text-xs text-destructive" role="alert">
                Give the workspace a name of at least 2 characters.
              </span>
            )}
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold">Image</span>
            <div className="flex items-center gap-3">
              <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-accent text-brand">
                {o.workspaceLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={o.workspaceLogo} alt="" className="size-full object-cover" />
                ) : (
                  <span className="font-display text-lg font-bold">
                    {(o.workspaceName.trim() || 'P').charAt(0).toUpperCase()}
                  </span>
                )}
              </span>
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                    <Upload className="size-3.5" />
                    {o.workspaceLogo ? 'Replace' : 'Upload'}
                  </Button>
                  {o.workspaceLogo && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        patch({ workspaceLogo: null });
                        if (fileRef.current) fileRef.current.value = '';
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{LOGO_RULES.label}</span>
                {logoError && (
                  <span className="text-xs text-destructive" role="alert">
                    {logoError}
                  </span>
                )}
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept={LOGO_RULES.accept.join(',')}
              className="hidden"
              onChange={(e) => pickLogo(e.target.files?.[0])}
            />
          </div>

          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-xs font-semibold">Team size</legend>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {TEAM_SIZES.map((t) => (
                <label
                  key={t.id}
                  className="cursor-pointer rounded-full border border-input px-3.5 py-1.5 text-xs transition has-[:checked]:border-brand has-[:checked]:bg-accent has-[:checked]:font-semibold has-[:checked]:text-brand-ink"
                >
                  <input
                    type="radio"
                    name="team-size-settings"
                    className="sr-only"
                    checked={o.teamSize === t.id}
                    onChange={() => patch({ teamSize: t.id as TeamSize })}
                  />
                  {t.label}
                </label>
              ))}
            </div>
          </fieldset>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team</CardTitle>
          <Badge variant="muted">Soon</Badge>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-sm text-muted-foreground">
            Inviting teammates and setting their access needs the members table
            and role policies, which are written but not yet applied to the
            database. Until then a workspace has exactly one member: you.
          </p>
        </CardContent>
      </Card>

      {/* Destructive, and treated as such: named object, explicit confirm,
          and the dangerous action is not the default focus. */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Reset workspace data</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-sm text-muted-foreground">
            Deletes every table, row, audience, campaign draft and voice agent in
            this browser. Your account and workspace settings are untouched. This
            cannot be undone.
          </p>

          {!confirmReset ? (
            <Button
              variant="outline"
              className="mt-4 border-destructive/40 text-destructive hover:bg-destructive/5"
              onClick={() => setConfirmReset(true)}
            >
              <Trash2 className="size-4" />
              Reset data
            </Button>
          ) : (
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <AlertTriangle className="size-4 shrink-0 text-destructive" />
              <span className="flex-1 text-sm">
                Delete everything in <strong>{o.workspaceName.trim() || 'this workspace'}</strong>?
              </span>
              <Button variant="outline" size="sm" autoFocus onClick={() => setConfirmReset(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={() => {
                  onResetData();
                  setConfirmReset(false);
                }}
              >
                Delete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
