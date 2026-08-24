'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Table2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconFrame } from '../IconIllustration';
import { DataTable } from './DataTable';
import { CsvImport } from './CsvImport';
import {
  createTable,
  localBusinessColumns,
  type DemoRow,
  type DemoTable
} from '@/lib/workspace/store';

type Mode = { view: 'list' } | { view: 'import' } | { view: 'table'; id: string };

export function TablesSection({
  workspaceId,
  tables,
  rows,
  onCreateTable,
  onImport
}: {
  workspaceId: string;
  tables: DemoTable[];
  rows: Record<string, DemoRow[]>;
  onCreateTable: (table: DemoTable) => void;
  onImport: (table: DemoTable, rows: DemoRow[]) => void;
}) {
  const [mode, setMode] = useState<Mode>({ view: 'list' });

  /* ---------------- Import ---------------- */
  if (mode.view === 'import') {
    return (
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit" onClick={() => setMode({ view: 'list' })}>
          <ArrowLeft className="size-4" />
          Tables
        </Button>
        <CsvImport
          workspaceId={workspaceId}
          onCancel={() => setMode({ view: 'list' })}
          onImported={(t, r) => {
            onImport(t, r);
            setMode({ view: 'table', id: t.id });
          }}
        />
      </div>
    );
  }

  /* ---------------- One table ---------------- */
  if (mode.view === 'table') {
    const table = tables.find((t) => t.id === mode.id);
    if (!table) {
      setMode({ view: 'list' });
      return null;
    }
    const tableRows = rows[table.id] ?? [];

    return (
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit" onClick={() => setMode({ view: 'list' })}>
          <ArrowLeft className="size-4" />
          Tables
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight">{table.name}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {tableRows.length} rows · {table.columns.length} columns
            </p>
          </div>
          <Badge variant="soft">{table.kind}</Badge>
        </div>

        <DataTable
          columns={table.columns}
          rows={tableRows}
          onCreateFirst={() => setMode({ view: 'import' })}
        />
      </div>
    );
  }

  /* ---------------- List ---------------- */
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Tables</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Every list in Prospectra is a table.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setMode({ view: 'import' })}>
            <Upload className="size-4" />
            Import CSV
          </Button>
          <Button
            variant="brand"
            onClick={() => {
              const t = createTable(workspaceId, 'Untitled table', 'leads', localBusinessColumns());
              onCreateTable(t);
              setMode({ view: 'table', id: t.id });
            }}
          >
            <Plus className="size-4" />
            New table
          </Button>
        </div>
      </div>

      {tables.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <IconFrame name="empty-tables" size={64} tone="lg" />
            <p className="mt-1 font-display text-lg font-bold">No tables yet</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Import a CSV you already keep, or start from an empty grid and add
              columns as you go.
            </p>
            <div className="mt-2 flex gap-2">
              <Button variant="brand" onClick={() => setMode({ view: 'import' })}>
                <Upload className="size-4" />
                Import a CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All tables</CardTitle>
            <span className="text-xs text-muted-foreground">{tables.length}</span>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="flex flex-col divide-y divide-border/60">
              {tables.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setMode({ view: 'table', id: t.id })}
                    className="flex w-full items-center gap-3 py-3 text-left transition hover:opacity-80"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-brand">
                      <Table2 className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{t.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {(rows[t.id] ?? []).length} rows · {t.columns.length} columns
                      </span>
                    </span>
                    <Badge variant="muted">{t.kind}</Badge>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
