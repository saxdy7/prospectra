'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Check, Menu, Sparkles, X } from 'lucide-react';
import { AppSidebar, NAV } from './AppSidebar';
import { IconFrame } from './IconIllustration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import type { IconName } from '@/lib/icons/registry';
import {
  callingTasksFor,
  checklistFor,
  nextStepFor,
  recentActivityFor
} from '@/lib/onboarding/plan';
import { workspaceStore, readForOwner } from '@/lib/onboarding/storage';
import { currentUser } from '@/lib/onboarding/session';
import { GOALS } from '@/lib/onboarding/config';
import type { WorkspaceState } from '@/lib/onboarding/types';
import { TablesSection } from './tables/TablesSection';
import { SearchPanel } from './search/SearchPanel';
import { AudiencesSection, CampaignsSection, VoiceSection } from './modules/Modules';
import { dataStore, type WorkspaceData } from '@/lib/workspace/store';
import type { SearchJob } from '@/lib/types/models';
import '../landing/landing.css';
import './workspace.css';

/** What each section will do, drawn from the platform specification. */
const SECTION_COPY: Record<string, { blurb: string; bullets: string[] }> = {
  'find-leads': {
    blurb:
      'Sourcing brings rows in from the open web and from B2B databases, streaming them into a table as they are found.',
    bullets: [
      'Local businesses by category and place, with phone, rating and site',
      'Companies filtered by industry, headcount and technology',
      'People by role and seniority, with lookalike expansion'
    ]
  },
  tables: {
    blurb:
      'The reactive table is where a list becomes work: columns that compute, a status per cell, and enrichment that reruns as rows arrive.',
    bullets: [
      'Column types for text, links, phone, email, numbers and AI prompts',
      'Waterfall enrichment that falls through providers until one answers',
      'An auto-run queue, so new rows are processed without being asked'
    ]
  },
  campaigns: {
    blurb:
      'Campaigns turn an audience into a sequence — email first, with voice and messaging as those channels land.',
    bullets: [
      'Multi-step email with per-row personalisation',
      'Sending windows and rate limits that respect time zones',
      'Replies and outcomes written back to the source table'
    ]
  },
  voice: {
    blurb:
      'The voice studio is where an agent gets its role, objective, opening line and voice — drafted now, live once telephony is connected.',
    bullets: [
      'Role and objective prompts, with variables drawn from table columns',
      'Multilingual handling, including switching mid-conversation',
      'A browser test call, before anything touches a phone line'
    ]
  },
  audiences: {
    blurb:
      'Audiences are saved slices of your tables, shaped for one campaign or one agent.',
    bullets: [
      'Build a segment from any table view',
      'Map which column holds the number an agent should dial',
      'Reuse the same audience across channels'
    ]
  },
  analytics: {
    blurb:
      'Analytics covers what happened after you reached out — deliverability now, call outcomes once calling exists.',
    bullets: [
      'Volume, answer rates and outcome breakdowns',
      'Best-time-to-reach patterns by region',
      'Per-agent and per-number performance'
    ]
  },
  settings: {
    blurb: 'Workspace, team and billing settings.',
    bullets: [
      'Rename the workspace and change its image',
      'Invite teammates and set their access',
      'Manage balances and usage alerts'
    ]
  }
};

/** Quick actions on the workspace home. Each opens the relevant section. */
const QUICK_ACTIONS: {
  icon: IconName;
  label: string;
  hint: string;
  section: string;
}[] = [
  { icon: 'action-find-leads', label: 'Find leads', hint: 'Search the map or a database', section: 'find-leads' },
  { icon: 'action-import-data', label: 'Import data', hint: 'Bring a CSV you already keep', section: 'tables' },
  { icon: 'action-build-table', label: 'Build a table', hint: 'Start from an empty grid', section: 'tables' },
  { icon: 'action-enrich-contacts', label: 'Enrich contacts', hint: 'Fill the gaps across every row', section: 'tables' },
  { icon: 'action-campaign-draft', label: 'Create campaign draft', hint: 'Sketch an audience and a message', section: 'campaigns' },
  { icon: 'action-voice-draft', label: 'Create voice-agent draft', hint: 'Write the role and opening line', section: 'voice' }
];

/** One larger illustration per section empty state. */
const SECTION_ICON: Record<string, IconName> = {
  'find-leads': 'empty-find-leads',
  tables: 'empty-tables',
  campaigns: 'empty-campaigns',
  voice: 'empty-voice',
  audiences: 'empty-audiences',
  analytics: 'empty-analytics',
  settings: 'empty-settings'
};

