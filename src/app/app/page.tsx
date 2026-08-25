'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Bot, Check, Mail, MessageCircle, Search, X } from 'lucide-react';
import { IconFrame } from '@/components/workspace/IconIllustration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { LucideIcon } from 'lucide-react';
import type { IconName } from '@/lib/icons/registry';
import {
  callingTasksFor,
  checklistFor,
  nextStepFor,
  recentActivityFor,
  sectionRoute
} from '@/lib/onboarding/plan';
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

/** First topic from each Help category (src/app/app/help/page.tsx) — real
    guide titles, not placeholders invented for this card. */
const GUIDE_LINKS: { icon: LucideIcon; label: string }[] = [
  { icon: Search, label: 'Building your first local-business search' },
  { icon: Bot, label: 'Writing an effective agent prompt' },
  { icon: MessageCircle, label: 'Building an audience from a table' }
];

/** Client-only — this page never server-renders real content (it's gated
    behind useWorkspace()), so there's no hydration mismatch to worry about. */
function timeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

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
  const firstName = onboarding.workspaceName.trim() || 'your workspace';

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
      {/* ---------- Workspace snapshot strip ---------- */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card px-6 py-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-56 opacity-[0.35] sm:block"
          style={{
            backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
            backgroundSize: '11px 11px',
            maskImage: 'linear-gradient(to left, black, transparent)'
          }}
        />
        <div className="relative flex flex-wrap items-center gap-x-9 gap-y-3">
          <span className="text-xs font-medium text-muted-foreground">Workspace snapshot</span>
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {s.label}
                {s.badge && <Badge variant="muted">{s.badge}</Badge>}
              </div>
              <div className="font-display text-lg font-bold tabular-nums">{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Centered greeting ---------- */}
      <div className="flex flex-col items-center gap-2 py-2 text-center">
        <p className="text-sm text-muted-foreground">
          {timeGreeting()}, {firstName}.
        </p>
        <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{recommended.cta}</h2>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{recommended.why}</p>
        <Button className="mt-2 w-fit rounded-full" size="lg" onClick={() => router.push(sectionRoute(recommended.section))}>
          {recommended.cta}
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {/* ---------- Three-card row ---------- */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Getting started checklist */}
        {!checklistDismissed ? (
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-base">Getting started</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {setupDone === setupTotal ? 'Everything done' : `${setupDone} of ${setupTotal}`}
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
              <Progress value={setupPct} className="mb-3" />
              <ul className="flex flex-col">
                {items.map((item) => {
                  const isDone = Boolean(checklistDone[item.id]);
                  return (
                    <li key={item.id}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 text-left transition hover:bg-accent/40">
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
                        <span className={'text-sm font-medium ' + (isDone ? 'text-muted-foreground line-through' : '')}>
                          {item.label}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-4">
                {[Search, Mail, Bot, MessageCircle].map((Icon, i) => (
                  <span
                    key={i}
                    className="grid size-8 place-items-center rounded-lg border border-border/70 bg-secondary text-muted-foreground"
                  >
                    <Icon className="size-4" strokeWidth={1.8} />
                  </span>
                ))}
                <span className="text-xs text-muted-foreground">Sourcing, email, voice, WhatsApp</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex items-center justify-center">
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
              <p className="text-sm text-muted-foreground">Setup checklist hidden.</p>
              <Button variant="outline" size="sm" onClick={() => persist({ ...state, checklistDismissed: false })}>
                Show it again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Getting-started guide — real guide topics from the Help page, not
            a stand-in for a demo video that doesn't exist. */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base">Getting started guide</CardTitle>
            <span className="text-xs text-muted-foreground">From Help</span>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col pt-2">
            <ul className="flex flex-1 flex-col gap-1">
              {GUIDE_LINKS.map((g) => (
                <li key={g.label}>
                  <button
                    type="button"
                    onClick={() => router.push('/app/help')}
                    className="group flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition hover:bg-accent/40"
                  >
                    <g.icon className="size-4 shrink-0 text-brand" strokeWidth={1.8} />
                    <span className="text-sm text-foreground">{g.label}</span>
                    <ArrowUpRight className="ml-auto size-3.5 shrink-0 text-muted-foreground/40 transition group-hover:text-brand" />
                  </button>
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" className="mt-3 w-fit" onClick={() => router.push('/app/help')}>
              Browse all guides
            </Button>
          </CardContent>
        </Card>

        {/* Plan upsell — real tiers from the landing pricing table, not
            invented features. Nothing here is billed; it links out to the
            same pricing section every other "Upgrade" entry point uses. */}
        <Card className="overflow-hidden border-0 py-0">
          <div className="bg-gradient-to-br from-brand-lift via-brand to-brand-deep px-5 py-4 text-white">
            <span className="text-xs font-medium text-white/75">Current plan</span>
            <div className="mt-0.5 font-display text-lg font-bold">Starter plan</div>
          </div>
          <CardContent className="pb-5 pt-4">
            <ul className="flex flex-col gap-2">
              {[
                'Up to 3 workspaces',
                '5,000 enrichment credits / month',
                '3 voice agents, multilingual calling'
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-brand" strokeWidth={3} />
                  {f}
                </li>
              ))}
            </ul>
            <Button className="mt-4 w-full" onClick={() => router.push('/app/settings?tab=plan')}>
              Upgrade to Growth
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ---------- Quick actions ---------- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick actions</CardTitle>
          <span className="text-xs text-muted-foreground">Jump in</span>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* ---------- Recent activity + calling setup ---------- */}
      <div className="grid gap-4 lg:grid-cols-2">
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
                <span aria-hidden="true" className="absolute left-[5px] top-1.5 bottom-1.5 w-px bg-border" />
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
                <Button variant="outline" size="sm" className="mt-3" onClick={() => router.push(sectionRoute(recommended.section))}>
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
                Telephony is not connected yet — get the pieces ready so the first call is a short
                step, not a project.
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
      </div>
    </div>
  );
}
