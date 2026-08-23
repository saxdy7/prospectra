import type { Metadata } from 'next';
import { AuthShell } from '../../components/auth/AuthShell';
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Reset your password — Prospectra.ai',
  description: 'Send yourself a link to set a new Prospectra password.'
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Locked out?"
      accent="Back in a minute."
      sub="Reset links land in your inbox straight away and expire in 30 minutes, so an old email can never be used to get in."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
