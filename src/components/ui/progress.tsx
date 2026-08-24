import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Lightweight progress bar (no Radix dependency), shadcn API shape.
 * `value` is 0–100.
 */
function Progress({
  className,
  value = 0,
  ...props
}: React.ComponentProps<'div'> & { value?: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('bg-secondary relative h-2 w-full overflow-hidden rounded-full', className)}
      {...props}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-deep via-brand to-brand-mid transition-[width] duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export { Progress };
