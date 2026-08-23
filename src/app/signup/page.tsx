import type { Metadata } from 'next';
import { AuthShell } from '../../components/auth/AuthShell';
import { SignUpForm } from '../../components/auth/SignUpForm';

export const metadata: Metadata = {
  title: 'Create your account — Prospectra.ai',
  description:
    'Start free with 500 enrichment credits and a live voice agent. No card required.'
};

export default function SignUpPage() {
  return (
    <AuthShell
      title="Find every lead."
      accent="Call every prospect."
      sub="Scrape live business and job data, enrich it in a reactive table, then reach out with AI voice agents and email — all from one workspace."
    >
      <SignUpForm />
    </AuthShell>
  );
}
