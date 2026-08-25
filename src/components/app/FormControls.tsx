'use client';

import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';

/** Shared label + optional hint row, used by every field below. */
function FieldShell({
  label,
  optional,
  hint,
  error,
  htmlFor,
  children
}: {
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="pa-field">
      <label className="pa-label" htmlFor={htmlFor}>
        {label} {optional && <span className="pa-label__optional">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <span style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)' }}>{hint}</span>
      )}
      {error && (
        <span className="pa-error">
          <AlertCircle size={13} strokeWidth={2.2} />
          {error}
        </span>
      )}
    </div>
  );
}

type TextFieldProps = {
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'>;

export function TextField({ label, optional, hint, error, ...input }: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} optional={optional} hint={hint} error={error} htmlFor={id}>
      <input {...input} id={id} className="pa-input" aria-invalid={error ? true : undefined} />
    </FieldShell>
  );
}

type TextareaFieldProps = {
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'className'>;

export function TextareaField({ label, optional, hint, error, ...input }: TextareaFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} optional={optional} hint={hint} error={error} htmlFor={id}>
      <textarea
        {...input}
        id={id}
        className="pa-input pa-textarea"
        aria-invalid={error ? true : undefined}
      />
    </FieldShell>
  );
}

type SelectFieldProps = {
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'className'>;

export function SelectField({
  label,
  optional,
  hint,
  error,
  options,
  placeholder,
  ...select
}: SelectFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} optional={optional} hint={hint} error={error} htmlFor={id}>
      <select {...select} id={id} className="pa-input pa-select" aria-invalid={error ? true : undefined}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
