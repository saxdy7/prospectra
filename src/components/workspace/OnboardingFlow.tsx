'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Check, PartyPopper } from 'lucide-react';
import {
  CALLING_INTERESTS,
  CALLING_LANGUAGES,
  CALLING_STANCES,
  CALLING_USE_CASES,
  CRMS,
  GOALS,
  STEPS,
  TEAM_SIZES,
  dataSourcesFor,
  prepareOptionsFor,
  wantsCalling
} from '@/lib/onboarding/config';
import { nextStepFor, setupSummary, initialChecklistDone } from '@/lib/onboarding/plan';
import { workspaceStore } from '@/lib/onboarding/storage';
import {
  emptyWorkspaceState,
  type CallingInterest,
  type CallingLanguage,
  type CallingStance,
  type CallingUseCase,
  type CrmId,
  type DataSourceId,
  type GoalId,
  type OnboardingData,
  type PrepareId,
  type TeamSize
} from '@/lib/onboarding/types';
import { OnboardingShell, StepActions } from './OnboardingShell';
import { WorkspaceLogoUploader } from './WorkspaceLogoUploader';
import { Chip, ChoiceCard, Group, MultiSelectChoice, Reveal, Segmented } from './primitives';

/** -1 … 4 are the steps; DONE is the finish screen. */
const DONE = STEPS.length;

