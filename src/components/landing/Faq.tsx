'use client';

import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { SectionHead } from './primitives';
import { useGsap, revealOnScroll, gsap, prefersReducedMotion, EASE_SOFT } from './motion';

const ITEMS = [
  {
    q: 'Where does the lead data actually come from?',
    a: 'Live sources, not a stale database dump. Prospectra scrapes Google Maps for local businesses, job boards for hiring signals, and chains commercial B2B providers in a waterfall so a miss on one falls through to the next. Every row records which provider filled which field.'
  },
  {
    q: 'Do the voice agents really switch language mid-call?',
    a: 'Yes. You set a primary and secondary language — Hindi and English, for example — and the agent follows the prospect. Language switching is a per-agent toggle, so you can lock an agent to one language when compliance requires it.'
  },
  {
    q: 'What happens when an enrichment provider has no match?',
    a: 'The waterfall moves to the next provider in your order and only charges credits on a hit. Rows that exhaust every provider are flagged rather than silently left blank, so you always know what is missing and why.'
  },
  {
    q: 'Is call data handled safely?',
    a: 'Transcripts run through automatic PII and PCI redaction before they are stored, and recordings can be set to expire on a schedule you control. Redaction happens server-side, so unredacted audio is never written to disk.'
  },
  {
    q: 'Can I use this for more than sales outreach?',
    a: 'The same engine powers recruiting and job hunting. Scrape open roles, pull recruiter contacts, generate a tailored pitch per listing, then send it as email or as an introductory voice call.'
  },
  {
    q: 'How long does it take to get a first list running?',
    a: 'A few minutes. Describe your target in a sentence, pick the sources, and rows start streaming into the table while enrichment runs behind them. You do not have to wait for a scrape to finish before working the list.'
  }
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  const scope = useGsap(({ scope: el, reduced }) => {
    revealOnScroll(el.querySelectorAll('.lp-reveal'), { trigger: el, reduced });
    revealOnScroll(el.querySelectorAll('.lp-faq__item'), {
      trigger: el.querySelector('.lp-faq') ?? el,
      y: 22,
      stagger: 0.06,
      reduced
    });

    /* Open the first panel to its natural height once laid out. */
    const first = panels.current[0];
    if (first) gsap.set(first, { height: 'auto' });
  }, []);

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    const reduced = prefersReducedMotion();
    const dur = reduced ? 0 : 0.45;

    /* Close whichever panel is open. */
    if (open !== null && open !== i) {
      const closing = panels.current[open];
      if (closing) gsap.to(closing, { height: 0, duration: dur, ease: EASE_SOFT });
    }

    const target = panels.current[i];
    if (target) {
      gsap.to(target, {
        height: next === null ? 0 : 'auto',
        duration: dur,
        ease: EASE_SOFT
      });
    }

    setOpen(next);
  };

  return (
    <section className="lp-section" id="faq" ref={scope}>
      <div className="lp-shell">
        <SectionHead
          eyebrow="FAQ"
          title="The questions we get before every trial"
          lead="If yours is not here, the team answers in under an hour during business days."
        />

        <div className="lp-faq">
          {ITEMS.map((item, i) => (
            <div key={item.q} className="lp-faq__item" data-open={open === i}>
              <h3 style={{ margin: 0 }}>
                <button
                  className="lp-faq__q"
                  aria-expanded={open === i}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-btn-${i}`}
                  onClick={() => toggle(i)}
                >
                  {item.q}
                  <span className="lp-faq__sign" aria-hidden="true">
                    <Plus size={15} strokeWidth={2.5} />
                  </span>
                </button>
              </h3>
              <div
                className="lp-faq__a"
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-btn-${i}`}
                ref={(node) => {
                  panels.current[i] = node;
                }}
              >
                <div>{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
