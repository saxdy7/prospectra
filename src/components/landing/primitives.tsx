import type { ReactNode, CSSProperties, HTMLAttributes } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

/* ==========================================================================
   GradientField — the "grading"
   --------------------------------------------------------------------------
   Direct port of the Figma recipe in the reference breakdown:

     4 stacked linear gradients   #285FFF → #8AA8FF
                                  #285FFF → #B6C9FF
                                  #285FFF → #004FFF
                                  #000000 → #000000
     → layer blur, uniform 85
     → layer blur, uniform 50
     → mono noise, size 0.21, density 100%, white @ 20%

   The two blur passes are reproduced as nested wrappers (inner 85, outer 50)
   rather than a single combined blur, because stacking them is what produces
   the soft shoulder where the blue falls into the black.
   ========================================================================== */

export function GradientField({
  className = '',
  style
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`lp-grade ${className}`} style={style} aria-hidden="true">
      <div className="lp-grade__pass">
        <div className="lp-grade__stack">
          <span className="lp-grade__band lp-grade__band--a" />
          <span className="lp-grade__band lp-grade__band--b" />
          <span className="lp-grade__band lp-grade__band--c" />
          <span className="lp-grade__band lp-grade__band--d" />
        </div>
      </div>
      <Noise />
    </div>
  );
}

/** Mono film grain, matching the Figma noise layer. */
export function Noise({ opacity }: { opacity?: number } = {}) {
  return (
    <div
      className="lp-noise"
      aria-hidden="true"
      style={opacity === undefined ? undefined : { opacity }}
    />
  );
}

/**
 * ProgressiveBlur — the stacked-mask ramp from the third reference.
 * Four backdrop-filter layers, each blurring harder and masked to a lower
 * band, so the blur builds smoothly instead of banding.
 */
export function ProgressiveBlur({
  height = 160,
  position = 'bottom'
}: {
  height?: number;
  position?: 'top' | 'bottom';
}) {
  const style: CSSProperties = {
    height,
    top: position === 'top' ? 0 : undefined,
    bottom: position === 'bottom' ? 0 : undefined,
    transform: position === 'top' ? 'scaleY(-1)' : undefined
  };

  return (
    <div className="lp-progressive" aria-hidden="true" style={style}>
      <div className="lp-progressive__layer" />
      <div className="lp-progressive__layer" />
      <div className="lp-progressive__layer" />
      <div className="lp-progressive__layer" />
    </div>
  );
}

/* ==========================================================================
   Pill — the eyebrow label above every section headline
   ========================================================================== */

export function Pill({
  children,
  tone = 'glass',
  dot = false,
  className = ''
}: {
  children: ReactNode;
  tone?: 'glass' | 'ink';
  dot?: boolean;
  className?: string;
}) {
  return (
    <span className={`lp-pill ${tone === 'ink' ? 'lp-pill--ink' : ''} ${className}`}>
      {dot && <span className="lp-pill__dot" />}
      {children}
    </span>
  );
}

/* ==========================================================================
   Button
   ========================================================================== */

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  chip = false,
  onClick,
  href,
  className = '',
  type = 'button'
}: {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  size?: 'md' | 'sm';
  chip?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
  type?: 'button' | 'submit';
}) {
  const cls = [
    'lp-btn',
    variant === 'ghost' ? 'lp-btn--ghost' : '',
    size === 'sm' ? 'lp-btn--sm' : '',
    chip ? '' : 'lp-btn--plain',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      {children}
      {chip && (
        <span className="lp-btn__chip">
          <ArrowRight size={15} strokeWidth={2.4} />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a className={cls} href={href} onClick={onClick}>
        {inner}
      </a>
    );
  }

  return (
    <button className={cls} type={type} onClick={onClick}>
      {inner}
    </button>
  );
}

/** Inline "Learn more →" affordance used across the feature cards. */
export function LearnMore({ label = 'Learn more' }: { label?: string }) {
  return (
    <span className="lp-link">
      {label}
      <ArrowUpRight size={14} strokeWidth={2.5} />
    </span>
  );
}

/* ==========================================================================
   Glass card
   ========================================================================== */

export function Glass({
  children,
  tone = 'dark',
  className = '',
  ...rest
}: {
  children: ReactNode;
  tone?: 'dark' | 'light';
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`lp-glass ${tone === 'light' ? 'lp-glass--light' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ==========================================================================
   Section heading — one component so every section shares the exact
   eyebrow → headline → lead rhythm.
   ========================================================================== */

export function SectionHead({
  eyebrow,
  title,
  lead,
  tone = 'dark',
  align = 'center'
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  tone?: 'dark' | 'ink';
  align?: 'center' | 'start';
}) {
  return (
    <div
      className="lp-stack lp-reveal"
      style={{
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align === 'center' ? 'center' : 'left',
        gap: '1rem',
        marginBottom: 'clamp(2.5rem, 5vw, 3.75rem)'
      }}
    >
      <Pill tone={tone === 'ink' ? 'ink' : 'glass'}>{eyebrow}</Pill>
      <h2 className="lp-h2 lp-balance" style={{ maxWidth: '18ch' }}>
        {title}
      </h2>
      {lead && (
        <p
          className="lp-lead lp-balance"
          style={{
            maxWidth: '58ch',
            marginInline: align === 'center' ? 'auto' : undefined
          }}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

/** The brand mark — a stylised signal glyph. */
export function Logomark({ size = 30 }: { size?: number }) {
  return (
    <span className="lp-logo__mark" style={{ width: size, height: size }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 20 20" fill="none">
        <path
          d="M3 13.5C6.5 13.5 8 11 10 7.5C12 4 13.5 1.5 17 1.5"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="4" cy="16.5" r="2" fill="white" />
      </svg>
    </span>
  );
}
