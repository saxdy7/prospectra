'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, Mail, MailCheck } from 'lucide-react';
import { Field } from './Field';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return setError('Enter your work email.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError('That email looks incomplete.');
    }
    setError(undefined);

    /* No auth backend is wired up yet — this stands in for the request so the
       button's pending state is real rather than decorative. */
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    setBusy(false);
    setSent(true);
  };

  if (sent) {
    return (
      <>
        <span className="lp-auth__sent-mark" aria-hidden="true">
          <MailCheck size={22} strokeWidth={1.9} />
        </span>

        <h2 className="lp-auth__heading">Check your inbox</h2>
        <p className="lp-auth__lede">
          If an account exists for <strong className="lp-auth__strong">{email}</strong>,
          we&apos;ve sent a link to reset your password. It expires in 30 minutes.
        </p>

        <button
          className="lp-auth__sso"
          type="button"
          style={{ marginTop: 26 }}
          onClick={() => setSent(false)}
        >
          Use a different email
        </button>

        <p className="lp-auth__swap">
          Remembered it? <Link href="/signin">Back to sign in</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h2 className="lp-auth__heading">Reset your password</h2>
      <p className="lp-auth__lede">
        Enter the email you signed up with and we&apos;ll send you a link to set a new
        password.
      </p>

      <form className="lp-auth__form" onSubmit={submit} noValidate>
        <Field
          label="Work email"
          icon={Mail}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />

        <button className="lp-auth__submit" type="submit" disabled={busy}>
          {busy ? (
            <>
              <Loader2 size={16} strokeWidth={2.4} className="lp-auth__spinner" />
              Sending link…
            </>
          ) : (
            <>
              Send reset link
              <ArrowRight size={16} strokeWidth={2.4} />
            </>
          )}
        </button>
      </form>

      <p className="lp-auth__swap">
        <Link href="/signin">
          <ArrowLeft
            size={13}
            strokeWidth={2.2}
            style={{ display: 'inline', verticalAlign: '-1px', marginRight: 5 }}
          />
          Back to sign in
        </Link>
      </p>
    </>
  );
}
