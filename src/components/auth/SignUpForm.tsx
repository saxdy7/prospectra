'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, KeyRound, Loader2, Lock, Mail, User } from 'lucide-react';
import { Field } from './Field';

type Errors = { name?: string; email?: string; password?: string; terms?: string };

const TIERS = ['weak', 'fair', 'strong'] as const;

/** Four cheap signals, mapped to three visible tiers. */
function scorePassword(pw: string) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (/\d/.test(pw) && /[A-Za-z]/.test(pw)) score++;
  return Math.min(3, Math.ceil(score * 0.75));
}

export function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const strength = useMemo(() => scorePassword(password), [password]);
  const tier = strength > 0 ? TIERS[strength - 1] : null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    const next: Errors = {};
    if (!name.trim()) next.name = 'Tell us what to call you.';
    if (!email.trim()) next.email = 'Enter your work email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'That email looks incomplete.';
    if (!password) next.password = 'Choose a password.';
    else if (password.length < 8) next.password = 'Use at least 8 characters.';
    if (!terms) next.terms = 'Please accept the terms to continue.';

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
      <h2 className="lp-auth__heading">Start prospecting free</h2>
      <p className="lp-auth__lede">
        500 enrichment credits and a live voice agent, included. No card, no sales call to
        unlock it.
      </p>

      <form className="lp-auth__form" onSubmit={submit} noValidate>
        <Field
          label="Full name"
          icon={User}
          name="name"
          autoComplete="name"
          placeholder="Priya Raghavan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        {password && (
          <div className="lp-strength">
            <span className="lp-strength__track">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`lp-strength__seg${
                    tier && i < strength ? ` is-on--${tier}` : ''
                  }`}
                />
              ))}
            </span>
            <span className="lp-strength__label">{tier ?? ''}</span>
          </div>
        )}

        <div className="lp-field">
          <label className="lp-check">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              aria-invalid={errors.terms ? true : undefined}
            />
            <span className="lp-check__box">
              <Check size={12} strokeWidth={3.2} />
            </span>
            <span>
              I agree to the <Link className="lp-auth__link" href="/signup">Terms</Link> and{' '}
              <Link className="lp-auth__link" href="/signup">Privacy Policy</Link>.
            </span>
          </label>
          {errors.terms && (
            <span className="lp-field__error" role="alert">
              {errors.terms}
            </span>
          )}
        </div>

        <button className="lp-auth__submit" type="submit" disabled={busy}>
          {busy ? (
            <>
              <Loader2 size={16} strokeWidth={2.4} className="lp-auth__spinner" />
              Creating account…
            </>
          ) : (
            <>
              Create account
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
        Already have an account? <Link href="/signin">Sign in</Link>
      </p>
    </>
  );
}
