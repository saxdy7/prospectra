'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { SkeletonTableRows } from './Skeleton';
import { EmptyTableRow } from './EmptyState';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  /** Numeric/short columns can skip stretching to fill available width. */
  width?: string;
}

/**
 * The one dark data-table every directory page uses: search box, horizontal
 * scroll on narrow viewports, skeleton rows while loading, and a row-shaped
 * empty state instead of a blank body. `searchKeys` does simple
 * case-insensitive substring matching against those string fields; pass
 * `toolbarExtra` for anything beyond search (filters, view toggle).
 */
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  loading = false,
  searchKeys,
  searchPlaceholder = 'Search…',
  toolbarExtra,
  onRowClick,
  emptyTitle = 'Nothing here yet',
  footer
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  loading?: boolean;
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  toolbarExtra?: ReactNode;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  footer?: ReactNode;
}) {
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    if (!query.trim() || !searchKeys?.length) return rows;
    const q = query.trim().toLowerCase();
    return rows.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q))
    );
  }, [rows, query, searchKeys]);

  return (
    <div className="pa-table-wrap">
      {(searchKeys || toolbarExtra) && (
        <div className="pa-table-toolbar">
          {searchKeys && (
            <label className="pa-table-search">
              <Search size={15} aria-hidden="true" />
              <input
                type="search"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label={searchPlaceholder}
              />
            </label>
          )}
          <span className="pa-table-toolbar__spacer" />
          {toolbarExtra}
        </div>
      )}

      <div className="pa-table-scroll">
        <table className="pa-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} style={c.width ? { width: c.width } : undefined}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonTableRows columns={columns.length} />
            ) : visible.length === 0 ? (
              <EmptyTableRow
                colSpan={columns.length}
                message={query ? `No results for "${query}".` : emptyTitle}
              />
            ) : (
              visible.map((row) => (
                <tr
                  key={row.id}
                  data-clickable={Boolean(onRowClick)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          if (e.key === 'Enter') onRowClick(row);
                        }
                      : undefined
                  }
                >
                  {columns.map((c) => (
                    <td key={c.key}>{c.render(row)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {footer && <div className="pa-table-foot">{footer}</div>}
    </div>
  );
}
