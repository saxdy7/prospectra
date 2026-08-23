'use client';

import { Check, X } from 'lucide-react';
import type { ChecklistItem } from '@/lib/onboarding/types';

export function SetupChecklist({
  items,
  done,
  onToggle,
  onDismiss
}: {
  items: ChecklistItem[];
  done: Record<string, boolean>;
  onToggle: (id: string) => void;
  onDismiss: () => void;
}) {
  const completed = items.filter((i) => done[i.id]).length;
  const allDone = completed === items.length;

  return (
    <section className="pa-panel" aria-labelledby="checklist-heading">
      <div className="pa-check__head">
        <div>
          <h2 className="pa-h3" id="checklist-heading">
            Finish setting up
          </h2>
          <p className="pa-lede" style={{ fontSize: '0.8125rem', marginTop: 3 }}>
            {allDone
              ? 'That is everything — nothing left on the list.'
              : `${completed} of ${items.length} done`}
          </p>
        </div>

        <button
          type="button"
          className="pa-btn pa-btn--quiet"
          onClick={onDismiss}
          aria-label="Hide the setup checklist"
        >
          <X size={15} strokeWidth={2.2} />
        </button>
      </div>

      <ul className="pa-check">
        {items.map((item) => (
          <li key={item.id}>
            <label className="pa-check__item">
              <input
                type="checkbox"
                checked={Boolean(done[item.id])}
                onChange={() => onToggle(item.id)}
              />
              <span className="pa-check__box" aria-hidden="true">
                <Check size={12} strokeWidth={3.4} />
              </span>
              <span>
                <span className="pa-check__label">{item.label}</span>
                <span className="pa-check__hint">{item.hint}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
