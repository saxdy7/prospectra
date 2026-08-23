'use client';

import { useState } from 'react';
import { Table2, Phone, Mic } from 'lucide-react';
import { Pill } from './primitives';
import { useGsap, revealOnScroll, countUp, gsap } from './motion';

const SOURCE_ROWS = [
  { label: 'Google Maps', value: 62 },
  { label: 'Job boards', value: 41 },
  { label: 'B2B databases', value: 28 }
];
const MAX_DOTS = 9;
const MAX_VALUE = Math.max(...SOURCE_ROWS.map((r) => r.value));

const STATS = [
  { to: 200, suffix: '+', label: 'Data sources scanned' },
  { to: 94, suffix: '%', label: 'Verified contact rate' },
  { to: 41, suffix: 'k', label: 'Calls placed last quarter' },
  { to: 14, suffix: 'h', label: 'Saved per rep, per week' }
];

const WAVE = [30, 55, 40, 78, 96, 62, 84, 46, 70, 38, 58, 88, 50];

export function About() {
  const [live, setLive] = useState(true);

  const scope = useGsap(({ scope: el, reduced }) => {
    revealOnScroll(el.querySelectorAll('.lp-reveal'), { trigger: el, reduced, stagger: 0.06 });
    revealOnScroll(el.querySelectorAll('.lp-about-card'), {
      trigger: el.querySelector('.lp-about-grid') ?? el,
      y: 30,
      stagger: 0.08,
      reduced
    });
    revealOnScroll(el.querySelectorAll('.lp-about-service-card'), {
      trigger: el.querySelector('.lp-about-services') ?? el,
      y: 30,
      stagger: 0.09,
      reduced
    });

    el.querySelectorAll<HTMLElement>('[data-count]').forEach((node) => {
      countUp(node, Number(node.dataset.count), { suffix: node.dataset.suffix ?? '', reduced });
    });

    if (reduced) return;
    gsap.utils.toArray<HTMLElement>('.lp-about-wave-bar').forEach((bar, i) => {
      gsap.to(bar, {
        scaleY: gsap.utils.random(0.4, 1.4),
        duration: gsap.utils.random(0.5, 0.9),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.05,
        transformOrigin: '50% 50%'
      });
    });
  }, []);

  return (
    <section
      className="lp-section lp-section--paper lp-curve-top lp-about"
      id="about"
      ref={scope}
    >
      <div className="lp-shell lp-on-paper">
        {/* ---------------- Intro row ---------------- */}
        <div className="lp-about-intro lp-reveal">
          <Pill tone="ink">About Prospectra</Pill>
          <p className="lp-lead lp-balance">
            At Prospectra, we don&apos;t just send outreach — we run the whole pipeline. Since
            day one, our workspace has powered teams of every size, from solo founders to
            enterprise sales floors.
          </p>
        </div>

        {/* ---------------- Three-card grid ---------------- */}
        <div className="lp-about-grid">
          <article className="lp-about-card lp-about-card--dark">
            <span className="lp-about-card__icon">
              <Table2 size={20} strokeWidth={2} />
            </span>
            <p className="lp-about-card__body">
              Reactive enrichment grid with live provider waterfalls and an auto-run queue —
              <strong> thousands of rows, in perfect sync.</strong>
            </p>
            <button
              type="button"
              className={`lp-about-toggle ${live ? 'lp-about-toggle--on' : ''}`}
              role="switch"
              aria-checked={live}
              onClick={() => setLive((v) => !v)}
            >
              <span className="lp-about-toggle__track">
                <span className="lp-about-toggle__thumb" />
              </span>
              Live Mode
            </button>
          </article>

          <article className="lp-about-card lp-about-card--visual">
            <span className="lp-about-card__pill">
              <Mic size={12} />
              Voice Agents Live
            </span>
            <div className="lp-about-wave" aria-hidden="true">
              {WAVE.map((h, i) => (
                <span
                  key={i}
                  className="lp-about-wave-bar"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <span className="lp-about-card__badge">
              <Phone size={13} />
            </span>
          </article>

          <article className="lp-about-card lp-about-card--stat">
            <div className="lp-about-card__value">94%</div>
            <h3 className="lp-h4">Verified contact rate</h3>
            <p className="lp-about-card__desc">
              Every row is checked across the waterfall before it reaches your table.
            </p>

            <div className="lp-about-dots">
              {SOURCE_ROWS.map((row) => {
                const filled = Math.max(1, Math.round((row.value / MAX_VALUE) * MAX_DOTS));
                return (
                  <div className="lp-about-dots__row" key={row.label}>
                    <span className="lp-about-dots__label">{row.label}</span>
                    <span className="lp-about-dots__track">
                      {Array.from({ length: MAX_DOTS }).map((_, i) => (
                        <span
                          key={i}
                          className={`lp-about-dots__dot ${i < filled ? 'is-filled' : ''}`}
                        />
                      ))}
                    </span>
                    <span className="lp-about-dots__value lp-nums">{row.value}</span>
                  </div>
                );
              })}
            </div>
          </article>
        </div>

        {/* ---------------- Stat strip ---------------- */}
        <p className="lp-about-caption lp-reveal">A few more facts about Prospectra in numbers</p>

        <div className="lp-about-stats lp-reveal">
          {STATS.map((s) => (
            <div key={s.label} className="lp-about-stat">
              <div className="lp-about-stat__value" data-count={s.to} data-suffix={s.suffix}>
                0{s.suffix}
              </div>
              <div className="lp-about-stat__label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="lp-about-divider" />

        {/* ---------------- Services row ---------------- */}
        <div className="lp-about-services">
          <div className="lp-about-services__copy lp-reveal">
            <Pill tone="ink">What we do</Pill>
            <h3 className="lp-h3 lp-balance">
              Sourcing, enrichment and outreach — one workspace, start to finish.
            </h3>
            <p className="lp-body">
              From first row to booked meeting, there&apos;s a path that fits your pipeline.
            </p>
            <a className="lp-about-explore" href="#features">
              Explore Features
              <span className="lp-about-explore__chip">↗</span>
            </a>
          </div>

          <div className="lp-about-services__cards">
            <article className="lp-about-service-card lp-about-service-card--maps">
              <span className="lp-about-card__pill">Live Discovery</span>
              <a className="lp-about-service-card__view" href="#features" aria-label="View lead sourcing">
                ↗
              </a>
              <p className="lp-about-service-card__caption">
                Sourcing built for every market, every vertical.
              </p>
            </article>

            <article className="lp-about-service-card lp-about-service-card--calls">
              <span className="lp-about-card__pill">Outreach Engine</span>
              <p className="lp-about-service-card__caption">
                Reach every prospect, by voice or by email.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
