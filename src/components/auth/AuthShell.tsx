'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BRAND } from '../landing/brand';
import { GradientField, Logomark } from '../landing/primitives';
import { useGsap, gsap } from '../landing/motion';
import '../landing/landing.css';
import './auth.css';

const STATS = [
  { value: '200+', label: 'Data sources scanned' },
  { value: '94%', label: 'Verified contact rate' },
  { value: '14h', label: 'Saved per rep, weekly' }
];

export function AuthShell({
  title,
  accent,
  sub,
  children
}: {
  /** Leading (roman) part of the showcase headline. */
  title: string;
  /** Trailing phrase, set in italic to match the landing hero. */
  accent: string;
  sub: string;
  children: ReactNode;
}) {
  const scope = useGsap(({ scope: el, reduced }) => {
    if (reduced) return;

    gsap.from(el.querySelectorAll('.lp-auth__aside > *'), {
      x: -22,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out'
    });

    gsap.from(el.querySelectorAll('.lp-auth__card > *'), {
      y: 18,
      opacity: 0,
      duration: 0.8,
      stagger: 0.07,
      ease: 'power3.out',
      delay: 0.15
    });

    /* Same ambient breathing as the landing page's glows. */
    gsap.to(el.querySelector('.lp-auth__bloom'), {
      scaleY: 1.14,
      opacity: 0.85,
      duration: 7,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      transformOrigin: '50% 100%'
    });
  }, []);

  return (
    <div className="lp" ref={scope}>
      <div className="lp-auth">
        {/* ---------------- Showcase ---------------- */}
        <aside className="lp-auth__aside">
          <GradientField style={{ opacity: 0.3 }} />
          <div className="lp-halftone" aria-hidden="true">
            <span className="lp-halftone__layer" />
          </div>
          <span className="lp-auth__bloom" aria-hidden="true" />

          <Link className="lp-auth__brand" href="/">
            <Logomark />
            {BRAND.name}
            <span className="lp-logo__suffix">{BRAND.suffix}</span>
          </Link>

          <div className="lp-auth__pitch">
            <h1 className="lp-auth__title">
              {title} <em>{accent}</em>
            </h1>
            <p className="lp-auth__sub">{sub}</p>
          </div>

          <div className="lp-auth__proof">
            {STATS.map((s) => (
              <div key={s.label} className="lp-auth__stat">
                <div className="lp-auth__stat-value lp-nums">{s.value}</div>
                <div className="lp-auth__stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* ---------------- Form ---------------- */}
        <main className="lp-auth__main">
          <div className="lp-auth__card">
            <Link className="lp-auth__mobile-brand" href="/">
              <Logomark size={26} />
              {BRAND.name}
              <span className="lp-logo__suffix">{BRAND.suffix}</span>
            </Link>

            <Link className="lp-auth__back" href="/">
              <ArrowLeft size={14} strokeWidth={2.2} />
              Back to site
            </Link>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
