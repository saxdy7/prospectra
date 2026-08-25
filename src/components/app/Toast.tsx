'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

type ToastTone = 'default' | 'success' | 'error';

interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  push: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Mounted once by AppShell. Every route calls `useToast().push(...)` after a
 * mock save/create/delete — the brief's "toast feedback after mock
 * saves/creates/deletes" rule, satisfied from one place instead of each page
 * rolling its own.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const push = useCallback((message: string, tone: ToastTone = 'default') => {
    counter.current += 1;
    const id = `toast-${counter.current}`;
    setItems((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="pa-toast-region" role="status" aria-live="polite">
            {items.map((t) => (
              <div key={t.id} className={`pa-toast pa-toast--${t.tone}`}>
                <span className="pa-toast__icon" aria-hidden="true">
                  {t.tone === 'success' ? (
                    <CheckCircle2 size={17} />
                  ) : t.tone === 'error' ? (
                    <XCircle size={17} />
                  ) : (
                    <Info size={17} />
                  )}
                </span>
                <span className="pa-toast__msg">{t.message}</span>
                <button
                  className="pa-toast__close"
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
