'use client';

import type { JobStatus } from '@/lib/types/models';
import { JOB_LABEL, JOB_TONE } from '@/lib/workspace/store';

export type DemoTagKind = 'demo' | 'simulation' | 'coming-soon' | 'not-connected';

const DEMO_LABEL: Record<DemoTagKind, string> = {
  demo: 'Demo data',
  simulation: 'Simulation',
  'coming-soon': 'Coming soon',
  'not-connected': 'Not connected'
};

/**
 * The single consistent way every unfinished or illustrative surface marks
 * itself. Never rely on colour alone — the label always spells it out.
 */
export function DemoTag({ kind = 'demo', label }: { kind?: DemoTagKind; label?: string }) {
  return <span className={`pa-demo-tag pa-demo-tag--${kind}`}>{label ?? DEMO_LABEL[kind]}</span>;
}

/** Status pill for JobStatus values (search jobs, import jobs, enrichment jobs). */
export function JobStatusPill({ status }: { status: JobStatus }) {
  return <span className={`pa-status pa-status--${JOB_TONE[status]}`}>{JOB_LABEL[status]}</span>;
}

/** Generic status pill for any other string status — pass the tone directly. */
export function StatusPill({
  label,
  tone = 'muted'
}: {
  label: string;
  tone?: 'muted' | 'soft' | 'success' | 'warn';
}) {
  return <span className={`pa-status pa-status--${tone}`}>{label}</span>;
}
