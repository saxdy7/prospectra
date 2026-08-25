'use client';

import type { ReactNode } from 'react';
import { IconFrame } from '@/components/workspace/IconIllustration';
import type { IconName } from '@/lib/icons/registry';

/**
 * The state every directory/detail page shows before it has content —
 * "meaningful empty state" per the brief, meaning it names what is missing
 * and gives one clear next action rather than just saying "no data".
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction
}: {
  icon: IconName;
  title: string;
  description: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
}) {
  return (
    <div className="pa-empty">
      <IconFrame name={icon} size={56} tone="lg" />
      <p className="pa-empty__title">{title}</p>
      <p className="pa-empty__desc">{description}</p>
      {(action || secondaryAction) && (
        <div className="pa-empty__actions">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

/** A row-shaped empty state, for use inside a table body (colSpan the row). */
export function EmptyTableRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td colSpan={colSpan} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--lp-text-faint)' }}>
        {message}
      </td>
    </tr>
  );
}
