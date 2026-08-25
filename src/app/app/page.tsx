'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Check, Sparkles, X } from 'lucide-react';
import { IconFrame } from '@/components/workspace/IconIllustration';
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
  recentActivityFor,
  sectionRoute
} from '@/lib/onboarding/plan';
import { GOALS } from '@/lib/onboarding/config';
import { useWorkspace } from '@/components/app/useWorkspace';
import { PageSkeleton } from '@/components/app/Skeleton';

/** Quick actions on the workspace home. Each routes to the relevant page. */
const QUICK_ACTIONS: { icon: IconName; label: string; hint: string; href: string }[] = [
  { icon: 'action-find-leads', label: 'Find leads', hint: 'Search the map or a database', href: '/app/find-leads' },
  { icon: 'action-import-data', label: 'Import data', hint: 'Bring a CSV you already keep', href: '/app/imports/new' },
  { icon: 'action-build-table', label: 'Build a table', hint: 'Start from an empty grid', href: '/app/tables' },
  { icon: 'action-enrich-contacts', label: 'Enrich contacts', hint: 'Fill the gaps across every row', href: '/app/tables' },
  { icon: 'action-campaign-draft', label: 'Create campaign draft', hint: 'Sketch an audience and a message', href: '/app/campaigns/new' },
  { icon: 'action-voice-draft', label: 'Create voice-agent draft', hint: 'Write the role and opening line', href: '/app/voice-agents/new' }
];

/** Relative timestamp for the activity feed. */
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

export default function AppHomePage() {
  const router = useRouter();
  const ctx = useWorkspace();

  if (!ctx) return <PageSkeleton />;

  const { state, data, persist } = ctx;
  const { onboarding, checklistDone, checklistDismissed } = state;

  const items = checklistFor(onboarding);
  const callingTasks = callingTasksFor(onboarding);
  const activity = recentActivityFor(onboarding);
  const recommended = nextStepFor(onboarding);
  const goal = GOALS.find((g) => g.id === onboarding.goal);
  const firstName = onboarding.workspaceName.trim() || 'your workspace';
  const initial = firstName.charAt(0).toUpperCase();

  const setupTotal = items.length;
  const setupDone = items.filter((i) => checklistDone[i.id]).length;
  const setupPct = setupTotal ? Math.round((setupDone / setupTotal) * 100) : 0;

  /* Honest first-run figures — a brand-new workspace genuinely has nothing run
     yet, so these read as zero rather than inventing activity. */
  const STATS: { icon: IconName; value: string; label: string; sub: string; badge?: string }[] = [
    { icon: 'action-build-table', value: String(data.tables.length), label: 'Tables', sub: data.tables.length ? 'In your workspace' : 'None created yet' },
    { icon: 'action-enrich-contacts', value: '0', label: 'Rows enriched', sub: 'Nothing run yet' },
    { icon: 'prep-verify', value: String(onboarding.prepare.length), label: 'Enrichments queued', sub: 'Ready for your first table' },
    { icon: 'next-step', value: `${setupDone}/${setupTotal}`, label: 'Setup steps', sub: 'Complete', badge: 'Demo' }
  ];

  return (
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
          <Badge className="w-fit border-white/25 bg-white/15 text-white">Recommended next step</Badge>
          <div className="max-w-xl">
            <h3 className="font-display text-2xl font-extrabold tracking-tight">{recommended.cta}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{recommended.why}</p>
          </div>
          <Button
            className="w-fit rounded-full bg-white font-semibold text-brand shadow-sm hover:bg-white/90"
            size="lg"
            onClick={() => router.push(sectionRoute(recommended.section))}
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
              <div className="mt-3 font-display text-2xl font-extrabold tabular-nums">{s.value}</div>
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
                    onClick={() => router.push(a.href)}
                    className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3 text-left transition hover:-translate-y-0.5 hover:border-brand/40 hover:bg-accent/40"
                  >
                    <IconFrame name={a.icon} size={42} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold leading-snug">{a.label}</span>
                      <span className="block text-xs text-muted-foreground">{a.hint}</span>
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
                                checklistDone: { ...checklistDone, [item.id]: !isDone }
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
                                (isDone ? 'text-muted-foreground line-through' : '')
                              }
                            >
                              {item.label}
                            </span>
                            <span className="block text-xs text-muted-foreground">{item.hint}</span>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your workspace</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-2 text-center">
              <div
                className="grid size-[76px] place-items-center rounded-full"
                style={{ background: `conic-gradient(var(--brand) ${setupPct}%, var(--secondary) 0)` }}
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

          {/* Recent activity — a chronological list, not a card grid. Every
              entry is a real choice the user made; nothing is invented. */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent activity</CardTitle>
              <span className="text-xs text-muted-foreground">{activity.length ? 'Setup' : 'Nothing yet'}</span>
            </CardHeader>
            <CardContent className="pt-2">
              {activity.length ? (
                <ol className="relative flex flex-col gap-4 pl-5">
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
                      <div className="text-sm font-medium leading-snug">{a.label}</div>
                      <div className="text-xs text-muted-foreground">{a.detail}</div>
                      {a.at && (
                        <time dateTime={a.at} className="mt-0.5 block text-[11px] text-muted-foreground/70">
                          {formatWhen(a.at)}
                        </time>
                      )}
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="py-2">
                  <p className="text-sm text-muted-foreground">
                    Nothing has run yet. Your first search or import will show up here.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => router.push(sectionRoute(recommended.section))}
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
                  Telephony is not connected yet — get the pieces ready so the first call is a
                  short step, not a project.
                </p>
                <ul className="mt-4 flex flex-col gap-3">
                  {callingTasks.map((t) => (
                    <li key={t.id} className="flex items-start gap-2.5">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
                      <span>
                        <span className="block text-sm">{t.label}</span>
                        <span className="block text-xs text-muted-foreground">{t.hint}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {checklistDismissed && (
            <Button variant="outline" onClick={() => persist({ ...state, checklistDismissed: false })}>
              Show setup checklist
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
