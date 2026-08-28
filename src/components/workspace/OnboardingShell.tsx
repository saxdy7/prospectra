'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Clock } from 'lucide-react';
import { BRAND } from '../landing/brand';
import { Logomark } from '../landing/primitives';
import { OnboardingProgress } from './OnboardingProgress';
import type { StepMeta } from '@/lib/onboarding/config';
import '../landing/landing.css';
import './workspace.css';

export function OnboardingShell({
  steps,
  currentIndex,
  saved,
  onFinishLater,
  children,
  actions
}: {
  steps: StepMeta[];
  currentIndex: number;
  saved: boolean;
  /** Omitted on the finish screen, where there is nothing left to defer. */
  onFinishLater?: () => void;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="lp pa" data-theme="dark">
      <div className="pa-onboard">
        {/* Onboarding always renders dark — it has no theme toggle and was
            never asked to have one. A restrained blue bloom at the foot is
            its only ambient treatment. */}
        <span className="pa-onboard__bloom" aria-hidden="true" />

        <header className="pa-onboard__bar">
          <Link className="pa-brand" href="/">
            <Logomark size={28} />
            {BRAND.name}
            <span className="pa-brand__suffix">{BRAND.suffix}</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* Announced politely, so a screen reader hears it without being
                pulled out of the field the user is in. */}
            <span
              className="pa-onboard__saved"
              role="status"
              aria-live="polite"
              style={{ opacity: saved ? 1 : 0 }}
            >
              <Check size={13} strokeWidth={2.8} />
              Saved
            </span>

            {/* Only offered because progress genuinely persists locally —
                leaving and returning resumes on the same step. */}
            {onFinishLater && (
              <button type="button" className="pa-onboard__later" onClick={onFinishLater}>
                <Clock size={13} strokeWidth={2} />
                <span>Save and finish later</span>
              </button>
            )}
          </div>
        </header>

        <main className="pa-onboard__body">
          {currentIndex >= 0 && (
            <OnboardingProgress steps={steps} currentIndex={currentIndex} />
          )}
          {children}
        </main>

        {actions && (
          <div className="pa-actions">
            <div className="pa-actions__inner">{actions}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Back / Skip / Continue, shared by every step. */
export function StepActions({
  onBack,
  onSkip,
  onContinue,
  canContinue,
  showBack,
  continueLabel = 'Continue'
}: {
  onBack: () => void;
  /** Omitted where the answer is required to build the workspace. */
  onSkip?: () => void;
  onContinue: () => void;
  canContinue: boolean;
  /** False on step one, which has nothing to go back to. */
  showBack: boolean;
  continueLabel?: string;
}) {
  return (
    <>
      {showBack ? (
        <button type="button" className="pa-btn pa-btn--quiet" onClick={onBack}>
          <ArrowLeft size={15} strokeWidth={2.2} />
          Back
        </button>
      ) : (
        /* Holds the layout so Continue does not jump left on step one. */
        <span aria-hidden="true" />
      )}

      <div className="pa-actions__right">
        {onSkip && (
          <button type="button" className="pa-btn pa-btn--ghost" onClick={onSkip}>
            Skip for now
          </button>
        )}
        <button
          type="button"
          className="pa-btn"
          onClick={onContinue}
          disabled={!canContinue}
        >
          {continueLabel}
          <ArrowRight size={15} strokeWidth={2.2} />
        </button>
      </div>
    </>
  );
}
