'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * The header every `/app/*` page opens with: a title, one line of purpose,
 * and the page's primary + secondary actions. Every route in this milestone
 * uses this rather than hand-rolling its own heading block, so the product
 * reads as one system rather than 38 slightly different pages.
 */
export function PageHeader({
  crumbs,
  title,
  description,
  actions,
  tabs
}: {
  crumbs?: Crumb[];
  title: string;
  description?: string;
  actions?: ReactNode;
  tabs?: ReactNode;
}) {
  return (
    <div className="pa-pagehead">
      <div className="pa-pagehead__text">
        {crumbs && crumbs.length > 0 && (
          <nav className="pa-pagehead__crumb" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <span key={`${c.label}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
                {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="pa-pagehead__title">{title}</h1>
        {description && <p className="pa-pagehead__desc">{description}</p>}
      </div>

      {actions && <div className="pa-pagehead__actions">{actions}</div>}

      {tabs && <div className="pa-pagehead__tabs">{tabs}</div>}
    </div>
  );
}
