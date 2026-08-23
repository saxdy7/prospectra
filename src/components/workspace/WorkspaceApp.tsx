'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Menu, PhoneCall, Sparkles } from 'lucide-react';
import { AppSidebar, NAV } from './AppSidebar';
import { SetupChecklist } from './SetupChecklist';
import { WorkspaceMark } from './OnboardingShell';
import { checklistFor, nextStepFor } from '@/lib/onboarding/plan';
import { workspaceStore } from '@/lib/onboarding/storage';
import { GOALS, wantsCalling } from '@/lib/onboarding/config';
import { emptyWorkspaceState, type WorkspaceState } from '@/lib/onboarding/types';
import './workspace.css';

/** What each planned module will do, taken from the platform specification. */
const MODULE_COPY: Record<string, { blurb: string; bullets: string[] }> = {
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
      'The reactive table is where a list becomes work: columns that compute, statuses per cell, and enrichment that reruns as rows arrive.',
    bullets: [
      'Column types for text, links, phone, email, numbers and AI prompts',
      'Waterfall enrichment that falls through providers until one answers',
      'An auto-run queue so new rows are processed without being asked'
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
      'Role and objective prompts with variables drawn from table columns',
      'Multilingual handling, including switching mid-conversation',
      'A browser test call before anything touches a phone line'
    ]
  },
  audiences: {
    blurb:
      'Audiences are saved slices of your tables, shaped for a specific campaign or agent.',
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
      'Manage credit balances and usage alerts'
    ]
  }
};

