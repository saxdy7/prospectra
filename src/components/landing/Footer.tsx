'use client';

import { Mail, Globe, MessageCircle } from 'lucide-react';
import { BRAND } from './brand';
import { Button, GradientField, Logomark, Pill } from './primitives';
import { useGsap, revealOnScroll, gsap } from './motion';

const COLUMNS = [
  {
    title: 'Product',
    links: ['Lead discovery', 'Enrichment', 'Voice agents', 'Campaigns', 'Analytics']
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Customers', 'Security', 'Contact']
  },
  {
    title: 'Resources',
    links: ['Docs', 'API reference', 'Changelog', 'Status', 'Community']
  }
];

/* lucide-react no longer ships trademarked platform logos, so the footer
   uses generic contact glyphs rather than mislabeling them as specific
   social networks the product doesn't actually have accounts on yet. */
const SOCIALS = [
  { icon: Mail, label: 'Email', href: '#home' },
  { icon: Globe, label: 'Community', href: '#home' },
  { icon: MessageCircle, label: 'Updates', href: '#home' }
];

export function Footer({ onLaunch }: { onLaunch: () => void }) {
  const scope = useGsap(({ scope: el, reduced }) => {
    revealOnScroll(el.querySelectorAll('.lp-reveal'), { trigger: el, reduced });

    if (reduced) return;

    /* Ambient breathing glow — a slow, infinite pulse + drift so the
       footer's background reads as alive rather than a static image. */
    const glow = el.querySelector('.lp-footer__glow');
    if (!glow) return;

    gsap.to(glow, {
      scale: 1.18,
      opacity: 0.62,
      x: 26,
      duration: 9,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  }, []);

  return (
    <footer ref={scope}>
      {/* ---------------- Closing CTA ---------------- */}
      <div className="lp-shell" style={{ paddingBottom: 'clamp(4rem, 8vw, 6rem)' }}>
        <div className="lp-cta lp-reveal">
          <GradientField />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <Pill dot>Free while you evaluate</Pill>
            <h2
              className="lp-h2 lp-balance"
              style={{ maxWidth: '17ch', marginInline: 'auto', marginTop: '1.25rem' }}
            >
              Your next customer is already in a table you have not built yet
            </h2>
            <p
              className="lp-lead lp-balance"
              style={{ maxWidth: '52ch', marginInline: 'auto', marginTop: '1rem' }}
            >
              Start with 500 free enrichment credits and a live voice agent. No card, no
              sales call to unlock it.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: '2rem'
              }}
            >
              <Button chip href="/signup">
                Start Prospecting Free
              </Button>
              <Button variant="ghost" onClick={onLaunch}>
                Talk to the team
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Footer ---------------- */}
      <div className="lp-footer">
        <div className="lp-footer__grade" aria-hidden="true">
          <span className="lp-footer__glow" />
        </div>

        <div className="lp-shell lp-footer__top">
          <div className="lp-footer__grid lp-reveal">
            <div className="lp-footer__col lp-footer__col--brand">
              <a className="lp-logo" href="#home" style={{ marginBottom: 14 }}>
                <Logomark />
                {BRAND.name}
                <span className="lp-logo__suffix">{BRAND.suffix}</span>
              </a>
              <p
                className="lp-body"
                style={{ fontSize: 'var(--lp-t-sm)', maxWidth: '34ch', marginTop: 12 }}
              >
                For teams that want full access to every feature — live sourcing, waterfall
                enrichment, and voice agents that call the list for you.
              </p>
              <div className="lp-footer__socials">
                {SOCIALS.map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href} aria-label={label} className="lp-footer__social">
                    <Icon size={16} strokeWidth={1.8} />
                  </a>
                ))}
              </div>
            </div>

            {COLUMNS.map((col) => (
              <div key={col.title} className="lp-footer__col">
                <h4>{col.title}</h4>
                <ul>
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#home">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lp-footer__base">
            <span>
              © {new Date().getFullYear()} {BRAND.name}
              {BRAND.suffix} — {BRAND.domain}
            </span>
            <span style={{ display: 'flex', gap: 20 }}>
              <a href="#home" style={{ color: 'inherit', textDecoration: 'none' }}>
                Privacy
              </a>
              <a href="#home" style={{ color: 'inherit', textDecoration: 'none' }}>
                Terms
              </a>
              <a href="#home" style={{ color: 'inherit', textDecoration: 'none' }}>
                DPA
              </a>
            </span>
          </div>
        </div>

        {/* Giant bleed wordmark, cropped at both edges. */}
        <div className="lp-footer__mark" aria-hidden="true">
          {BRAND.name}
        </div>
      </div>
    </footer>
  );
}
