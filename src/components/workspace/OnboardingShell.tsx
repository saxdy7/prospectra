'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { BRAND } from '../landing/brand';
import { OnboardingProgress } from './OnboardingProgress';
import type { StepMeta } from '@/lib/onboarding/config';
import './workspace.css';

/** The brand mark, redrawn for the light surface. Same glyph as the site. */
export function WorkspaceMark({ size = 28 }: { size?: number }) {
  return (
    <span className="pa-brand__mark" style={{ width: size, height: size }}>
      <svg
        width={size * 0.54}
        height={size * 0.54}
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 13.5C6.5 13.5 8 11 10 7.5C12 4 13.5 1.5 17 1.5"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="4" cy="16.5" r="2" fill="white" />
      </svg>
    </span>
  );
}

export function OnboardingShell({
  steps,
  currentIndex,
  saved,
  children,
  /** Omitted on the finish screen, which has its own actions. */
  actions
}: {
  steps: StepMeta[];
  currentIndex: number;
  saved: boolean;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="pa">
      <div className="pa-onboard">
        <div className="pa-onboard__bar">
          <Link className="pa-brand" href="/">
            <WorkspaceMark />
            {BRAND.name}
            <span className="pa-brand__suffix">{BRAND.suffix}</span>
          </Link>

          {/* Announced politely so a screen reader hears it without losing
              the user's place in the form. */}
          <span
            className="pa-onboard__saved"
            role="status"
            aria-live="polite"
            style={{ opacity: saved ? 1 : 0 }}
          >
            <Check size={13} strokeWidth={2.6} />
            Progress saved
          </span>
        </div>

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

/** The standard Back / Skip / Continue trio at the foot of every step. */
export function StepActions({
  onBack,
  onSkip,
  onContinue,
  canContinue,
  busy = false,
  continueLabel = 'Continue',
  backDisabled = false
}: {
  onBack: () => void;
  /** Omitted on steps whose answer is required to build the workspace. */
  onSkip?: () => void;
  onContinue: () => void;
  canContinue: boolean;
  busy?: boolean;
  continueLabel?: string;
  backDisabled?: boolean;
}) {
  return (
    <>
      <button
        type="button"
        className="pa-btn pa-btn--quiet"
        onClick={onBack}
        disabled={backDisabled}
      >
        <ArrowLeft size={15} strokeWidth={2.2} />
        Back
      </button>

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
          disabled={!canContinue || busy}
        >
          {busy ? (
            <>
              <Loader2 size={15} strokeWidth={2.4} className="pa-spin" />
              Setting up…
            </>
          ) : (
            <>
              {continueLabel}
              <ArrowRight size={15} strokeWidth={2.2} />
            </>
          )}
        </button>
      </div>
    </>
  );
}
