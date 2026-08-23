'use client';

import type { CSSProperties } from 'react';
import { Sparkles, Search, Zap, Check, Phone } from 'lucide-react';
import { BRAND } from './brand';
import { Button, Glass, GradientField } from './primitives';
import { useGsap, gsap, EASE } from './motion';

/** Headline split into words so GSAP can stagger them individually.
 *  Accented words set in italic, mirroring the reference's mixed roman /
 *  italic display setting. */
const HEADLINE = [
  { text: 'Find', accent: false },
  { text: 'Leads', accent: false },
  { text: '&', accent: false },
  { text: 'Close', accent: true },
  { text: 'Them', accent: true },
  { text: 'On', accent: false },
  { text: 'Autopilot', accent: false }
];

export function Hero({ onLaunch }: { onLaunch: () => void }) {
  const scope = useGsap(({ scope: el, reduced }) => {
    if (reduced) {
      gsap.set(
        ['.lp-hero__pill', '.lp-word', '.lp-hero__lead', '.lp-hero__cta', '.lp-float'],
        { opacity: 1, y: 0, rotateX: 0, scale: 1 }
      );
      return;
    }

    /* The dot field and bloom resolve in behind the copy on load. */
    gsap.from('.lp-halftone', { opacity: 0, duration: 1.6, ease: 'power2.out' });
    gsap.from('.lp-hero__bloom', {
      opacity: 0,
      scaleY: 0.6,
      duration: 1.8,
      ease: 'power3.out',
      transformOrigin: '50% 100%'
    });

    const tl = gsap.timeline({ defaults: { ease: EASE } });

    tl.from('.lp-hero__pill', { y: 16, opacity: 0, duration: 0.7 })
      .from(
        '.lp-word',
        {
          yPercent: 116,
          opacity: 0,
          rotateX: -55,
          duration: 1.05,
          stagger: 0.055,
          transformOrigin: '50% 100%'
        },
        '-=0.35'
      )
      .from('.lp-hero__lead', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('.lp-hero__cta', { y: 18, opacity: 0, scale: 0.96, duration: 0.7 }, '-=0.5')
      .from(
        '.lp-float',
        { y: 54, opacity: 0, scale: 0.94, duration: 1, stagger: 0.1 },
        '-=0.45'
      );

    /* The deck is fixed: no idle float and no scroll parallax, so the cards
       hold the positions they are laid out in. Life comes only from the
       content inside them (the live waveform). */

    /* Voice waveform — each bar breathes on its own offset so the strip
       reads as a live call rather than a looping graphic. */
    gsap.utils.toArray<HTMLElement>('.lp-wave-bar').forEach((bar, i) => {
      gsap.to(bar, {
        scaleY: gsap.utils.random(0.35, 1.5),
        duration: gsap.utils.random(0.42, 0.85),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.045,
        transformOrigin: '50% 50%'
      });
    });

    /* The gradient field drifts slowly behind everything. */
    gsap.to('.lp-hero .lp-grade__pass', {
      yPercent: 12,
      scale: 1.06,
      ease: 'none',
      scrollTrigger: {
        trigger: '.lp-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    /* The horizon bloom breathes continuously — scale only, so it stays
       anchored to the foot of the hero. */
    gsap.to('.lp-hero__bloom', {
      scaleY: 1.14,
      opacity: 0.86,
      duration: 7,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      transformOrigin: '50% 100%'
    });

    /* The dot field stays put — it is a fixed texture, not a moving layer. */
  }, []);

  return (
    <section className="lp-hero" id="home" ref={scope}>
      <GradientField style={{ opacity: 0.34 }} />

      {/* Even dot field — one uniform grid across the whole hero. */}
      <div className="lp-halftone" aria-hidden="true">
        <span className="lp-halftone__layer" />
      </div>

      <span className="lp-hero__bloom" aria-hidden="true" />

      <div className="lp-shell">
        <div className="lp-hero__copy">
          <span className="lp-hero__pill">
            <span className="lp-hero__eyebrow">
              <span className="lp-hero__eyebrow-mark" aria-hidden="true" />
              New: multilingual voice agents are live
            </span>
          </span>

          <h1 className="lp-display lp-hero__headline lp-balance" style={{ maxWidth: '15ch' }}>
            {HEADLINE.map((w, i) => (
              <span
                key={i}
                /* The word-gap is a margin, not a text space: the mask wrapper
                   clips overflow, so a trailing space inside it disappears and
                   the words run together. */
                style={{
                  display: 'inline-block',
                  overflow: 'hidden',
                  verticalAlign: 'top',
                  marginRight: i < HEADLINE.length - 1 ? '0.26em' : undefined
                }}
              >
                <span className="lp-word">{w.accent ? <em>{w.text}</em> : w.text}</span>
              </span>
            ))}
          </h1>

          <p className="lp-lead lp-hero__lead" style={{ maxWidth: '58ch' }}>
            {BRAND.promise}
          </p>

          <div className="lp-hero__cta">
            <Button chip href="/signup">
              Start Prospecting Free
            </Button>
            <Button variant="ghost" onClick={onLaunch}>
              Watch 2-min demo
            </Button>
          </div>
        </div>

        {/* ---------------- Floating card deck ---------------- */}
        <div className="lp-hero__deck">
          <div className="lp-deck__side lp-deck__side--left">
            <Glass tone="light" className="lp-float lp-card-points">
              <CreditsCard />
            </Glass>
            <Glass tone="light" className="lp-float lp-card-skeleton">
              <SkeletonRow color="var(--lp-blue-core)" />
            </Glass>
          </div>

          <Glass tone="light" className="lp-float lp-card-search">
            <SearchCard />
          </Glass>

          <div className="lp-deck__side lp-deck__side--right">
            <Glass className="lp-float lp-card-deal">
              <DealCard />
            </Glass>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Cards
   ========================================================================== */

function CreditsCard() {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 8
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--lp-ink)',
              letterSpacing: '-0.01em',
              lineHeight: 1.25
            }}
          >
            Your Enrichment
            <br />
            Credits
          </div>
          <div style={{ fontSize: 11, color: 'var(--lp-ink-faint)', marginTop: 4 }}>
            Last update 2m ago
          </div>
        </div>
        <Sparkles size={20} color="var(--lp-blue-mid)" fill="var(--lp-blue-pale)" />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 10
        }}
      >
        <span className="lp-card-points__value lp-nums">13,200</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: 999,
            background: 'var(--lp-blue-core)',
            color: '#fff'
          }}
        >
          Ready
        </span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--lp-ink-faint)' }}>Credits available</div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          marginTop: 14,
          paddingTop: 12,
          borderTop: '1px solid var(--lp-line-ink)'
        }}
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            background: 'var(--lp-blue-core)',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0
          }}
        >
          <Zap size={13} color="#fff" fill="#fff" />
        </span>
        <div style={{ fontSize: 11, lineHeight: 1.35, color: 'var(--lp-ink-soft)' }}>
          <strong style={{ color: 'var(--lp-ink)' }}>Next tier</strong> 20% off at{' '}
          <span style={{ color: 'var(--lp-blue-core)', fontWeight: 700 }}>20k</span>
        </div>
      </div>
    </>
  );
}

