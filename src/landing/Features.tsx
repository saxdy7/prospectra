import {
  MapPin,
  Layers,
  Bot,
  Table2,
  Mic,
  Languages,
  Mail,
  ShieldCheck
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LearnMore, SectionHead } from './primitives';
import { useGsap, revealOnScroll, gsap } from './motion';

type Feature = {
  icon: LucideIcon;
  title: string;
  body: string;
  hot?: boolean;
};

const FEATURES: Feature[] = [
  {
    icon: MapPin,
    title: 'Live Lead Discovery',
    body: 'Pull verified businesses straight off Google Maps — phone, site, rating, reviews.',
    hot: true
  },
  {
    icon: Layers,
    title: 'Waterfall Enrichment',
    body: 'Chain providers so a miss on one falls through to the next automatically.'
  },
  {
    icon: Bot,
    title: 'AI Web Researcher',
    body: 'An agent visits each site, finds decision makers and writes the icebreaker.'
  },
  {
    icon: Table2,
    title: 'Reactive Data Grid',
    body: 'Thousands of rows with live cell status, formulas and an auto-run queue.'
  },
  {
    icon: Mic,
    title: 'Conversational Voice Agents',
    body: 'Build a caller with a role, objective and context variables in minutes.'
  },
  {
    icon: Languages,
    title: 'Multilingual Calling',
    body: 'Agents switch between Hindi, English and more mid-call without dropping.'
  },
  {
    icon: Mail,
    title: 'Email Sequences',
    body: 'Multi-day cadences that pull personalisation from any column in the table.'
  },
  {
    icon: ShieldCheck,
    title: 'PII-Safe Transcripts',
    body: 'Automatic redaction on every recording so compliance never blocks a launch.'
  }
];

export function Features() {
  const scope = useGsap(({ scope: el, reduced }) => {
    revealOnScroll(el.querySelectorAll('.lp-reveal'), {
      trigger: el,
      reduced,
      stagger: 0.06
    });

    revealOnScroll(el.querySelectorAll('.lp-feature'), {
      trigger: el.querySelector('.lp-grid') ?? el,
      y: 34,
      stagger: 0.055,
      duration: 0.8,
      reduced
    });

    /* Pointer-tracked sheen on the highlighted card. */
    if (reduced) return;
    const hot = el.querySelector<HTMLElement>('.lp-feature--hot');
    if (!hot) return;

    const move = (e: PointerEvent) => {
      const r = hot.getBoundingClientRect();
      gsap.to(hot, {
        '--mx': `${((e.clientX - r.left) / r.width) * 100}%`,
        '--my': `${((e.clientY - r.top) / r.height) * 100}%`,
        duration: 0.5,
        ease: 'power2.out'
      });
    };
    hot.addEventListener('pointermove', move);
    return () => hot.removeEventListener('pointermove', move);
  }, []);

  return (
    <section className="lp-section lp-section--paper" id="features" ref={scope}>
      <div className="lp-shell lp-on-paper">
        <SectionHead
          eyebrow="AI Features"
          tone="ink"
          title={
            <>
              Everything you need, from first row to booked meeting
            </>
          }
          lead="Sourcing, enrichment, research and outreach live in one workspace — so a lead never has to be exported, cleaned and re-imported to move forward."
        />

        <div className="lp-grid">
          {FEATURES.map(({ icon: Icon, title, body, hot }) => (
            <article key={title} className={`lp-feature ${hot ? 'lp-feature--hot' : ''}`}>
              <span className="lp-feature__icon">
                <Icon size={19} strokeWidth={2} />
              </span>
              <h3 className="lp-feature__title">{title}</h3>
              <p className="lp-feature__body">{body}</p>
              <LearnMore />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
