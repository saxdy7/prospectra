import type { Metadata } from 'next';
import { Suspense } from 'react';
import { OnboardingEntry } from './OnboardingEntry';

export const metadata: Metadata = {
  title: 'Set up your workspace — Prospectra.ai',
  description:
    'Name your workspace, tell Prospectra what you are here to do, and start with a first list.',
  /* Setup is a private, transient surface — nothing here belongs in an index. */
  robots: { index: false, follow: false }
};

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingEntry />
    </Suspense>
  );
}