export function WorkspaceApp() {
  const router = useRouter();
  const params = useSearchParams();

  const [state, setState] = useState<WorkspaceState | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [section, setSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  /* Client-only read, so the server and first client render agree. */
  useEffect(() => {
    let cancelled = false;

    workspaceStore.read().then((saved) => {
      if (cancelled) return;

      /* No completed onboarding means this person has not been through setup.
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

  /* The finish screen deep-links straight to the section it recommended. */
  useEffect(() => {
    const start = params.get('start');
    if (start && NAV.some((n) => n.id === start)) setSection(start);
  }, [params]);

  const persist = useCallback(async (next: WorkspaceState) => {
    setState(next);
    await workspaceStore.write(next);
  }, []);

  const items = useMemo(
    () => (state ? checklistFor(state.onboarding) : []),
    [state]
  );

  if (!hydrated || !state) {
    /* Neutral shell while the client reads storage — same markup the server
       produced, so there is nothing for React to reconcile against. */
    return (
      <div className="pa">
        <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center' }}>
          <p className="pa-lede">Opening your workspace…</p>
        </div>
      </div>
    );
  }

  const { onboarding, checklistDone, checklistDismissed } = state;
  const recommended = nextStepFor(onboarding);
  const goal = GOALS.find((g) => g.id === onboarding.goal);
  const voiceMinded = wantsCalling(onboarding.calling.stance) || onboarding.goal === 'voice-agent';
  const activeNav = NAV.find((n) => n.id === section);

  return (
    <div className="pa">
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
              <span className="pa-tag pa-tag--demo">Demo workspace</span>
              <span className="pa-avatar" aria-hidden="true">
                {(onboarding.workspaceName.trim() || 'P').charAt(0).toUpperCase()}
              </span>
            </div>
          </header>

          <main className="pa-content">
            {section === 'home' ? (
              <>
                <h2 className="pa-title">
                  {onboarding.workspaceName.trim() || 'Your workspace'}
                </h2>
                <p className="pa-lede" style={{ marginTop: 8 }}>
                  {goal
                    ? `Set up to ${goal.label.toLowerCase()}. Here is the shortest path to something useful.`
                    : 'Here is the shortest path to something useful.'}
                </p>

                {/* ---------- Recommended next step ---------- */}
                <section
                  className="pa-panel pa-panel--next"
                  style={{ marginTop: 22 }}
                  aria-labelledby="next-heading"
                >
                  <p className="pa-micro">Recommended next step</p>
                  <h3 className="pa-h3" id="next-heading" style={{ marginTop: 8 }}>
                    {recommended.cta}
                  </h3>
                  <p className="pa-lede" style={{ fontSize: '0.875rem', marginTop: 6 }}>
                    {recommended.why}
                  </p>
                  <button
                    type="button"
                    className="pa-btn"
                    style={{ marginTop: 14 }}
                    onClick={() => setSection(recommended.section)}
                  >
                    {recommended.cta}
                    <ArrowRight size={15} strokeWidth={2.2} />
                  </button>
                </section>

                {/* ---------- Snapshot ---------- */}
                <div className="pa-grid pa-grid--stats">
                  <Stat value="0" label="Tables" />
                  <Stat value="0" label="Rows enriched" />
                  <Stat
                    value={String(onboarding.prepare.length)}
                    label="Enrichments queued"
                  />
                  <Stat value="500" label="Credits available" />
                </div>

                <div className="pa-grid pa-grid--two">
                  {!checklistDismissed && (
                    <SetupChecklist
                      items={items}
                      done={checklistDone}
                      onToggle={(id) =>
                        persist({
                          ...state,
                          checklistDone: {
                            ...checklistDone,
                            [id]: !checklistDone[id]
                          }
                        })
                      }
                      onDismiss={() => persist({ ...state, checklistDismissed: true })}
                    />
                  )}

                  {/* ---------- Voice, only for people who asked ---------- */}
                  {voiceMinded && (
                    <section
                      className="pa-panel pa-panel--voice"
                      aria-labelledby="voice-heading"
                    >
                      <p className="pa-micro" style={{ color: '#0b6f65' }}>
                        Calling · in development
                      </p>
                      <h3 className="pa-h3" id="voice-heading" style={{ marginTop: 8 }}>
                        Prepare your first calling workflow
                      </h3>
                      <p
                        className="pa-lede"
                        style={{ fontSize: '0.875rem', marginTop: 6 }}
                      >
                        Telephony is not connected yet. What you can do now is get the
                        pieces ready so the first call is a short step rather than a
                        project.
                      </p>

                      <ul className="pa-module__list">
                        <li>Draft the agent&rsquo;s role, objective and opening line</li>
                        <li>Decide which column holds the number to dial</li>
                        <li>Collect the documents an agent should answer from</li>
                        {onboarding.calling.language && (
                          <li>
                            Confirm handling for{' '}
                            {
                              {
                                english: 'English',
                                hindi: 'Hindi',
                                'hindi-english': 'Hindi and English',
                                other: 'your chosen languages'
                              }[onboarding.calling.language]
                            }
                          </li>
                        )}
                      </ul>

                      <button
                        type="button"
                        className="pa-btn pa-btn--teal"
                        style={{ marginTop: 14 }}
                        onClick={() => setSection('voice')}
                      >
                        <PhoneCall size={15} strokeWidth={2.1} />
                        Open the voice studio
                      </button>
                    </section>
                  )}
                </div>

                {checklistDismissed && (
                  <button
                    type="button"
                    className="pa-btn pa-btn--quiet"
                    style={{ marginTop: 16 }}
                    onClick={() => persist({ ...state, checklistDismissed: false })}
                  >
                    <Sparkles size={15} strokeWidth={2} />
                    Show setup checklist
                  </button>
                )}
              </>
            ) : (
              <ModulePanel id={section} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="pa-stat">
      <div className="pa-stat__value">{value}</div>
      <div className="pa-stat__label">{label}</div>
    </div>
  );
}

/**
 * A planned module. It says what the module will do and what is not built,
 * rather than presenting an empty version of a feature that does not exist.
 */
function ModulePanel({ id }: { id: string }) {
  const nav = NAV.find((n) => n.id === id);
  const copy = MODULE_COPY[id];
  if (!nav || !copy) return null;

  return (
    <section className="pa-module">
      <span className="pa-module__icon" aria-hidden="true">
        <nav.icon size={20} strokeWidth={1.9} />
      </span>

      <div>
        <span className={`pa-tag${nav.voice ? ' pa-tag--voice' : ''}`}>
          In development
        </span>
        <h2 className="pa-title" style={{ fontSize: '1.5rem', marginTop: 10 }}>
          {nav.label}
        </h2>
        <p className="pa-lede" style={{ marginTop: 8 }}>
          {copy.blurb}
        </p>
        <p className="pa-micro" style={{ marginTop: 18 }}>
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

export { WorkspaceMark };
