'use client';

import { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  ExternalLink,
  Hash,
  Link2,
  Mail,
  Phone,
  Search,
  Star,
  Tag,
  Type as TypeIcon
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ColumnType, TableColumn } from '@/lib/types/models';
import type { DemoRow } from '@/lib/workspace/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Column type is shown as a glyph in the header, per the spec's table rules. */
const TYPE_ICON: Record<ColumnType, LucideIcon> = {
  text: TypeIcon,
  url: Link2,
  email: Mail,
  phone: Phone,
  number: Hash,
  rating: Star,
  status: Tag,
  date: Hash,
  enrichment: Hash,
  ai_formula: Hash
};

export function DataTable({
  columns,
  rows,
  loading = false,
  onCreateFirst
}: {
  columns: TableColumn[];
  rows: DemoRow[];
  loading?: boolean;
  onCreateFirst?: () => void;
}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const ordered = useMemo(() => [...columns].sort((a, b) => a.position - b.position), [columns]);

  const visible = useMemo(() => {
    let out = rows;

    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((r) =>
        Object.values(r.values).some((v) => String(v ?? '').toLowerCase().includes(q))
      );
    }

    if (sort) {
      out = [...out].sort((a, b) => {
        const av = a.values[sort.key];
        const bv = b.values[sort.key];
        // Numeric when both sides are numeric, lexical otherwise — so a
        // rating column sorts 4.9 above 4.10 rather than below it.
        const an = Number(av);
        const bn = Number(bv);
        const cmp =
          Number.isFinite(an) && Number.isFinite(bn)
            ? an - bn
            : String(av ?? '').localeCompare(String(bv ?? ''));
        return sort.dir === 'asc' ? cmp : -cmp;
      });
    }

    return out;
  }, [rows, query, sort]);

  const toggleSort = (key: string) =>
    setSort((s) =>
      s?.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    );

  const allShown = visible.length > 0 && visible.every((r) => selected.has(r.id));
  const toggleAll = () =>
    setSelected(allShown ? new Set() : new Set(visible.map((r) => r.id)));

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <div className="rounded-xl border border-border/70 bg-card" aria-busy="true">
        <div className="border-b border-border/70 px-4 py-3">
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-border/40 px-4 py-3 last:border-0">
            {ordered.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="h-3.5 animate-pulse rounded bg-muted"
                style={{ width: c.type === 'text' ? 180 : 90 }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  /* ---------------- Empty ---------------- */
  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
        <p className="font-display text-base font-bold">This table is empty</p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
          Nothing has been imported yet. Bring in a CSV or run a search, and the
          rows land here.
        </p>
        {onCreateFirst && (
          <Button variant="brand" className="mt-5" onClick={onCreateFirst}>
            Add your first rows
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar — calm, per the table rules */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter rows…"
            aria-label="Filter rows"
            className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
          />
        </div>

        <span className="text-xs text-muted-foreground" role="status" aria-live="polite">
          {visible.length === rows.length
            ? `${rows.length} rows`
            : `${visible.length} of ${rows.length} rows`}
        </span>

        {selected.size > 0 && (
          <Badge variant="soft">{selected.size} selected</Badge>
        )}
      </div>

      {/* Grid — horizontal scroll on narrow screens rather than a squeezed layout */}
      <div className="overflow-x-auto rounded-xl border border-border/70 bg-card">
        <table className="w-full border-collapse text-sm" style={{ minWidth: 820 }}>
          <thead className="sticky top-0 z-10 bg-secondary/80 backdrop-blur">
            <tr>
              <th scope="col" className="w-10 px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={allShown}
                  onChange={toggleAll}
                  aria-label="Select all shown rows"
                  className="size-3.5 accent-[var(--brand)]"
                />
              </th>
              {ordered.map((c) => {
                const Icon = TYPE_ICON[c.type] ?? TypeIcon;
                const isSorted = sort?.key === c.key;
                return (
                  <th
                    key={c.id}
                    scope="col"
                    aria-sort={
                      isSorted ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'
                    }
                    className="whitespace-nowrap px-3 py-2.5 text-left"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition hover:text-foreground"
                    >
                      <Icon className="size-3" />
                      {c.label}
                      <ArrowUpDown
                        className={cn('size-3', isSorted ? 'text-brand' : 'opacity-30')}
                      />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {visible.map((row) => (
              <tr
                key={row.id}
                className="border-t border-border/50 transition hover:bg-accent/30"
              >
                <td className="px-3 py-2.5 align-top">
                  <input
                    type="checkbox"
                    checked={selected.has(row.id)}
                    onChange={() =>
                      setSelected((s) => {
                        const n = new Set(s);
                        if (n.has(row.id)) n.delete(row.id);
                        else n.add(row.id);
                        return n;
                      })
                    }
                    aria-label={`Select row ${row.position + 1}`}
                    className="size-3.5 accent-[var(--brand)]"
                  />
                </td>
                {ordered.map((c) => (
                  <td key={c.id} className="px-3 py-2.5 align-top">
                    <Cell type={c.type} value={row.values[c.key]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visible.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No rows match “{query}”.
        </p>
      )}
    </div>
  );
}

/** Renders a value according to its column type. */
function Cell({ type, value }: { type: ColumnType; value: unknown }) {
  const s = value == null ? '' : String(value);
  if (!s) return <span className="text-muted-foreground/50">—</span>;

  switch (type) {
    case 'status':
      return <Badge variant="soft">{s}</Badge>;

    case 'phone':
      return (
        <a href={`tel:${s.replace(/\s/g, '')}`} className="whitespace-nowrap text-brand hover:underline">
          {s}
        </a>
      );

    case 'email':
      return (
        <a href={`mailto:${s}`} className="text-brand hover:underline">
          {s}
        </a>
      );

    case 'url':
      return (
        <a
          href={s}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-brand hover:underline"
        >
          {s.replace(/^https?:\/\//, '').slice(0, 28)}
          <ExternalLink className="size-3" />
        </a>
      );

    case 'rating':
      return (
        <span className="inline-flex items-center gap-1 font-semibold tabular-nums">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          {s}
        </span>
      );

    case 'number':
      return <span className="tabular-nums">{s}</span>;

    default:
      return <span className="line-clamp-2">{s}</span>;
  }
}
