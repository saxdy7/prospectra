'use client';

import type { StepMeta } from '@/lib/onboarding/config';

/**
 * "Step 2 of 5" plus a thin electric-blue line.
 *
 * The fill reflects steps *completed*, not the step you are standing on, so
 * arriving at step one reads as empty rather than as already part-done.
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
          Step <b>{currentIndex + 1}</b> of {total}
          {current && (
            <>
              {' · '}
              {current.label}
              {!current.required && (
                <span className="pa-progress__optional"> · optional</span>
              )}
            </>
          )}
        </span>
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
    </div>
  );
}
