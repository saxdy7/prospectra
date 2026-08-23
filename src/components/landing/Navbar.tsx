'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BRAND } from './brand';
import { Button, Logomark } from './primitives';
import { gsap, prefersReducedMotion } from './motion';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' }
];

export function Navbar({ onLaunch }: { onLaunch: () => void }) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  /* Solidify the pill once the hero starts scrolling away. */
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Track which section is in view so the nav shows where you are. */
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* Lock the page behind the mobile drawer. */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  /* Close the drawer on Escape. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  /* Entrance — the pill drops in once, on load. */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('.lp-nav__inner', {
        y: -24,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.1
      });
      gsap.from('.lp-nav__inner > *', {
        y: -10,
        opacity: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power3.out',
        delay: 0.28
      });
    });
    return () => ctx.revert();
  }, []);

  const go = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <>
      <header className={`lp-nav ${stuck ? 'lp-nav--stuck' : ''}`}>
        <div className="lp-nav__inner">
          <a
            className="lp-logo"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              go('home');
            }}
          >
            <Logomark />
            {BRAND.name}
            <span className="lp-logo__suffix">{BRAND.suffix}</span>
          </a>

          <nav aria-label="Primary">
            <ul className="lp-nav__links">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    className="lp-nav__link"
                    aria-current={active === l.id ? 'true' : undefined}
                    onClick={() => go(l.id)}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lp-nav__actions">
            <button className="lp-nav__link lp-btn--login" onClick={onLaunch}>
              Log In
            </button>
            <Button size="sm" onClick={onLaunch}>
              Get Started
            </Button>
            <button
              className="lp-nav__burger"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="lp-drawer" role="dialog" aria-modal="true" aria-label="Menu">
          {LINKS.map((l) => (
            <button key={l.id} className="lp-drawer__link" onClick={() => go(l.id)}>
              {l.label}
            </button>
          ))}
          <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
            <Button variant="ghost" onClick={onLaunch} className="lp-btn--plain">
              Log In
            </Button>
            <Button chip onClick={onLaunch}>
              Get Started
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
