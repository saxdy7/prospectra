import type { Metadata } from 'next';
import { AuthShell } from '../../components/auth/AuthShell';
import { SignInForm } from '../../components/auth/SignInForm';

export const metadata: Metadata = {
  title: 'Sign in — Prospectra.ai',
  description:
    'Sign in to your Prospectra workspace to pick up your tables, voice agents and campaigns.'
};

export default function SignInPage() {
  return (
    <AuthShell
      title="Your pipeline,"
      accent="right where you left it."
      sub="Every table, agent and campaign stays live while you are away — no re-imports, no stale rows."
    >
      <SignInForm />
    </AuthShell>
  );
}
