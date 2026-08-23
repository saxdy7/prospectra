'use client';

import type { StepMeta } from '@/lib/onboarding/config';

/**
 * Progress for the onboarding flow.
 *
 * The percentage reflects steps *completed*, not the step you are standing on,
 * so arriving at step 1 reads as 0% rather than as already part-done.
 */
export function OnboardingProgress({
  steps,
  currentIndex
}: {
  steps: StepMeta[];
  currentIndex: number;
}) {
  const total = steps.length;
  const pct = Math.round((currentIndex / total) * 100);
  const current = steps[currentIndex];

  return (
    <div className="pa-progress">
      <div className="pa-progress__meta">
        <span className="pa-progress__step">
          Step {currentIndex + 1} of {total}
          {current ? ` · ${current.label}` : ''}
          {current && !current.required && (
            <span style={{ color: 'var(--pa-ink-faint)', fontWeight: 400 }}>
              {' '}
              · optional
            </span>
          )}
        </span>
        <span className="pa-progress__pct">{pct}%</span>
      </div>

      <div
        className="pa-progress__track"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Setup progress"
      >
        <div className="pa-progress__fill" style={{ width: `${pct}%` }} />
      </div>

      <ol className="pa-progress__dots">
        {steps.map((s, i) => {
          const state = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'todo';
          return (
            <li
              key={s.id}
              className="pa-progress__dot"
              data-state={state}
              aria-current={state === 'current' ? 'step' : undefined}
            >
              <span aria-hidden="true" />
              {s.label}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
