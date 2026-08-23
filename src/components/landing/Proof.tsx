'use client';

import { SectionHead } from './primitives';
import { useGsap, revealOnScroll, countUp, gsap } from './motion';

const STATS = [
  { to: 200, suffix: '+', label: 'Data sources scanned' },
  { to: 94, suffix: '%', label: 'Rows with a verified contact' },
  { to: 41, suffix: 'k', label: 'Calls placed last quarter' },
  { to: 14, suffix: 'h', label: 'Saved per rep, per week' }
];

const QUOTES = [
  {
    text: 'We killed four tools. Sourcing, enrichment and the dialer all live in one table now, and the handoff that used to lose us leads simply does not exist any more.',
    who: 'Priya Raghavan',
    role: 'Head of Growth, HyperScale',
    av: 'linear-gradient(145deg, #8aa8ff, #285fff)'
  },
  {
    text: 'The voice agent booked eleven demos in its first week — in Hindi and English, switching mid-call. Our SDRs now only take the calls that already said yes.',
    who: 'Marcus Feld',
    role: 'VP Sales, NeuralGlow',
    av: 'linear-gradient(145deg, #285fff, #1a3ecc)'
  },
  {
    text: 'I described the accounts I wanted in a sentence. Ninety seconds later I had 800 rows with direct dials. That was the moment it clicked for the whole team.',
    who: 'Dana Whitfield',
    role: 'Founder, Cedar & Co',
    av: 'linear-gradient(145deg, #b6c9ff, #4d7bff)'
  }
];

export function Proof() {
  const scope = useGsap(({ scope: el, reduced }) => {
    revealOnScroll(el.querySelectorAll('.lp-reveal'), { trigger: el, reduced });
    revealOnScroll(el.querySelectorAll('.lp-stat'), {
      trigger: el.querySelector('.lp-stats') ?? el,
      y: 24,
      stagger: 0.08,
      reduced
    });
    revealOnScroll(el.querySelectorAll('.lp-quote'), {
      trigger: el.querySelector('.lp-quotes') ?? el,
      y: 32,
      stagger: 0.1,
      reduced
    });

    el.querySelectorAll<HTMLElement>('[data-count]').forEach((node) => {
      countUp(node, Number(node.dataset.count), {
        suffix: node.dataset.suffix ?? '',
        reduced
      });
    });

    if (reduced) return;

    /* Breathes in place — no drift, so the glow stays centred on the
       content it is lighting. */
    gsap.to(el.querySelector('.lp-proof__glow'), {
      scale: 1.1,
      opacity: 0.9,
      duration: 10,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  }, []);

  return (
    <section className="lp-section lp-proof" id="proof" ref={scope}>
      <span className="lp-proof__glow" aria-hidden="true" />

      <div className="lp-shell">
        <div className="lp-stats">
          {STATS.map((s) => (
            <div key={s.label} className="lp-stat">
              <div className="lp-stat__value" data-count={s.to} data-suffix={s.suffix}>
                0{s.suffix}
              </div>
              <div className="lp-stat__label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="lp-shell" style={{ marginTop: 'clamp(4rem, 8vw, 7rem)' }}>
        <SectionHead
          eyebrow="Results"
          title="Teams that stopped stitching tools together"
          lead="What changes is not the number of leads. It is how few of them go cold waiting on a manual step."
        />

        <div className="lp-quotes">
          {QUOTES.map((q) => (
            <figure key={q.who} className="lp-quote">
              <span className="lp-quote__glyph" aria-hidden="true">
                &ldquo;
              </span>
              <blockquote className="lp-quote__text">{q.text}</blockquote>
              <figcaption className="lp-quote__who">
                <span className="lp-quote__av" style={{ background: q.av }}>
                  {q.who
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
                <span>
                  <span className="lp-quote__name">{q.who}</span>
                  <span className="lp-quote__role">{q.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