export function WorkspaceApp() {
  const router = useRouter();
  const params = useSearchParams();

  const [state, setState] = useState<WorkspaceState | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState<WorkspaceData | null>(null);

  /* Read once as the initial value rather than syncing from an effect: this
     only seeds where the workspace opens, and an effect would both cascade a
     render and fight a user who navigated before it ran. */
  const [section, setSection] = useState(() => {
    const start = params.get('start');
    return start && NAV.some((n) => n.id === start) ? start : 'home';
  });

  /* Client-only read, so server and first client render agree. */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const user = await currentUser();
      if (cancelled) return;

      /* The workspace is a signed-in surface. Without a session there is no
         owner to scope the data to, so send them to sign in. */
      if (!user) {
        router.replace('/signin');
        return;
      }

      /* Load only this user's state. A blob owned by a different or deleted
         account is discarded by readForOwner, which then reads as "no
         completed setup" and routes to a fresh onboarding. */
      const saved = await readForOwner(user.id);
      if (cancelled) return;

      if (!saved || !saved.onboarding.completedAt) {
        router.replace('/onboarding');
        return;
      }

      setState(saved);
      setData(await dataStore.read());
      setHydrated(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const persist = useCallback(async (next: WorkspaceState) => {
    setState(next);
    await workspaceStore.write(next);
  }, []);

  const persistData = useCallback(async (next: WorkspaceData) => {
    setData(next);
    await dataStore.write(next);
  }, []);

  const items = useMemo(() => (state ? checklistFor(state.onboarding) : []), [state]);
  const callingTasks = useMemo(
    () => (state ? callingTasksFor(state.onboarding) : []),
    [state]
  );
  const activity = useMemo(
    () => (state ? recentActivityFor(state.onboarding) : []),
    [state]
  );

  if (!hydrated || !state || !data) {
    /* Neutral shell while storage is read — the same markup the server
       produced, so there is nothing to reconcile. */
    return (
      <div className="lp pa">
        <div style={{ minHeight: '100dvh' }} />
      </div>
    );
  }

  const { onboarding, checklistDone, checklistDismissed } = state;
  const recommended = nextStepFor(onboarding);
  const goal = GOALS.find((g) => g.id === onboarding.goal);
  const activeNav = NAV.find((n) => n.id === section);
  const firstName = onboarding.workspaceName.trim() || 'your workspace';
  const initial = firstName.charAt(0).toUpperCase();
  /* One workspace per user in this phase; the id is the owner until the
     Supabase workspace row is the source of truth. */
  const workspaceId = state.ownerId ?? 'local';

  const setupTotal = items.length;
  const setupDone = items.filter((i) => checklistDone[i.id]).length;
  const setupPct = setupTotal ? Math.round((setupDone / setupTotal) * 100) : 0;

  /* Honest first-run figures — a brand-new workspace genuinely has nothing run
     yet, so these read as zero rather than inventing activity. */
  const STATS: { icon: IconName; value: string; label: string; sub: string; badge?: string }[] =
    [
      { icon: 'action-build-table', value: '0', label: 'Tables', sub: 'None created yet' },
      { icon: 'action-enrich-contacts', value: '0', label: 'Rows enriched', sub: 'Nothing run yet' },
      {
        icon: 'prep-verify',
        value: String(onboarding.prepare.length),
        label: 'Enrichments queued',
        sub: 'Ready for your first table'
      },
      {
        icon: 'next-step',
        value: `${setupDone}/${setupTotal}`,
        label: 'Setup steps',
        sub: 'Complete',
        badge: 'Demo'
      }
    ];

  return (
    <div className="lp pa">
      <div className="pa-app">
        {menuOpen && (
          <button
            className="pa-scrim"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
        )}

        <AppSidebar
          active={section}
          onNavigate={setSection}
          onboarding={onboarding}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />

        <div className="pa-main">
          <header className="pa-top">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                className="pa-burger"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
              >
                <Menu size={18} />
              </button>
              <h1 className="pa-top__title">{activeNav?.label ?? 'Home'}</h1>
            </div>

            <div className="pa-top__right">
              <span className="pa-credits">
                <Sparkles size={13} strokeWidth={2} />
                <b>500</b> setup credits
              </span>
              <span className="pa-avatar" aria-hidden="true">
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
          </header>

          <main className="pa-content">
            {section === 'home' ? (
              <div className="flex flex-col gap-6">
                {/* ---------- Greeting ---------- */}
                <div>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                    Welcome to {firstName}.
                  </h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {goal
                      ? `Set up to ${goal.label.toLowerCase()}. Here is the shortest path to something useful.`
                      : 'Here is the shortest path to something useful.'}
                  </p>
                </div>

                {/* ---------- Hero banner: the recommended next step ---------- */}
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-brand-lift via-brand to-brand-deep text-white">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-white/15 blur-2xl"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-8 top-8 hidden text-white/25 sm:block"
                  >
                    <Sparkles className="size-24" strokeWidth={1} />
                  </span>
                  <CardContent className="relative flex flex-col gap-4 py-7">
                    <Badge className="w-fit border-white/25 bg-white/15 text-white">
                      Recommended next step
                    </Badge>
                    <div className="max-w-xl">
                      <h3 className="font-display text-2xl font-extrabold tracking-tight">
                        {recommended.cta}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/80">
                        {recommended.why}
                      </p>
                    </div>
                    <Button
                      className="w-fit rounded-full bg-white font-semibold text-brand shadow-sm hover:bg-white/90"
                      size="lg"
                      onClick={() => setSection(recommended.section)}
                    >
                      {recommended.cta}
                      <ArrowRight className="size-4" />
                    </Button>
                  </CardContent>
                </Card>

                {/* ---------- Stat row ---------- */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {STATS.map((s) => (
                    <Card key={s.label}>
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <IconFrame name={s.icon} size={40} />
                          {s.badge && <Badge variant="muted">{s.badge}</Badge>}
                        </div>
                        <div className="mt-3 font-display text-2xl font-extrabold tabular-nums">
                          {s.value}
                        </div>
                        <div className="text-sm font-medium">{s.label}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">{s.sub}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* ---------- Main + right rail ---------- */}
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Left */}
                  <div className="flex flex-col gap-6 lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Quick actions</CardTitle>
                        <span className="text-xs text-muted-foreground">Jump in</span>
                      </CardHeader>
                      <CardContent className="pt-3">
                        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                          {QUICK_ACTIONS.map((a) => (
                            <button
                              key={a.label}
                              type="button"
                              onClick={() => setSection(a.section)}
                              className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3 text-left transition hover:-translate-y-0.5 hover:border-brand/40 hover:bg-accent/40"
                            >
                              <IconFrame name={a.icon} size={42} />
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold leading-snug">
                                  {a.label}
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                  {a.hint}
                                </span>
                              </span>
                              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/40 transition group-hover:text-brand" />
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Setup checklist */}
                    {!checklistDismissed && (
                      <Card>
                        <CardHeader>
                          <div>
                            <CardTitle className="text-base">Finish setting up</CardTitle>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {setupDone === setupTotal
                                ? 'That is everything — nothing left on the list.'
                                : `${setupDone} of ${setupTotal} done`}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Hide the setup checklist"
                            onClick={() => persist({ ...state, checklistDismissed: true })}
                          >
                            <X className="size-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <ul className="flex flex-col">
                            {items.map((item) => {
                              const isDone = Boolean(checklistDone[item.id]);
                              return (
                                <li key={item.id}>
                                  <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2.5 transition hover:bg-accent/40">
                                    <input
                                      type="checkbox"
                                      className="peer sr-only"
                                      checked={isDone}
                                      onChange={() =>
                                        persist({
                                          ...state,
                                          checklistDone: {
                                            ...checklistDone,
                                            [item.id]: !isDone
                                          }
                                        })
                                      }
                                    />
                                    <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-md border border-input text-white transition peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                                      {isDone && <Check className="size-3" strokeWidth={3.4} />}
                                    </span>
                                    <span>
                                      <span
                                        className={
                                          'block text-sm font-medium ' +
                                          (isDone
                                            ? 'text-muted-foreground line-through'
                                            : '')
                                        }
                                      >
                                        {item.label}
                                      </span>
                                      <span className="block text-xs text-muted-foreground">
                                        {item.hint}
                                      </span>
                                    </span>
                                  </label>
                                </li>
                              );
                            })}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Right rail */}
                  <div className="flex flex-col gap-6">
                    {/* Workspace statistic */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Your workspace</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center pt-2 text-center">
                        <div
                          className="grid size-[76px] place-items-center rounded-full"
                          style={{
                            background: `conic-gradient(var(--brand) ${setupPct}%, var(--secondary) 0)`
                          }}
                        >
                          <Avatar className="size-16 ring-4 ring-card">
                            <AvatarFallback className="text-lg">{initial}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="mt-3 font-display font-bold">{firstName}</div>
                        <div className="text-xs text-muted-foreground">
                          {!onboarding.teamSize || onboarding.teamSize === 'solo'
                            ? 'Personal workspace'
                            : `Team · ${onboarding.teamSize}`}
                        </div>
                        <Progress value={setupPct} className="mt-4" />
                        <div className="mt-2 text-xs text-muted-foreground">
                          {setupDone} of {setupTotal} setup steps complete
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent activity — a chronological list, not a card grid.
                        Every entry is a real choice the user made; nothing is
                        invented to pad the feed. */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Recent activity</CardTitle>
                        <span className="text-xs text-muted-foreground">
                          {activity.length ? 'Setup' : 'Nothing yet'}
                        </span>
                      </CardHeader>
                      <CardContent className="pt-2">
                        {activity.length ? (
                          <ol className="relative flex flex-col gap-4 pl-5">
                            {/* The spine the markers sit on. */}
                            <span
                              aria-hidden="true"
                              className="absolute left-[5px] top-1.5 bottom-1.5 w-px bg-border"
                            />
                            {activity.map((a) => (
                              <li key={a.id} className="relative">
                                <span
                                  aria-hidden="true"
                                  className="absolute -left-5 top-1.5 size-[9px] rounded-full border-2 border-card bg-brand"
                                />
                                <div className="text-sm font-medium leading-snug">
                                  {a.label}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {a.detail}
                                </div>
                                {a.at && (
                                  <time
                                    dateTime={a.at}
                                    className="mt-0.5 block text-[11px] text-muted-foreground/70"
                                  >
                                    {formatWhen(a.at)}
                                  </time>
                                )}
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <div className="py-2">
                            <p className="text-sm text-muted-foreground">
                              Nothing has run yet. Your first search or import will
                              show up here.
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3"
                              onClick={() => setSection(recommended.section)}
                            >
                              {recommended.cta}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Calling setup — only where asked for */}
                    {callingTasks.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Calling setup</CardTitle>
                          <Badge variant="soft">In development</Badge>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <p className="text-sm text-muted-foreground">
                            Telephony is not connected yet — get the pieces ready so the
                            first call is a short step, not a project.
                          </p>
                          <ul className="mt-4 flex flex-col gap-3">
                            {callingTasks.map((t) => (
                              <li key={t.id} className="flex items-start gap-2.5">
                                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
                                <span>
                                  <span className="block text-sm">{t.label}</span>
                                  <span className="block text-xs text-muted-foreground">
                                    {t.hint}
                                  </span>
                                </span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {checklistDismissed && (
                      <Button
                        variant="outline"
                        onClick={() => persist({ ...state, checklistDismissed: false })}
                      >
                        Show setup checklist
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : section === 'tables' ? (
              <TablesSection
                workspaceId={workspaceId}
                tables={data.tables}
                rows={data.rows}
                onCreateTable={(t) =>
                  persistData({ ...data, tables: [...data.tables, t] })
                }
                onImport={(t, r) =>
                  persistData({
                    ...data,
                    tables: [...data.tables, t],
                    rows: { ...data.rows, [t.id]: r }
                  })
                }
              />
            ) : section === 'find-leads' ? (
              <SearchPanel
                workspaceId={workspaceId}
                jobs={data.searchJobs}
                onCreateJob={(j: SearchJob) =>
                  persistData({ ...data, searchJobs: [j, ...data.searchJobs] })
                }
              />
            ) : section === 'audiences' ? (
              <AudiencesSection workspaceId={workspaceId} data={data} onChange={persistData} />
            ) : section === 'campaigns' ? (
              <CampaignsSection workspaceId={workspaceId} data={data} onChange={persistData} />
            ) : section === 'voice' ? (
              <VoiceSection workspaceId={workspaceId} data={data} onChange={persistData} />
            ) : (
              <SectionPanel id={section} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/**
 * Relative timestamp for the activity feed.
 *
 * Only ever called after hydration — the component renders a neutral shell
 * until storage is read — so there is no server/client formatting mismatch to
 * reconcile.
 */
function formatWhen(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';

  const seconds = Math.round((then - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ['second', 60],
    ['minute', 60],
    ['hour', 24],
    ['day', 7],
    ['week', 4.35],
    ['month', 12]
  ];

  let value = seconds;
  for (const [unit, size] of steps) {
    if (Math.abs(value) < size) return rtf.format(Math.round(value), unit);
    value /= size;
  }
  return rtf.format(Math.round(value), 'year');
}

/**
 * A section that is designed but not built. It says what the section will do
 * and what is missing, rather than presenting an empty version of a feature
 * that does not exist.
 */
function SectionPanel({ id }: { id: string }) {
  const nav = NAV.find((n) => n.id === id);
  const copy = SECTION_COPY[id];
  if (!nav || !copy) return null;

  return (
    <Card className="max-w-2xl">
      <CardContent className="flex flex-col items-start gap-4 py-8">
        {/* The one large illustration this region is allowed. */}
        <IconFrame name={SECTION_ICON[id] ?? 'next-step'} size={64} tone="lg" />
        <Badge variant="soft">Coming soon</Badge>
        <h2 className="font-display text-2xl font-extrabold tracking-tight">{nav.label}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{copy.blurb}</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          What it will do
        </p>
        <ul className="flex flex-col gap-2">
          {copy.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
              {b}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
