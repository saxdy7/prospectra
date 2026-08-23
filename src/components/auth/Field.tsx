'use client';

import { useId, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type FieldProps = {
  label: string;
  icon: LucideIcon;
  error?: string;
  /** Renders a reveal toggle and flips the input between password/text. */
  reveal?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'>;

export function Field({ label, icon: Icon, error, reveal = false, ...input }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const [shown, setShown] = useState(false);

  const type = reveal ? (shown ? 'text' : 'password') : input.type;

  return (
    <div className="lp-field">
      <label className="lp-field__label" htmlFor={id}>
        {label}
      </label>

      <div className="lp-field__wrap">
        <span className="lp-field__icon">
          <Icon size={16} strokeWidth={1.9} />
        </span>

        <input
          {...input}
          id={id}
          type={type}
          className={`lp-field__input${reveal ? ' lp-field__input--reveal' : ''}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />

        {reveal && (
          <button
            type="button"
            className="lp-field__toggle"
            onClick={() => setShown((v) => !v)}
            /* The control's job is toggling visibility, so it announces that
               action rather than the field it belongs to. */
            aria-label={shown ? 'Hide password' : 'Show password'}
            aria-pressed={shown}
          >
            {shown ? <EyeOff size={16} strokeWidth={1.9} /> : <Eye size={16} strokeWidth={1.9} />}
          </button>
        )}
      </div>

      {error && (
        <span className="lp-field__error" id={errorId} role="alert">
          <AlertCircle size={13} strokeWidth={2.2} />
          {error}
        </span>
      )}
    </div>
  );
}
