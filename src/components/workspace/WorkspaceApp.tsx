'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Circle, Menu, Sparkles } from 'lucide-react';
import { AppSidebar, NAV } from './AppSidebar';
import { SetupChecklist } from './SetupChecklist';
import { GradientField } from '../landing/primitives';
import { IconFrame } from './IconIllustration';
import type { IconName } from '@/lib/icons/registry';
import { callingTasksFor, checklistFor, nextStepFor } from '@/lib/onboarding/plan';
import { workspaceStore } from '@/lib/onboarding/storage';
import { GOALS } from '@/lib/onboarding/config';
import type { WorkspaceState } from '@/lib/onboarding/types';
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
  {
    icon: 'action-find-leads',
    label: 'Find leads',
    hint: 'Search the map or a B2B database',
    section: 'find-leads'
  },
  {
    icon: 'action-import-data',
    label: 'Import data',
    hint: 'Bring a CSV you already keep',
    section: 'tables'
  },
  {
    icon: 'action-build-table',
    label: 'Build a table',
    hint: 'Start from an empty grid',
    section: 'tables'
  },
  {
    icon: 'action-enrich-contacts',
    label: 'Enrich contacts',
    hint: 'Fill the gaps across every row',
    section: 'tables'
  },
  {
    icon: 'action-campaign-draft',
    label: 'Create campaign draft',
    hint: 'Sketch an audience and a first message',
    section: 'campaigns'
  },
  {
    icon: 'action-voice-draft',
    label: 'Create voice-agent draft',
    hint: 'Write the role and opening line',
    section: 'voice'
  }
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

    workspaceStore.read().then((saved) => {
      if (cancelled) return;

      /* No completed setup means this person has not been through onboarding.
         Send them there rather than showing an empty workspace. */
      if (!saved || !saved.onboarding.completedAt) {
        router.replace('/onboarding');
        return;
      }

      setState(saved);
      setHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const persist = useCallback(async (next: WorkspaceState) => {
    setState(next);
    await workspaceStore.write(next);
  }, []);

  const items = useMemo(() => (state ? checklistFor(state.onboarding) : []), [state]);
  const callingTasks = useMemo(
    () => (state ? callingTasksFor(state.onboarding) : []),
    [state]
  );

  if (!hydrated || !state) {
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

  return (
    <div className="lp pa">
      <div className="pa-app">
        {/* The same ambient field as the rest of the product, held well back
            so it lights the shell without competing with the content. */}
        <GradientField style={{ opacity: 0.16 }} />

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
              <>
                <h2 className="pa-title">Welcome to {firstName}.</h2>
                <p className="pa-lede" style={{ marginTop: 12 }}>
                  {goal
                    ? `Set up to ${goal.label.toLowerCase()}. Here is the shortest path to something useful.`
                    : 'Here is the shortest path to something useful.'}
                </p>

                {/* ---------- Recommended next step ---------- */}
                <section
                  className="pa-panel pa-panel--next"
                  style={{ marginTop: 26 }}
                  aria-labelledby="next-heading"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <IconFrame name="next-step" size={38} />
                    <p className="pa-micro">Recommended next step</p>
                  </div>
                  <h3 className="pa-h3" id="next-heading" style={{ marginTop: 14 }}>
                    {recommended.cta}
                  </h3>
                  <p className="pa-lede" style={{ marginTop: 8 }}>
                    {recommended.why}
                  </p>
                  <button
                    type="button"
                    className="pa-btn"
                    style={{ marginTop: 18 }}
                    onClick={() => setSection(recommended.section)}
                  >
                    {recommended.cta}
                    <ArrowRight size={15} strokeWidth={2.2} />
                  </button>
                </section>

                <h3 className="pa-micro" style={{ marginTop: 34 }}>
                  Quick actions
                </h3>
                <div className="pa-quick">
                  {QUICK_ACTIONS.map((a) => (
                    <button
                      key={a.label}
                      type="button"
                      className="pa-quick__item"
                      onClick={() => setSection(a.section)}
                    >
                      <IconFrame name={a.icon} size={38} />
                      <span className="pa-quick__text">
                        <span className="pa-quick__label">{a.label}</span>
                        <span className="pa-quick__hint">{a.hint}</span>
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pa-grid pa-grid--two">
                  {!checklistDismissed && (
                    <SetupChecklist
                      items={items}
                      done={checklistDone}
                      onToggle={(id) =>
                        persist({
                          ...state,
                          checklistDone: { ...checklistDone, [id]: !checklistDone[id] }
                        })
                      }
                      onDismiss={() => persist({ ...state, checklistDismissed: true })}
                    />
                  )}

                  {/* ---------- Calling setup, only where asked for ---------- */}
                  {callingTasks.length > 0 && (
                    <section className="pa-panel" aria-labelledby="calling-heading">
                      <p className="pa-micro">Calling setup · in development</p>
                      <h3 className="pa-h3" id="calling-heading" style={{ marginTop: 10 }}>
                        Prepare your first calling workflow
                      </h3>
                      <p className="pa-lede" style={{ marginTop: 8 }}>
                        Telephony is not connected yet. What you can do now is get the
                        pieces ready, so the first call is a short step rather than a
                        project.
                      </p>

                      <ul className="pa-tasks">
                        {callingTasks.map((t) => (
                          <li key={t.id}>
                            <Circle size={7} strokeWidth={3} fill="currentColor" />
                            <span>
                              {t.label}
                              <span
                                style={{
                                  display: 'block',
                                  color: 'var(--lp-text-faint)',
                                  fontSize: 'var(--lp-t-caption)',
                                  marginTop: 2
                                }}
                              >
                                {t.hint}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>

                {checklistDismissed && (
                  <button
                    type="button"
                    className="pa-btn pa-btn--ghost"
                    style={{ marginTop: 20 }}
                    onClick={() => persist({ ...state, checklistDismissed: false })}
                  >
                    Show setup checklist
                  </button>
                )}
              </>
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
 * A section that is designed but not built. It says what the section will do
 * and what is missing, rather than presenting an empty version of a feature
 * that does not exist.
 */
function SectionPanel({ id }: { id: string }) {
  const nav = NAV.find((n) => n.id === id);
  const copy = SECTION_COPY[id];
  if (!nav || !copy) return null;

  return (
    <section className="pa-module">
      {/* The one large illustration this region is allowed. */}
      <IconFrame name={SECTION_ICON[id] ?? 'next-step'} size={64} tone="large" />

      <div>
        <span className="pa-tag">Coming soon</span>
        <h2 className="pa-title" style={{ fontSize: '1.625rem', marginTop: 12 }}>
          {nav.label}
        </h2>
        <p className="pa-lede" style={{ marginTop: 10 }}>
          {copy.blurb}
        </p>
        <p className="pa-micro" style={{ marginTop: 22 }}>
          What it will do
        </p>
        <ul className="pa-module__list">
          {copy.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
