'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Star, Phone, Globe, Building2, Users, ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Pill, Logomark } from './primitives';
import { useGsap, revealOnScroll, gsap, prefersReducedMotion } from './motion';

const WAVE = [26, 52, 34, 74, 92, 58, 88, 44, 66, 30, 50, 80, 40];

/** Businesses the discovery card cycles through, so it reads as a live feed. */
const LEADS = [
  { name: 'Hotel Cherry', rating: '4.9', phone: '+91 99582 67395', ago: 'Verified 2m ago' },
  { name: 'Cafe Mistral', rating: '4.7', phone: '+91 98104 22873', ago: 'Verified just now' },
  { name: 'Studio Verde', rating: '4.8', phone: '+91 90045 71190', ago: 'Verified 1m ago' }
];

type QueueRow = { icon: LucideIcon; name: string; sub: string; delta: string };

/** Pool the enrichment queue streams through, two rows visible at a time. */
const QUEUE_POOL: QueueRow[] = [
  { icon: Building2, name: 'Acme Corp', sub: 'Direct dial found', delta: '+1 contact' },
  { icon: Users, name: 'HyperScale Inc', sub: 'Decision maker found', delta: '+2 contacts' },
  { icon: Building2, name: 'Cedar & Co', sub: 'Email verified', delta: '+1 contact' },
  { icon: Users, name: 'NeuralGlow', sub: 'Tech stack mapped', delta: '+3 contacts' }
];

function useCycle(length: number, ms: number) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % length), ms);
    return () => window.clearInterval(id);
  }, [length, ms]);
  return i;
}

