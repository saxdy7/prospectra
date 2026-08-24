'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Check, KeyRound, Loader2, Lock, Mail } from 'lucide-react';
import { Field } from './Field';
import { createClient } from '@/utils/supabase/client';

type Errors = { email?: string; password?: string };

/** Where a successful sign-in lands. */
/**
 * Signing in goes into the product, not back to the marketing page.
 *
 * /app is the right single target for both cases: it checks for a completed
 * workspace and sends anyone who has not finished setup on to /onboarding,
 * so this does not need to know which of the two applies.
 */
const AFTER_SIGN_IN = '/app';

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [alert, setAlert] = useState<string>();
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    const next: Errors = {};
    if (!email.trim()) next.email = 'Enter your work email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'That email looks incomplete.';
    if (!password) next.password = 'Enter your password.';

    setErrors(next);
    setAlert(undefined);
    if (Object.keys(next).length) return;

    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      setBusy(false);
      /* Supabase returns the same "Invalid login credentials" for a wrong
         password and an unknown address, which is deliberate — telling them
         apart would confirm which emails have accounts. Keep it that way. */
      setAlert(
        error.message === 'Invalid login credentials'
          ? 'That email and password do not match an account.'
          : error.message
      );
      return;
    }

    /* refresh() re-runs the server components with the new session cookie
       before navigating, so the destination renders as signed in. */
    router.refresh();
    router.push(AFTER_SIGN_IN);
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

        {alert && (
          <p className="lp-auth__alert" role="alert">
            <AlertCircle size={15} strokeWidth={2.2} />
            {alert}
          </p>
        )}

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
