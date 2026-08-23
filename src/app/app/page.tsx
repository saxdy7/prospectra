import type { Metadata } from 'next';
import { Suspense } from 'react';
import { WorkspaceApp } from '@/components/workspace/WorkspaceApp';

export const metadata: Metadata = {
  title: 'Workspace — Prospectra.ai',
  description: 'Your Prospectra workspace.',
  robots: { index: false, follow: false }
};

export default function AppPage() {
  return (
    /* WorkspaceApp reads search params to open the section the finish screen
       recommended, so it needs a boundary of its own. */
    <Suspense fallback={null}>
      <WorkspaceApp />
    </Suspense>
  );
}
