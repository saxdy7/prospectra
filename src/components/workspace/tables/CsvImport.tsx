'use client';

import { useMemo, useRef, useState } from 'react';
import { AlertTriangle, Check, FileSpreadsheet, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dedupeKey, guessMapping, parseCsv, validateRow } from '@/lib/workspace/csv';
import { createRow, createTable, makeColumn, type DemoRow, type DemoTable } from '@/lib/workspace/store';
import type { ColumnType } from '@/lib/types/models';

/** Fields an import can map onto. Extra CSV columns come through as text. */
const TARGETS: { key: string; label: string; type: ColumnType }[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'company', label: 'Company', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone', type: 'phone' },
  { key: 'website', label: 'Website', type: 'url' },
  { key: 'address', label: 'Address', type: 'text' },
  { key: 'title', label: 'Job title', type: 'text' }
];

const MAX_BYTES = 5 * 1024 * 1024;

type Stage = 'pick' | 'map' | 'done';

export function CsvImport({
  workspaceId,
  onImported,
  onCancel
}: {
  workspaceId: string;
  onImported: (table: DemoTable, rows: DemoRow[]) => void;
  onCancel: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>('pick');
  const [fileName, setFileName] = useState('');
  const [parsed, setParsed] = useState<ReturnType<typeof parseCsv> | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<{ imported: number; duplicate: number; invalid: number }>();

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setError(undefined);

    if (!/\.csv$/i.test(file.name) && file.type !== 'text/csv') {
      setError('That is not a CSV. Export as CSV and try again.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`That file is ${Math.round(file.size / 1024 / 1024)} MB. Keep it under 5 MB.`);
      return;
    }

    const text = await file.text();
    const p = parseCsv(text);

    if (!p.headers.length) {
      setError('No columns found. Does the first row contain headers?');
      return;
    }
    if (!p.rows.length) {
      setError('The file has headers but no data rows.');
      return;
    }

    setFileName(file.name);
    setParsed(p);
    setMapping(guessMapping(p.headers, TARGETS));
    setStage('map');
  };

  /* Preview the outcome before committing, so the counts are not a surprise. */
  const preview = useMemo(() => {
    if (!parsed) return null;
    const seen = new Set<string>();
    let duplicate = 0;
    let invalid = 0;

    for (const r of parsed.rows) {
      const values: Record<string, unknown> = {};
      for (const t of TARGETS) {
        const header = mapping[t.key];
        if (!header) continue;
        values[t.key] = r[parsed.headers.indexOf(header)] ?? '';
      }
      const key = dedupeKey(values);
      if (seen.has(key)) duplicate++;
      else {
        seen.add(key);
        if (!validateRow(values).valid) invalid++;
      }
    }
    return { total: parsed.rows.length, duplicate, invalid, ok: parsed.rows.length - duplicate - invalid };
  }, [parsed, mapping]);

  const runImport = () => {
    if (!parsed || !preview) return;

    const mapped = TARGETS.filter((t) => mapping[t.key]);
    const columns = mapped.map((t, i) => makeColumn(t.label, t.type, i));
    const table = createTable(workspaceId, fileName.replace(/\.csv$/i, ''), 'contacts', columns);

    const seen = new Set<string>();
    const rows: DemoRow[] = [];
    let duplicate = 0;
    let invalid = 0;

    parsed.rows.forEach((r) => {
      const values: Record<string, unknown> = {};
      mapped.forEach((t) => {
        const idx = parsed.headers.indexOf(mapping[t.key]);
        const col = columns.find((c) => c.label === t.label)!;
        values[col.key] = r[idx] ?? '';
      });

      // Dedupe uses the target keys, so build a parallel object for the check.
      const forKey: Record<string, unknown> = {};
      mapped.forEach((t) => {
        const idx = parsed.headers.indexOf(mapping[t.key]);
        forKey[t.key] = r[idx] ?? '';
      });

      const key = dedupeKey(forKey);
      if (seen.has(key)) {
        duplicate++;
        return;
      }
      seen.add(key);

      if (!validateRow(forKey).valid) {
        invalid++;
        return;
      }

      rows.push(createRow(table.id, rows.length, values, 'csv'));
    });

    table.rowCount = rows.length;
    setResult({ imported: rows.length, duplicate, invalid });
    setStage('done');
    onImported(table, rows);
  };

  /* ---------------- Pick ---------------- */
  if (stage === 'pick') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Import a CSV</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </CardHeader>
        <CardContent className="pt-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 transition hover:border-brand/50 hover:bg-accent/30"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-accent text-brand">
              <Upload className="size-5" />
            </span>
            <span className="text-sm font-semibold">Choose a CSV file</span>
            <span className="text-xs text-muted-foreground">
              First row must be headers · up to 5 MB
            </span>
          </button>

          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />

          {error && (
            <p className="mt-3 flex items-center gap-2 text-sm text-destructive" role="alert">
              <AlertTriangle className="size-4" />
              {error}
            </p>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            The file is read in your browser. Nothing is uploaded — storage
            arrives with the backend.
          </p>
        </CardContent>
      </Card>
    );
  }

  /* ---------------- Map ---------------- */
  if (stage === 'map' && parsed && preview) {
    return (
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="text-base">Map your columns</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              <FileSpreadsheet className="mr-1 inline size-3" />
              {fileName} · {parsed.rows.length} rows
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setStage('pick')}>
            Back
          </Button>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {TARGETS.map((t) => (
              <label key={t.key} className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold">{t.label}</span>
                <select
                  value={mapping[t.key] ?? ''}
                  onChange={(e) =>
                    setMapping((m) => {
                      const n = { ...m };
                      if (e.target.value) n[t.key] = e.target.value;
                      else delete n[t.key];
                      return n;
                    })
                  }
                  className="h-9 rounded-lg border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
                >
                  <option value="">— skip —</option>
                  {parsed.headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          {/* Honest counts before committing */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Badge variant="success">{preview.ok} will import</Badge>
            {preview.duplicate > 0 && (
              <Badge variant="muted">{preview.duplicate} duplicate</Badge>
            )}
            {preview.invalid > 0 && <Badge variant="warn">{preview.invalid} invalid</Badge>}
            {parsed.malformed.length > 0 && (
              <Badge variant="warn">
                {parsed.malformed.length} malformed line
                {parsed.malformed.length === 1 ? '' : 's'}
              </Badge>
            )}
          </div>

          {parsed.malformed.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Lines {parsed.malformed.slice(0, 5).map((m) => m.line).join(', ')}
              {parsed.malformed.length > 5 ? '…' : ''} had a different column count
              and were padded rather than dropped.
            </p>
          )}

          <div className="mt-5 flex gap-2">
            <Button
              variant="brand"
              onClick={runImport}
              disabled={Object.keys(mapping).length === 0 || preview.ok === 0}
            >
              Import {preview.ok} rows
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>

          {Object.keys(mapping).length === 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Map at least one column to continue.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  /* ---------------- Done ---------------- */
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="size-6" strokeWidth={3} />
        </span>
        <p className="font-display text-lg font-bold">Imported</p>
        <p className="text-sm text-muted-foreground">
          {result?.imported} rows added
          {result?.duplicate ? ` · ${result.duplicate} duplicate skipped` : ''}
          {result?.invalid ? ` · ${result.invalid} invalid skipped` : ''}
        </p>
      </CardContent>
    </Card>
  );
}