export function OnboardingFlow({ suggestedName }: { suggestedName?: string }) {
  const router = useRouter();

  const [data, setData] = useState<OnboardingData>(() => emptyWorkspaceState().onboarding);
  const [step, setStep] = useState(0);
  const [nameError, setNameError] = useState<string>();
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const savedTimer = useRef<number | undefined>(undefined);

  /* ---------------------------------------------------------------------
     Hydration. Reading localStorage during render would make the server and
     client markup disagree, so the first paint is always the empty state and
     any saved answers arrive in this effect.
     --------------------------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;

    workspaceStore.read().then((state) => {
      if (cancelled) return;

      /* Setup is already finished. Send them to the workspace instead of
         restarting the flow — and crucially, return *before* `hydrated` is
         set, because the persist effect below would otherwise write this
         component's empty initial state straight over the completed one. */
      if (state?.onboarding.completedAt) {
        router.replace('/app');
        return;
      }

      if (state) {
        setData(state.onboarding);
        setStep(Math.min(state.onboardingStep, STEPS.length - 1));
      } else if (suggestedName) {
        setData((d) => ({ ...d, workspaceName: defaultWorkspaceName(suggestedName) }));
      }

      setHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, [suggestedName, router]);

  /* Persist on every change once hydrated, then flash the saved indicator.
     The flag is set inside the promise callback rather than in the effect
     body — both because "saved" should mean the write actually finished, and
     because a synchronous setState here would cascade an extra render on
     every keystroke. */
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;

    workspaceStore
      .read()
      .then((existing) => {
        const base = existing ?? emptyWorkspaceState();
        return workspaceStore.write({ ...base, onboarding: data, onboardingStep: step });
      })
      .then(() => {
        if (cancelled) return;
        setSaved(true);
        window.clearTimeout(savedTimer.current);
        savedTimer.current = window.setTimeout(() => setSaved(false), 1800);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(savedTimer.current);
    };
  }, [data, step, hydrated]);

  /* Move focus to the new step heading so keyboard and screen-reader users
     land in the right place instead of at the top of the document. */
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const patch = useCallback((next: Partial<OnboardingData>) => {
    setData((d) => ({ ...d, ...next }));
  }, []);

  const goals = GOALS;
  const sources = useMemo(() => dataSourcesFor(data.goal), [data.goal]);
  const prepares = useMemo(() => prepareOptionsFor(data.goal), [data.goal]);

  /* --- Validation per step ---------------------------------------------- */
  const canContinue = (() => {
    switch (step) {
      case 0:
        return data.workspaceName.trim().length >= 2;
      case 1:
        return Boolean(data.goal);
      case 2:
        return Boolean(data.dataSource);
      default:
        return true;
    }
  })();

  const back = () => setStep((s) => Math.max(0, s - 1));

  /**
   * Leaving mid-flow is safe: every answer is already written on change, and
   * the hydration effect above resumes from whatever was saved. This is only
   * offered because that is genuinely true, not as a courtesy label.
   */
  const finishLater = () => router.push('/');

  const advance = () => setStep((s) => Math.min(DONE, s + 1));

  const next = () => {
    if (step === 0 && !canContinue) {
      setNameError('Give your workspace a name of at least 2 characters.');
      return;
    }
    setNameError(undefined);
    advance();
  };

  /** Skip clears whatever the step collects, so a skip never leaves a stale answer. */
  const skip = () => {
    if (step === 3) patch({ prepare: [] });
    if (step === 4) patch({ calling: { interests: [] } });
    advance();
  };

  const finish = async () => {
    const completed: OnboardingData = { ...data, completedAt: new Date().toISOString() };
    const existing = (await workspaceStore.read()) ?? emptyWorkspaceState();

    await workspaceStore.write({
      ...existing,
      onboarding: completed,
      /* Seed the checklist with what setup genuinely achieved. */
      checklistDone: { ...initialChecklistDone(completed), ...existing.checklistDone }
    });

    setData(completed);
    setStep(DONE);
  };

  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  /* Nothing is rendered until storage has been read. Two reasons: a saved
     answer should not appear as a flash of the empty form, and a completed
     workspace redirects from the effect above without showing step 1 first. */
  if (!hydrated) {
    return (
      <div className="pa">
        <div style={{ minHeight: '100dvh' }} />
      </div>
    );
  }

  /* --- Finish ------------------------------------------------------------ */
  if (step === DONE) {
    const summary = setupSummary(data);
    const recommended = nextStepFor(data);

    return (
      <OnboardingShell steps={STEPS} currentIndex={-1} saved={saved}>
        <div className="pa-finish">
          <span className="pa-finish__mark" aria-hidden="true">
            <PartyPopper size={26} strokeWidth={1.8} />
          </span>

          <h1 className="pa-title" tabIndex={-1} ref={headingRef}>
            Your {data.workspaceName.trim() || 'new'} workspace is ready.
          </h1>
          <p className="pa-lede" style={{ marginTop: 10, marginInline: 'auto' }}>
            {recommended.why}
          </p>

          <ul className="pa-finish__list">
            {summary.map((line) => (
              <li key={line} className="pa-finish__item">
                <Check size={15} strokeWidth={2.8} aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>

          <div className="pa-finish__cta">
            <button
              type="button"
              className="pa-btn"
              onClick={() => router.push(`/app?start=${recommended.section}`)}
            >
              {recommended.cta}
              <ArrowRight size={15} strokeWidth={2.2} />
            </button>
            <button
              type="button"
              className="pa-btn pa-btn--ghost"
              onClick={() => router.push('/app?panel=checklist')}
            >
              View setup checklist
            </button>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  /* --- Steps ------------------------------------------------------------- */
  return (
    <OnboardingShell
      steps={STEPS}
      currentIndex={step}
      saved={saved}
      onFinishLater={finishLater}
      actions={
        <StepActions
          onBack={back}
          onSkip={STEPS[step].required ? undefined : skip}
          onContinue={step === STEPS.length - 1 ? finish : next}
          canContinue={canContinue}
          showBack={step > 0}
          continueLabel={step === STEPS.length - 1 ? 'Finish setup' : 'Continue'}
        />
      }
    >
      {/* ===================== Step 1 — workspace ===================== */}
      {step === 0 && (
        <section className="pa-step">
          <header className="pa-step__head">
            <h1 className="pa-title" tabIndex={-1} ref={headingRef}>
              Make this workspace yours.
            </h1>
            <p className="pa-lede">
              Your tables, enrichments, campaigns and future voice agents will live
              here.
            </p>
          </header>

          <div className="pa-field">
            <label className="pa-label" htmlFor="ws-name">
              Workspace name
            </label>
            <input
              id="ws-name"
              className="pa-input"
              value={data.workspaceName}
              onChange={(e) => {
                patch({ workspaceName: e.target.value });
                if (nameError) setNameError(undefined);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && canContinue) next();
              }}
              placeholder="Acme Growth"
              autoComplete="organization"
              aria-invalid={nameError ? true : undefined}
              aria-describedby={nameError ? 'ws-name-error' : undefined}
            />
            {nameError && (
              <span className="pa-error" id="ws-name-error" role="alert">
                <AlertCircle size={13} strokeWidth={2.2} />
                {nameError}
              </span>
            )}
          </div>

          <div className="pa-field">
            <span className="pa-label">
              Workspace image <span className="pa-label__optional">· optional</span>
            </span>
            <WorkspaceLogoUploader
              value={data.workspaceLogo}
              onChange={(v) => patch({ workspaceLogo: v })}
            />
          </div>

          <div className="pa-field">
            <span className="pa-label">
              How many people will use it?{' '}
              <span className="pa-label__optional">· optional</span>
            </span>
            <Segmented<TeamSize>
              name="team-size"
              options={TEAM_SIZES}
              value={data.teamSize}
              onChange={(v) => patch({ teamSize: v })}
            />
          </div>
        </section>
      )}

      {/* ===================== Step 2 — goal ===================== */}
      {step === 1 && (
        <section className="pa-step">
          <header className="pa-step__head">
            <h1 className="pa-title" tabIndex={-1} ref={headingRef}>
              What do you want Prospectra to help you do first?
            </h1>
            <p className="pa-lede">
              Pick the one closest to your first job. It shapes the rest of setup and
              what your workspace opens on — you can change direction whenever.
            </p>
          </header>

          <fieldset className="pa-choices pa-choices--two">
            <legend className="pa-sr">Primary goal</legend>
            {goals.map((g) => (
              <ChoiceCard<GoalId>
                key={g.id}
                name="goal"
                value={g.id}
                checked={data.goal === g.id}
                onSelect={(v) => patch({ goal: v, dataSource: undefined, prepare: [] })}
                label={g.label}
                blurb={g.blurb}
                icon={g.icon}
              />
            ))}
          </fieldset>
        </section>
      )}

      {/* ===================== Step 3 — data ===================== */}
      {step === 2 && (
        <section className="pa-step">
          <header className="pa-step__head">
            <h1 className="pa-title" tabIndex={-1} ref={headingRef}>
              Where should we start?
            </h1>
            <p className="pa-lede">
              Where your first rows come from. Nothing runs yet — this only decides
              what your workspace sets up for you.
            </p>
          </header>

          <fieldset className="pa-choices">
            <legend className="pa-sr">First data source</legend>
            {sources.map((s) => (
              <ChoiceCard<DataSourceId>
                key={s.id}
                name="source"
                value={s.id}
                checked={data.dataSource === s.id}
                onSelect={(v) => patch({ dataSource: v })}
                label={s.label}
                blurb={s.blurb}
                icon={s.icon}
              />
            ))}
          </fieldset>

          <Reveal open={data.dataSource === 'connect-crm'}>
            <Group legend="Which systems do you use?" className="pa-chips">
              {CRMS.map((c) => (
                <Chip<CrmId>
                  key={c.id}
                  type="checkbox"
                  value={c.id}
                  checked={data.crmIntent.includes(c.id)}
                  onChange={(v) => patch({ crmIntent: toggle(data.crmIntent, v) })}
                  label={c.label}
                />
              ))}
            </Group>
            <p className="pa-logo__hint" style={{ marginTop: 10 }}>
              We’ll help you connect this later. Nothing is authorised and no data
              moves — this only records what you use.
            </p>
          </Reveal>
        </section>
      )}

      {/* ===================== Step 4 — prepare ===================== */}
      {step === 3 && (
        <section className="pa-step">
          <header className="pa-step__head">
            <h1 className="pa-title" tabIndex={-1} ref={headingRef}>
              What should we prepare for you?
            </h1>
            <p className="pa-lede">
              Pick what is worth having on day one. Nothing runs until you say so,
              and the labels below are a rough sense of effort, not a bill.
            </p>
          </header>

          <fieldset className="pa-choices">
            <legend className="pa-sr">Enrichment to prepare</legend>
            {prepares.map((p) => (
              <MultiSelectChoice<PrepareId>
                key={p.id}
                value={p.id}
                checked={data.prepare.includes(p.id)}
                onToggle={(v) => patch({ prepare: toggle(data.prepare, v) })}
                label={p.label}
                blurb={p.blurb}
                icon={p.icon}
                estimate={p.estimate}
              />
            ))}
          </fieldset>
        </section>
      )}

      {/* ===================== Step 5 — calling ===================== */}
      {step === 4 && (
        <section className="pa-step">
          <header className="pa-step__head">
            <h1 className="pa-title" tabIndex={-1} ref={headingRef}>
              Will calling be part of your workflow?
            </h1>
            <p className="pa-lede">
              You can configure agents, numbers, consent controls and call settings
              later. Answering now just shapes your workspace for it.
            </p>
          </header>

          <fieldset className="pa-choices">
            <legend className="pa-sr">Calling plans</legend>
            {CALLING_STANCES.map((s) => (
              <ChoiceCard<CallingStance>
                key={s.id}
                name="stance"
                value={s.id}
                checked={data.calling.stance === s.id}
                onSelect={(v) =>
                  patch({
                    calling:
                      v === 'not-now'
                        ? { stance: v, interests: [] }
                        : { ...data.calling, stance: v }
                  })
                }
                label={s.label}
                blurb={s.blurb}
                icon={s.icon}
              />
            ))}
          </fieldset>

          <Reveal open={wantsCalling(data.calling.stance)}>
            <Group legend="What would the calls be for?" className="pa-chips">
              {CALLING_USE_CASES.map((u) => (
                <Chip<CallingUseCase>
                  key={u.id}
                  type="radio"
                  name="use-case"
                  value={u.id}
                  checked={data.calling.useCase === u.id}
                  onChange={(v) => patch({ calling: { ...data.calling, useCase: v } })}
                  label={u.label}
                />
              ))}
            </Group>

            <Group legend="Which languages?" className="pa-chips">
              {CALLING_LANGUAGES.map((l) => (
                <Chip<CallingLanguage>
                  key={l.id}
                  type="radio"
                  name="language"
                  value={l.id}
                  checked={data.calling.language === l.id}
                  onChange={(v) => patch({ calling: { ...data.calling, language: v } })}
                  label={l.label}
                />
              ))}
            </Group>

            <Group legend="What matters most to you?" className="pa-chips">
              {CALLING_INTERESTS.map((c) => (
                <Chip<CallingInterest>
                  key={c.id}
                  type="checkbox"
                  value={c.id}
                  checked={data.calling.interests.includes(c.id)}
                  onChange={(v) =>
                    patch({
                      calling: {
                        ...data.calling,
                        interests: toggle(data.calling.interests, v)
                      }
                    })
                  }
                  label={c.label}
                />
              ))}
            </Group>
          </Reveal>
        </section>
      )}
    </OnboardingShell>
  );
}

/**
 * "Priya Raghavan" → "Priya's workspace". Falls back to the raw string when
 * it does not look like a name.
 */
function defaultWorkspaceName(raw: string): string {
  const first = raw.trim().split(/\s+/)[0];
  if (!first) return '';
  const suffix = first.endsWith('s') ? "'" : "'s";
  return `${first}${suffix} workspace`;
}
