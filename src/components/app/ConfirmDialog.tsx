'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Info } from 'lucide-react';
import { preferences } from '@/lib/demo-storage/preferences';

/**
 * The confirmation every destructive demo action goes through — delete a
 * table, revoke a webhook, remove a member. `tone="neutral"` is for
 * non-destructive but still worth-confirming actions (e.g. "clear all demo
 * data").
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  tone = 'destructive'
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: ReactNode;
  tone?: 'destructive' | 'neutral';
}) {
  const panelRef = useRef<HTMLDivElement>(null);
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
    // Focus Cancel, not Confirm — a destructive action should never be one
    // accidental Enter away from firing when the dialog opens.
    panelRef.current?.querySelector<HTMLElement>('.pa-dialog__actions button')?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="lp pa pa-dialog-scrim" data-theme={theme} role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        className="pa-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <span className={`pa-dialog__icon${tone === 'neutral' ? ' pa-dialog__icon--neutral' : ''}`}>
          {tone === 'neutral' ? <Info size={19} /> : <AlertTriangle size={19} />}
        </span>
        <h2 className="pa-dialog__title" id="confirm-title">
          {title}
        </h2>
        <p className="pa-dialog__desc">{description}</p>
        <div className="pa-dialog__actions">
          <button className="pa-btn pa-btn--ghost" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="pa-btn"
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={
              tone === 'destructive'
                ? { background: '#c8324b', boxShadow: 'none' }
                : undefined
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
