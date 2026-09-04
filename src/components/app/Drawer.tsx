'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { preferences } from '@/lib/demo-storage/preferences';

/**
 * The slide-in side panel used for "add column", "create webhook", "create
 * function" and similar focused create/edit flows. Closes on Escape and on
 * scrim click, and traps focus so Tab cannot leave it while open.
 */
export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
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
    panelRef.current?.querySelector<HTMLElement>('button, input, textarea, select')?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="lp pa pa-portal" data-theme={theme}>
      <button className="pa-drawer-scrim" aria-label="Close panel" onClick={onClose} />
      <div
        ref={panelRef}
        className="pa-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="pa-drawer__head">
          <div>
            <h2 className="pa-drawer__title">{title}</h2>
            {description && <p className="pa-drawer__desc">{description}</p>}
          </div>
          <button className="pa-drawer__close" onClick={onClose} aria-label="Close">
            <X size={17} />
          </button>
        </div>
        <div className="pa-drawer__body">{children}</div>
        {footer && <div className="pa-drawer__foot">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
