import { Search, Sparkles, PhoneCall } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { GradientField, SectionHead, ProgressiveBlur } from './primitives';
import { useGsap, revealOnScroll, gsap } from './motion';

type Step = {
  n: string;
  icon: LucideIcon;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    n: 'Step 01',
    icon: Search,
    title: 'Source',
    body: 'Describe who you want in plain language. Prospectra scrapes Maps, job boards and B2B databases, then streams verified rows into a table as it finds them.'
  },
  {
    n: 'Step 02',
    icon: Sparkles,
    title: 'Enrich',
    body: 'Waterfall providers fill the gaps while a research agent reads each site — tech stack, decision maker, and a personalised opening line per row.'
  },
  {
    n: 'Step 03',
    icon: PhoneCall,
    title: 'Reach out',
    body: 'Fire an email sequence, or let a multilingual voice agent call the list, qualify interest and book the meeting straight into your calendar.'
  }
];

export function HowItWorks() {
  const scope = useGsap(({ scope: el, reduced }) => {
    revealOnScroll(el.querySelectorAll('.lp-reveal'), { trigger: el, reduced });
    revealOnScroll(el.querySelectorAll('.lp-step'), {
      trigger: el.querySelector('.lp-steps') ?? el,
      y: 40,
      stagger: 0.13,
      reduced
    });

    if (reduced) return;

    /* The connecting rail draws itself as the section arrives. */
    gsap.fromTo(
      '.lp-rail__fill',
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.5,
        ease: 'power2.inOut',
        transformOrigin: '0% 50%',
        scrollTrigger: { trigger: el.querySelector('.lp-steps'), start: 'top 72%', once: true }
      }
    );
  }, []);

  return (
    <section className="lp-section" id="how" ref={scope} style={{ position: 'relative' }}>
      <GradientField style={{ opacity: 0.5 }} />
      <ProgressiveBlur height={200} position="bottom" />

      <div className="lp-shell">
        <SectionHead
          eyebrow="How it works"
          title="Three moves from a blank table to a booked call"
          lead="No exports, no CSV round-trips, no stitching six tools together with a spreadsheet in the middle."
        />

        <div className="lp-rail" aria-hidden="true">
          <span className="lp-rail__fill" />
        </div>

        <div className="lp-steps">
          {STEPS.map(({ n, icon: Icon, title, body }) => (
            <article key={n} className="lp-step">
              <span className="lp-step__n">{n}</span>
              <span className="lp-step__icon">
                <Icon size={20} strokeWidth={2} />
              </span>
              <h3 className="lp-h3">{title}</h3>
              <p className="lp-body" style={{ fontSize: 'var(--lp-t-sm)' }}>
                {body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
