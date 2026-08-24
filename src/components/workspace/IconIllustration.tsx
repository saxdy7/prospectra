'use client';

import { useState } from 'react';
import Image from 'next/image';
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
  size = 40,
  /**
   * True when neighbouring text already states the meaning, which is the case
   * for every choice card — the label sits right beside it. Decorative images
   * get an empty alt and aria-hidden so they are not announced twice.
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
        /* Small, above the fold, and never the LCP element. */
        priority={false}
      />
    );
  }

  const Fallback = spec.fallback;
  return (
    <Fallback
      size={Math.round(size * 0.44)}
      strokeWidth={1.9}
      className={className}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : (spec.alt ?? spec.brief)}
      role={decorative ? undefined : 'img'}
    />
  );
}

/**
 * The framed container the icon sits in — a compact navy well with a hairline
 * border and a restrained blue glow when selected. Keeping the frame here means
 * an isometric asset and a Lucide glyph occupy exactly the same box, so
 * swapping one for the other never shifts the layout.
 */
export function IconFrame({
  name,
  size = 38,
  tone = 'default',
  decorative = true
}: {
  name: IconName;
  size?: number;
  tone?: 'default' | 'large';
  decorative?: boolean;
}) {
  return (
    <span
      className={`pa-icon${tone === 'large' ? ' pa-icon--lg' : ''}`}
      style={{ width: size, height: size }}
    >
      <IconIllustration
        name={name}
        size={Math.round(size * 0.72)}
        decorative={decorative}
      />
    </span>
  );
}
