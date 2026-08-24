'use client';

import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ==========================================================================
   Choice controls
   --------------------------------------------------------------------------
   Every one of these wraps a real <input type="radio"> or <input
   type="checkbox">. That is what gives arrow-key navigation inside a radio
   group, Space to toggle, correct roles, and correct announcement — none of
   which is re-implemented here. The input is visually hidden but present and
   focusable, and CSS :has() drives the selected styling from its state.
   ========================================================================== */

export type ChoiceTone = 'blue' | 'voice';

export function ChoiceCard<T extends string>({
  name,
  value,
  checked,
  onSelect,
  label,
  blurb,
  icon: Icon,
  estimate,
  tone = 'blue'
}: {
  name: string;
  value: T;
  checked: boolean;
  onSelect: (value: T) => void;
  label: string;
  blurb?: string;
  icon?: LucideIcon;
  estimate?: string;
  tone?: ChoiceTone;
}) {
  return (
    <label className={`pa-choice pa-choice--radio${tone === 'voice' ? ' pa-choice--voice' : ''}`}>
      <input
        className="pa-choice__input"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
      />

      {Icon && (
        <span className="pa-choice__icon" aria-hidden="true">
          <Icon size={17} strokeWidth={1.9} />
        </span>
      )}

      <span className="pa-choice__text">
        <span className="pa-choice__label">{label}</span>
        {blurb && <span className="pa-choice__blurb">{blurb}</span>}
        {estimate && (
          <span className="pa-choice__estimate">Estimated setup usage · {estimate}</span>
        )}
      </span>

      <span className="pa-choice__mark" aria-hidden="true">
        <Check size={12} strokeWidth={3.4} />
      </span>
    </label>
  );
}

export function MultiSelectChoice<T extends string>({
  value,
  checked,
  onToggle,
  label,
  blurb,
  icon: Icon,
  estimate,
  tone = 'blue'
}: {
  value: T;
  checked: boolean;
  onToggle: (value: T) => void;
  label: string;
  blurb?: string;
  icon?: LucideIcon;
  estimate?: string;
  tone?: ChoiceTone;
}) {
  return (
    <label className={`pa-choice${tone === 'voice' ? ' pa-choice--voice' : ''}`}>
      <input
        className="pa-choice__input"
        type="checkbox"
        value={value}
        checked={checked}
        onChange={() => onToggle(value)}
      />

      {Icon && (
        <span className="pa-choice__icon" aria-hidden="true">
          <Icon size={17} strokeWidth={1.9} />
        </span>
      )}

      <span className="pa-choice__text">
        <span className="pa-choice__label">{label}</span>
        {blurb && <span className="pa-choice__blurb">{blurb}</span>}
        {estimate && (
          <span className="pa-choice__estimate">Estimated setup usage · {estimate}</span>
        )}
      </span>

      <span className="pa-choice__mark" aria-hidden="true">
        <Check size={12} strokeWidth={3.4} />
      </span>
    </label>
  );
}

/** Compact pill, for CRMs, languages and capability interests. */
export function Chip<T extends string>({
  type,
  name,
  value,
  checked,
  onChange,
  label,
  tone = 'blue'
}: {
  type: 'radio' | 'checkbox';
  name?: string;
  value: T;
  checked: boolean;
  onChange: (value: T) => void;
  label: string;
  tone?: ChoiceTone;
}) {
  return (
    <label className={`pa-chip${tone === 'voice' ? ' pa-chip--voice' : ''}`}>
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
      />
      {checked && <Check size={13} strokeWidth={3} aria-hidden="true" />}
      {label}
    </label>
  );
}

/** Segmented control — a styled radio group, used for team size. */
export function Segmented<T extends string>({
  name,
  options,
  value,
  onChange
}: {
  name: string;
  options: { id: T; label: string }[];
  value: T | undefined;
  onChange: (value: T) => void;
}) {
  return (
    <div className="pa-segment" role="group">
      {options.map((o) => (
        <label key={o.id} className="pa-segment__item">
          <input
            type="radio"
            name={name}
            value={o.id}
            checked={value === o.id}
            onChange={() => onChange(o.id)}
          />
          {o.label}
        </label>
      ))}
    </div>
  );
}

/**
 * Progressive disclosure container.
 *
 * Animates on grid-template-rows rather than max-height, so the panel opens to
 * its true height without a magic number that clips longer content.
 *
 * While collapsed the CSS applies `visibility: hidden`, which takes the inner
 * controls out of both the tab order and the accessibility tree. (`inert`
 * would be the direct way to say that, but it is neither typed nor supported
 * by the React 18 currently installed.)
 */
export function Reveal({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div className="pa-reveal" data-open={open}>
      <div className="pa-reveal__inner">{children}</div>
    </div>
  );
}

/** Fieldset with an accessible legend that is visible as a small heading. */
export function Group({
  legend,
  children,
  className = 'pa-choices'
}: {
  legend: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className="pa-subhead">{legend}</legend>
      {children}
    </fieldset>
  );
}
