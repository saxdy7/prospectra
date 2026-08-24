'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ICONS, type IconName } from '@/lib/icons/registry';

/**
 * One illustrated icon slot.
 *
 * Resolves a semantic name through the registry: renders the locally stored
 * isometric asset when one exists, and the Lucide fallback when it does not.
 * Callers never reference a file path or a Lucide component directly, so
 * adding artwork later touches the registry only.
 *
 * The fallback is also a runtime safety net — if an asset 404s or fails to
 * decode, `onError` swaps the Lucide glyph in rather than leaving a gap.
 */
export function IconIllustration({
  name,
  size = 26,
  /**
   * True when neighbouring text already states the meaning, which is the case
   * for every choice card and quick action — the label sits right beside it.
   * Decorative images get an empty alt and aria-hidden so they are not
   * announced twice.
   */
  decorative = true,
  className = ''
}: {
  name: IconName;
  size?: number;
  decorative?: boolean;
  className?: string;
}) {
  const spec = ICONS[name];
  const [failed, setFailed] = useState(false);

  const useAsset = Boolean(spec.asset) && !failed;

  if (useAsset) {
    return (
      <Image
        src={spec.asset as string}
        alt={decorative ? '' : (spec.alt ?? spec.brief)}
        aria-hidden={decorative || undefined}
        width={size}
        height={size}
        className={className}
        onError={() => setFailed(true)}
        priority={false}
      />
    );
  }

  const Fallback = spec.fallback;
  return (
    <Fallback
      size={Math.round(size * 0.62)}
      strokeWidth={1.8}
      className={className}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : (spec.alt ?? spec.brief)}
      role={decorative ? undefined : 'img'}
    />
  );
}

/**
 * The framed container the icon sits in — a compact well with a hairline
 * border. Keeping the frame here means an isometric asset and a Lucide glyph
 * occupy exactly the same box, so swapping one for the other never shifts the
 * layout. `tone="lg"` is the single larger illustration a region is allowed.
 */
export function IconFrame({
  name,
  size = 44,
  tone = 'default',
  decorative = true
}: {
  name: IconName;
  size?: number;
  tone?: 'default' | 'lg';
  decorative?: boolean;
}) {
  const lg = tone === 'lg';
  return (
    <span
      className={cn(
        'relative grid shrink-0 place-items-center overflow-hidden text-brand',
        'bg-gradient-to-br from-accent to-white ring-1 ring-brand/15',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_18px_-12px_rgba(40,95,255,0.55)]',
        lg ? 'rounded-2xl ring-brand/25' : 'rounded-xl'
      )}
      style={{ width: size, height: size }}
    >
      {/* Top gloss — the small tell that sells this as a rendered tile rather
          than a flat glyph, standing in for the isometric artwork. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent"
      />
      <IconIllustration
        name={name}
        size={Math.round(size * 0.5)}
        decorative={decorative}
        className="relative text-brand"
      />
    </span>
  );
}