function SkeletonRow({ color }: { color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: color,
          flexShrink: 0
        }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <span
          style={{ height: 7, borderRadius: 4, background: 'var(--lp-paper-soft)', width: '92%' }}
        />
        <span
          style={{ height: 7, borderRadius: 4, background: 'var(--lp-paper-soft)', width: '58%' }}
        />
      </div>
    </div>
  );
}

function SearchCard() {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '7px 15px',
            borderRadius: 999,
            border: '1px solid var(--lp-line-ink)',
            background: '#fff',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--lp-ink)',
            boxShadow: '0 6px 16px -10px rgba(4,16,47,.4)'
          }}
        >
          <Search size={13} color="var(--lp-blue-core)" />
          Live Source Scan
        </span>
      </div>

      <h3 className="lp-card-search__title">
        Scanning <span>200+</span> Sources In Real-Time
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span className="lp-ring" style={{ '--pct': 94 } as CSSProperties}>
          <span>94%</span>
        </span>
        <p
          style={{
            margin: 0,
            fontSize: 12.5,
            lineHeight: 1.45,
            color: 'var(--lp-ink-soft)'
          }}
        >
          Verified contact found for{' '}
          <strong style={{ color: 'var(--lp-ink)' }}>94% of rows</strong> in this table
        </p>
      </div>

      {/* Waveform — a live voice call rendering, composed in CSS. */}
      <div
        style={{
          position: 'relative',
          borderRadius: 14,
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #0a1a4a 0%, #285fff 55%, #8aa8ff 100%)',
          padding: '22px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          /* A definite height, not min-height: the bars size themselves in
             percentages, which cannot resolve against a content-sized box
             and collapse the waveform to nothing. */
          height: 112
        }}
      >
        {WAVE.map((h, i) => (
          <span
            key={i}
            className="lp-wave-bar"
            style={{
              width: 3,
              height: `${h}%`,
              borderRadius: 3,
              background: 'rgba(255,255,255,.85)',
              display: 'block'
            }}
          />
        ))}
        <span
          style={{
            position: 'absolute',
            left: 12,
            top: 10,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 10.5,
            fontWeight: 600,
            color: '#fff',
            padding: '4px 9px',
            borderRadius: 999,
            background: 'rgba(255,255,255,.18)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Phone size={10} />
          Agent live
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          padding: '9px 12px',
          borderRadius: 999,
          background: '#fff',
          border: '1px solid var(--lp-line-ink)',
          boxShadow: '0 8px 20px -14px rgba(4,16,47,.5)'
        }}
      >
        <span className="lp-avatars">
          {['#285fff', '#8aa8ff', '#1a3ecc'].map((c, i) => (
            <span key={i} style={{ background: c }}>
              {'AKR'[i]}
            </span>
          ))}
        </span>
        <div style={{ fontSize: 11, lineHeight: 1.35 }}>
          <strong style={{ color: 'var(--lp-ink)' }}>90% booked more meetings</strong>
          <div style={{ color: 'var(--lp-ink-faint)' }}>Top teams saved 14h last week</div>
        </div>
      </div>
    </>
  );
}

