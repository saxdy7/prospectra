'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Lightbulb, X } from 'lucide-react';
import { useToast } from './Toast';
import { preferences } from '@/lib/demo-storage/preferences';

export type FeatureRequestCategory = 'feature' | 'integration' | 'bug' | 'other';

const CATEGORIES: { id: FeatureRequestCategory; label: string }[] = [
  { id: 'feature', label: 'Feature request' },
  { id: 'integration', label: 'Integration' },
  { id: 'bug', label: 'Bug report' },
  { id: 'other', label: 'Other' }
];

/**
 * Reachable from the sidebar's "Request a feature" link on every `/app/*`
 * page, and from the Integrations directory pre-set to the "Integration"
 * category. There is no real inbox behind this yet — submitting confirms
 * that honestly rather than pretending a team received it.
 */
export function FeatureRequestModal({
  open,
  onClose,
  defaultCategory = 'feature'
}: {
  open: boolean;
  onClose: () => void;
  defaultCategory?: FeatureRequestCategory;
}) {
  const [category, setCategory] = useState<FeatureRequestCategory>(defaultCategory);
  const [text, setText] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const { push } = useToast();
  // The --lp- and --pa- token families are only defined inside the .pa
  // class scope, and createPortal(..., document.body) makes this a sibling
  // of .lp.pa, not a descendant — without re-declaring that scope here,
  // every var() lookup resolves to nothing and renders transparent.
  const theme = useSyncExternalStore(
    preferences.subscribeTheme,
    preferences.getTheme,
    preferences.getThemeServerSnapshot
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('textarea')?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  const submit = () => {
    if (!text.trim()) return;
    push("Thanks — noted. This demo doesn't wire requests to a real inbox yet.", 'success');
    setText('');
    setCategory(defaultCategory);
    onClose();
  };

  return createPortal(
    <div className="lp pa pa-dialog-scrim" data-theme={theme} role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        className="pa-dialog pa-dialog--form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feature-request-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pa-dialog__head-row">
          <span className="pa-dialog__icon pa-dialog__icon--neutral" style={{ marginBottom: 0 }}>
            <Lightbulb size={19} />
          </span>
          <h2 className="pa-dialog__title" id="feature-request-title" style={{ flex: 1 }}>
            Request a feature
          </h2>
          <button type="button" className="pa-icon-btn" aria-label="Close" onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        <div className="pa-chip-row" role="radiogroup" aria-label="Category">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={category === c.id}
              className="pa-chip"
              data-active={category === c.id ? '' : undefined}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <textarea
          className="pa-input pa-textarea"
          placeholder="Describe the feature or integration you'd like us to add…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          style={{ marginTop: 12, resize: 'none' }}
        />

        <div className="pa-dialog__actions">
          <button className="pa-btn pa-btn--ghost" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="pa-btn" type="button" onClick={submit} disabled={!text.trim()}>
            Submit request
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
