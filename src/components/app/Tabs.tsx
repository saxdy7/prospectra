'use client';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

/**
 * A plain ARIA tablist. Deliberately not tied to any particular panel
 * implementation — callers own what renders below it, so the same component
 * works for campaign channel tabs, agent-studio sections, and directory
 * status filters alike.
 */
export function Tabs({
  items,
  active,
  onChange
}: {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="pa-tabs" role="tablist">
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={active === t.id}
          className="pa-tab"
          onClick={() => onChange(t.id)}
        >
          {t.label}
          {typeof t.count === 'number' && (
            <span style={{ marginLeft: 6, opacity: 0.6 }}>{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