const WAVE = [22, 46, 30, 68, 88, 54, 96, 40, 72, 34, 58, 84, 44, 26, 62, 38, 78, 30, 50, 24];

function DealCard() {
  return (
    <>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '6px 13px',
          borderRadius: 999,
          background: 'rgba(255,255,255,.14)',
          border: '1px solid rgba(255,255,255,.2)',
          fontSize: 11.5,
          fontWeight: 600,
          alignSelf: 'flex-start'
        }}
      >
        <Check size={12} strokeWidth={3} />
        Best match found
      </span>

      <div>
        <div style={{ fontSize: 11, color: 'var(--lp-text-faint)', marginBottom: 5 }}>
          Verified 2 minutes ago
        </div>
        <h3 className="lp-card-deal__value">
          Hotel Cherry
          <br />
          Manali · 4.9★
        </h3>
      </div>

      <div style={{ fontSize: 12, color: 'var(--lp-text-soft)', lineHeight: 1.5 }}>
        Direct line found <strong style={{ color: '#fff' }}>28% faster</strong> with AI
        waterfall
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          marginTop: 4,
          paddingTop: 12,
          borderTop: '1px solid var(--lp-line)'
        }}
      >
        <span
          className="lp-nums"
          style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}
        >
          +91 99582 67395
        </span>
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#fff',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0
          }}
        >
          <Phone size={14} color="var(--lp-blue-core)" fill="var(--lp-blue-core)" />
        </span>
      </div>
    </>
  );
}
