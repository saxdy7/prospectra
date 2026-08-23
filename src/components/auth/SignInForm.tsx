'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, KeyRound, Loader2, Lock, Mail } from 'lucide-react';
import { Field } from './Field';

type Errors = { email?: string; password?: string };

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    const next: Errors = {};
    if (!email.trim()) next.email = 'Enter your work email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'That email looks incomplete.';
    if (!password) next.password = 'Enter your password.';

    setErrors(next);
    if (Object.keys(next).length) return;

    /* No auth backend is wired up yet — this stands in for the request so the
       button's pending state is real rather than decorative. */
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    setBusy(false);
  };

  return (
    <>
      <h2 className="lp-auth__heading">Sign in to your workspace</h2>
      <p className="lp-auth__lede">
        Pick up where your pipeline left off — your tables, agents and campaigns are
        waiting.
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
          error={errors.email}
        />

        <Field
          label="Password"
          icon={Lock}
          reveal
          name="password"
          autoComplete="current-password"
          placeholder="••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div className="lp-auth__meta">
          <label className="lp-check">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className="lp-check__box">
              <Check size={12} strokeWidth={3.2} />
            </span>
            Keep me signed in
          </label>

          <Link className="lp-auth__link" href="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <button className="lp-auth__submit" type="submit" disabled={busy}>
          {busy ? (
            <>
              <Loader2 size={16} strokeWidth={2.4} className="lp-auth__spinner" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight size={16} strokeWidth={2.4} />
            </>
          )}
        </button>
      </form>

      <div className="lp-auth__divider">or</div>

      <button className="lp-auth__sso" type="button">
        <KeyRound size={16} strokeWidth={1.9} />
        Continue with SSO
      </button>

      <p className="lp-auth__swap">
        New to Prospectra? <Link href="/signup">Create an account</Link>
      </p>
    </>
  );
}
