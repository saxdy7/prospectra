'use client';

import { BRAND } from './brand';
import { GradientField } from './primitives';
import { useGsap, revealOnScroll, gsap } from './motion';

export function HowItWorks() {
  const scope = useGsap(({ scope: el, reduced }) => {
    revealOnScroll(el.querySelectorAll('.lp-reveal'), { trigger: el, reduced });
    revealOnScroll(el.querySelectorAll('.lp-hiw-card'), {
      trigger: el.querySelector('.lp-hiw-grid') ?? el,
      y: 38,
      stagger: 0.12,
      reduced
    });

    if (reduced) return;

    /* Each ring spins on its own slow period, and its halo breathes — the
       glowing-torus motif from the reference, kept alive continuously. */
    gsap.utils.toArray<HTMLElement>('.lp-hiw-ring').forEach((ring, i) => {
      gsap.to(ring, {
        rotate: i % 2 === 0 ? 360 : -360,
        duration: 22 + i * 5,
        ease: 'none',
        repeat: -1
      });
    });

    gsap.utils.toArray<HTMLElement>('.lp-hiw-halo').forEach((halo, i) => {
      gsap.to(halo, {
        scale: 1.22,
        opacity: 0.85,
        duration: 3.6 + i * 0.7,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.4
      });
    });
  }, []);

  return (
    <section className="lp-section lp-hiw" id="how" ref={scope}>
      <GradientField style={{ opacity: 0.34 }} />

      <div className="lp-shell">
        <div className="lp-hiw-head lp-reveal">
          <span className="lp-micro lp-hiw-head__label">How it works</span>
          <h2 className="lp-hiw-head__title lp-balance">
            Three moves from a blank table to a booked call
          </h2>
        </div>

        <div className="lp-hiw-grid">
          {/* ---------------- 01 — Source ---------------- */}
          <article className="lp-hiw-card lp-hiw-card--dark">
            <span className="lp-micro lp-hiw-card__label">Step 01 — Sourcing</span>

            <div className="lp-hiw-visual">
              <span className="lp-hiw-halo" aria-hidden="true" />
              <span className="lp-hiw-ring" aria-hidden="true" />
            </div>

            <p className="lp-hiw-card__lead">
              Describe who you want in plain language — we scrape Maps, job boards and B2B
              databases for you.
            </p>
          </article>

          {/* ---------------- 02 — Enrich ---------------- */}
          <article className="lp-hiw-card lp-hiw-card--blue">
            <span className="lp-micro lp-hiw-card__label">Step 02 — Enrichment</span>

            <h3 className="lp-hiw-card__title">
              Every gap filled,
              <br />
              row by row
            </h3>

            <div className="lp-hiw-visual lp-hiw-visual--corner">
              <span className="lp-hiw-halo" aria-hidden="true" />
              <span className="lp-hiw-ring" aria-hidden="true" />
            </div>
          </article>

          {/* ---------------- 03 — Reach out (split card) ---------------- */}
          <article className="lp-hiw-card lp-hiw-card--split">
            <div className="lp-hiw-split__top">
              <span className="lp-micro lp-hiw-card__label lp-hiw-card__label--ink">
                Step 03 — Outreach
              </span>
              <h3 className="lp-hiw-card__title lp-hiw-card__title--ink">
                Booked while
                <br />
                you sleep
              </h3>
            </div>

            <div className="lp-hiw-split__bottom">
              <span className="lp-hiw-halo" aria-hidden="true" />
              <span className="lp-hiw-ring lp-hiw-ring--sm" aria-hidden="true" />
              <div className="lp-hiw-split__brand">
                <span className="lp-hiw-split__mark">PRS</span>
                <span className="lp-hiw-split__name">
                  {BRAND.name}
                  {BRAND.suffix}
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
