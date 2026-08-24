/**
 * CSV parsing for the import flow.
 *
 * Hand-written rather than pulled from a dependency: the import path needs to
 * handle quoted fields, embedded commas, escaped quotes and CRLF correctly,
 * and that is a small enough amount of code to own outright. A naive
 * `split(',')` mangles any address field with a comma in it — which, for a
 * lead product, is most of them.
 */

export interface ParsedCsv {
  headers: string[];
  rows: string[][];
  /** Rows whose column count did not match the header. Reported, never dropped. */
  malformed: { line: number; got: number }[];
}

export function parseCsv(text: string): ParsedCsv {
  // Strip a UTF-8 BOM — Excel writes one and it corrupts the first header.
  const input = text.replace(/^﻿/, '');

  const records: string[][] = [];
  let field = '';
  let record: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"'; // escaped quote
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      record.push(field);
      field = '';
    } else if (ch === '\r') {
      // Swallow; the \n that follows ends the record.
    } else if (ch === '\n') {
      record.push(field);
      records.push(record);
      record = [];
      field = '';
    } else {
      field += ch;
    }
  }

  // Trailing record with no newline at end of file.
  if (field.length > 0 || record.length > 0) {
    record.push(field);
    records.push(record);
  }

  /* Carry each record's original 1-based file line through the blank-row
     filter. Reporting a post-filter index would name the wrong line in the
     user's file, which is worse than not reporting one at all. */
  const nonEmpty = records
    .map((cells, i) => ({ cells, line: i + 1 }))
    .filter((r) => r.cells.some((c) => c.trim() !== ''));

  if (!nonEmpty.length) return { headers: [], rows: [], malformed: [] };

  const headers = nonEmpty[0].cells.map((h) => h.trim());
  const rows: string[][] = [];
  const malformed: { line: number; got: number }[] = [];

  nonEmpty.slice(1).forEach(({ cells, line }) => {
    if (cells.length !== headers.length) {
      malformed.push({ line, got: cells.length });
      // Pad or trim so the row is still importable rather than silently lost.
      const fixed = [...cells];
      while (fixed.length < headers.length) fixed.push('');
      rows.push(fixed.slice(0, headers.length));
    } else {
      rows.push(cells);
    }
  });

  return { headers, rows, malformed };
}

/**
 * Guess which column maps to which field, so the mapping step starts mostly
 * correct instead of entirely blank.
 */
export function guessMapping(headers: string[], targets: { key: string; label: string }[]) {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const out: Record<string, string> = {};

  for (const t of targets) {
    const tk = norm(t.key);
    const tl = norm(t.label);
    const hit = headers.find((h) => {
      const n = norm(h);
      return n === tk || n === tl || n.includes(tk) || tk.includes(n);
    });
    if (hit) out[t.key] = hit;
  }
  return out;
}

/** Basic shape checks. Reports problems; never silently discards a row. */
export function validateRow(
  values: Record<string, unknown>
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  const email = String(values.email ?? '').trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    issues.push('Email looks malformed');
  }

  const phone = String(values.phone ?? '').trim();
  if (phone && phone.replace(/\D/g, '').length < 7) {
    issues.push('Phone is too short to dial');
  }

  const hasAnything = Object.values(values).some((v) => String(v ?? '').trim() !== '');
  if (!hasAnything) issues.push('Row is empty');

  return { valid: issues.length === 0, issues };
}

/** Stable key for duplicate detection within an import. */
export function dedupeKey(values: Record<string, unknown>): string {
  const email = String(values.email ?? '').trim().toLowerCase();
  if (email) return `e:${email}`;

  const phone = String(values.phone ?? '').replace(/\D/g, '');
  if (phone) return `p:${phone}`;

  const name = String(values.business_name ?? values.name ?? '').trim().toLowerCase();
  const addr = String(values.address ?? '').trim().toLowerCase();
  return `n:${name}|${addr}`;
}
