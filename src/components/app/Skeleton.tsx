'use client';

/** A single shimmering block. Compose these for any loading skeleton. */
export function SkeletonBlock({
  width = '100%',
  height = 16,
  radius = 8
}: {
  width?: number | string;
  height?: number | string;
  radius?: number;
}) {
  return (
    <span
      className="pa-skel"
      style={{ display: 'block', width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

/** Skeleton rows for a `pa-table` body, matching real row height. */
export function SkeletonTableRows({ columns, rows = 6 }: { columns: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} aria-hidden="true">
          {Array.from({ length: columns }).map((__, c) => (
            <td key={c}>
              <SkeletonBlock height={14} width={c === 0 ? '70%' : '85%'} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/** A grid of skeleton cards, for directory pages using a card layout. */
export function SkeletonCards({ count = 6 }: { count?: number }) {
  return (
    <div className="pa-grid pa-grid--two" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="pa-panel" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SkeletonBlock height={38} width={38} radius={10} />
          <SkeletonBlock height={16} width="60%" />
          <SkeletonBlock height={13} width="85%" />
          <SkeletonBlock height={13} width="70%" />
        </div>
      ))}
    </div>
  );
}

/** Full-page skeleton for the initial workspace-gate loading state. */
export function PageSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }} role="status" aria-label="Loading">
      <SkeletonBlock height={26} width={220} />
      <SkeletonBlock height={14} width={360} />
      <SkeletonCards count={3} />
    </div>
  );
}