export function Features({ onLaunch }: { onLaunch: () => void }) {
  const leadIndex = useCycle(LEADS.length, 3200);
  const queueIndex = useCycle(QUEUE_POOL.length, 2600);
  const [seconds, setSeconds] = useState(12);

  const leadRef = useRef<HTMLDivElement>(null);
  const queueRef = useRef<HTMLDivElement>(null);

  /* Live-call timer — the small detail that sells "this call is happening". */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  /* Swap-in animation whenever the discovery card changes business. */
  useEffect(() => {
    if (prefersReducedMotion() || !leadRef.current) return;
    gsap.fromTo(
      leadRef.current,
      { opacity: 0, y: 10, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' }
    );
  }, [leadIndex]);

  /* Rows stream upward as the queue advances. */
  useEffect(() => {
    if (prefersReducedMotion() || !queueRef.current) return;
    gsap.fromTo(
      queueRef.current.children,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }
    );
  }, [queueIndex]);

  const scope = useGsap(({ scope: el, reduced }) => {
    revealOnScroll(el.querySelectorAll('.lp-reveal'), { trigger: el, reduced, stagger: 0.06 });
    revealOnScroll(el.querySelectorAll('.lp-feat-card'), {
      trigger: el.querySelector('.lp-feat-grid') ?? el,
      y: 34,
      stagger: 0.08,
      duration: 0.85,
      reduced
    });

    if (reduced) return;

    /* --- Discovery visual: orbit ring + radar sweep --- */
    gsap.to(el.querySelector('.lp-feat-orbit'), {
      rotate: 360,
      duration: 26,
      ease: 'none',
      repeat: -1
    });

    gsap.to(el.querySelector('.lp-feat-sweep'), {
      rotate: 360,
      duration: 6,
      ease: 'none',
      repeat: -1
    });

    /* Bubbles drift, then ping in clockwise sequence as the sweep passes. */
    gsap.utils.toArray<HTMLElement>('.lp-feat-bubble').forEach((bubble, i) => {
      gsap.to(bubble, {
        y: i % 2 === 0 ? -6 : 6,
        duration: 2.4 + i * 0.35,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.2
      });

      gsap
        .timeline({ repeat: -1, delay: i * 1.5, repeatDelay: 6 - 1.5 })
        .to(bubble, {
          scale: 1.16,
          boxShadow: '0 0 0 6px rgba(40,95,255,.14), 0 10px 24px -12px rgba(4,16,47,.35)',
          duration: 0.45,
          ease: 'power2.out'
        })
        .to(bubble, {
          scale: 1,
          boxShadow: '0 0 0 0px rgba(40,95,255,0), 0 10px 24px -12px rgba(4,16,47,.35)',
          duration: 0.7,
          ease: 'power2.inOut'
        });
    });

    /* --- Voice card: waveform + recording dot --- */
    gsap.utils.toArray<HTMLElement>('.lp-feat-wave-bar').forEach((bar, i) => {
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

    gsap.to('.lp-feat-rec', {
      opacity: 0.25,
      scale: 0.82,
      duration: 0.9,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    /* --- CTA card: glow, floating mark, button shimmer --- */
    gsap.to('.lp-feat-cta-glow', {
      scale: 1.3,
      opacity: 0.55,
      x: 20,
      duration: 5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    gsap.to('.lp-feat-card--cta .lp-logo__mark', {
      y: -7,
      duration: 2.8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    gsap.fromTo(
      '.lp-feat-cta__shine',
      { xPercent: -140 },
      { xPercent: 240, duration: 1.5, ease: 'power2.inOut', repeat: -1, repeatDelay: 3.2 }
    );
  }, []);

  const lead = LEADS[leadIndex];
  const rows = [
    QUEUE_POOL[queueIndex],
    QUEUE_POOL[(queueIndex + 1) % QUEUE_POOL.length]
  ];
  const timer = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
    seconds % 60
  ).padStart(2, '0')}`;

  return (
    <section className="lp-section lp-section--paper" id="features" ref={scope}>
      <div className="lp-shell lp-on-paper">
        <div className="lp-feat-head lp-reveal">
          <Pill tone="ink">Key Features</Pill>
          <h2 className="lp-h2 lp-balance">
            Explore Our
            <br />
            <span className="lp-feat-head__accent">Standout Features</span>
          </h2>
        </div>

        <div className="lp-feat-grid">
          {/* ---------------- Card A — Live Lead Discovery ---------------- */}
          <article className="lp-feat-card lp-feat-card--discovery">
            <div className="lp-feat-visual">
              <span className="lp-feat-orbit" aria-hidden="true" />
              <span className="lp-feat-sweep" aria-hidden="true" />

              <span className="lp-feat-bubble lp-feat-bubble--a">
                <Search size={15} strokeWidth={2} />
              </span>
              <span className="lp-feat-bubble lp-feat-bubble--b">
                <Star size={15} strokeWidth={2} />
              </span>
              <span className="lp-feat-bubble lp-feat-bubble--c">
                <Phone size={15} strokeWidth={2} />
              </span>
              <span className="lp-feat-bubble lp-feat-bubble--d">
                <Globe size={15} strokeWidth={2} />
              </span>

              <div className="lp-feat-listing" ref={leadRef}>
                <span className="lp-feat-listing__badge">
                  <span className="lp-feat-listing__pulse" aria-hidden="true" />
                  {lead.ago}
                </span>
                <div className="lp-feat-listing__name">
                  {lead.name}
                  <span className="lp-feat-listing__rating">{lead.rating}★</span>
                </div>
                <div className="lp-feat-listing__meta">
                  <Phone size={12} />
                  {lead.phone}
                </div>
              </div>
            </div>

            <div className="lp-feat-card__text">
              <h3 className="lp-h4">Live Lead Discovery</h3>
              <p className="lp-body" style={{ fontSize: 'var(--lp-t-sm)' }}>
                Pull verified businesses straight off Google Maps — phone, site, rating,
                reviews.
              </p>
            </div>
          </article>

          {/* ---------------- Card B — Reactive Enrichment Queue ---------------- */}
          <article className="lp-feat-card lp-feat-card--queue">
            <div className="lp-feat-card__text">
              <h3 className="lp-h4">Reactive Enrichment Queue</h3>
              <p className="lp-body" style={{ fontSize: 'var(--lp-t-sm)' }}>
                Waterfall providers fill every gap automatically as new rows stream in.
              </p>
            </div>

            <div className="lp-feat-queue" ref={queueRef}>
              {rows.map((row, i) => (
                <div className="lp-feat-queue__row" key={`${row.name}-${i}`}>
                  <span className="lp-feat-queue__icon">
                    <row.icon size={16} strokeWidth={2} />
                  </span>
                  <div className="lp-feat-queue__info">
                    <span className="lp-feat-queue__name">{row.name}</span>
                    <span className="lp-feat-queue__sub">{row.sub}</span>
                  </div>
                  <span className="lp-feat-queue__delta">{row.delta}</span>
                </div>
              ))}
            </div>

            <div className="lp-feat-queue__meter" aria-hidden="true">
              <span className="lp-feat-queue__meter-fill" />
            </div>
          </article>

          {/* ---------------- Card C — Voice & Call Analytics ---------------- */}
          <article className="lp-feat-card lp-feat-card--voice">
            <div className="lp-feat-card__text">
              <h3 className="lp-h4">Voice &amp; Call Analytics</h3>
              <p className="lp-body" style={{ fontSize: 'var(--lp-t-sm)' }}>
                Every call transcribed, scored and rolled up — see what&apos;s working
                without listening to every recording.
              </p>
            </div>

            <div className="lp-feat-phone">
              <div className="lp-feat-phone__screen">
                <span className="lp-feat-phone__tag">
                  <span className="lp-feat-rec" aria-hidden="true" />
                  Live call
                  <span className="lp-feat-phone__timer lp-nums">{timer}</span>
                </span>
                <div className="lp-feat-wave" aria-hidden="true">
                  {WAVE.map((h, i) => (
                    <span key={i} className="lp-feat-wave-bar" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="lp-feat-phone__stat">
                  <strong>94%</strong> verified contact rate this week
                </div>
              </div>
            </div>
          </article>

          {/* ---------------- Card D — CTA ---------------- */}
          <article className="lp-feat-card lp-feat-card--cta">
            <span className="lp-feat-cta-glow" aria-hidden="true" />
            <span className="lp-feat-cta-grid" aria-hidden="true" />
            <Logomark size={48} />
            <h3 className="lp-h4" style={{ color: '#fff', marginTop: 16 }}>
              Start Prospecting
            </h3>
            <p
              style={{
                fontSize: 'var(--lp-t-sm)',
                color: 'rgba(255,255,255,.72)',
                margin: '6px 0 0'
              }}
            >
              500 free credits, no card required.
            </p>
            <button type="button" className="lp-feat-cta__btn" onClick={onLaunch}>
              <span className="lp-feat-cta__shine" aria-hidden="true" />
              Get Started
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}
