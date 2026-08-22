import { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { Proof } from './Proof';
import { Faq } from './Faq';
import { Footer } from './Footer';
import { BRAND } from './brand';
import { ScrollTrigger } from './motion';
import './landing.css';

export function Landing({ onLaunch }: { onLaunch: () => void }) {
  useEffect(() => {
    document.title = `${BRAND.name}${BRAND.suffix} — ${BRAND.tagline}`;

    /* Fonts and images settling after mount shift every trigger position,
       so recalculate once the page has actually stopped moving. */
    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 400);
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener('load', refresh);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('load', refresh);
    };
  }, []);

  return (
    <div className="lp">
      <Navbar onLaunch={onLaunch} />
      <main>
        <Hero onLaunch={onLaunch} />
        {/* Scalloped shoulder where the dark hero meets the paper section. */}
        <div className="lp-scallop" />
        <Features />
        <HowItWorks />
        <Proof />
        <Faq />
      </main>
      <Footer onLaunch={onLaunch} />
    </div>
  );
}
