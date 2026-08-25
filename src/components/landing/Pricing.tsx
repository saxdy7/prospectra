'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { BRAND } from './brand';
import { useGsap, revealOnScroll, gsap } from './motion';

type Plan = {
  id: string;
  name: string;
  monthly: number;
  yearly: number;
  tagline: string;
  featured?: boolean;
  features: string[];
};

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 0,
    yearly: 0,
    tagline: 'For teams taking their first steps with Prospectra.',
    features: [
      'Up to 500 rows in the workspace',
      '50 enrichment credits / month',
      'Google Maps sourcing',
      '1 voice agent, trial minutes',
      'Community support'
    ]
  },
  {
    id: 'growth',
    name: 'Growth',
    monthly: 2499,
    yearly: 1999,
    tagline: 'For founders and small teams who need more reach and freedom.',
    featured: true,
    features: [
      'Up to 3 workspaces',
      'Up to 25,000 rows in the workspace',
      '5,000 enrichment credits / month',
      'Full waterfall enrichment',
      '3 voice agents, multilingual calling',
      'Unlimited email sequences',
      'Priority support'
    ]
  },
  {
    id: 'scale',
    name: 'Scale',
    monthly: 7999,
    yearly: 6399,
    tagline: 'For agencies and sales floors running outbound at volume.',
    features: [
      'Unlimited workspaces',
      'Unlimited rows',
      '25,000 enrichment credits / month',
      'AI web researcher & auto-icebreakers',
      'Unlimited voice agents',
      'PII-safe transcripts & audit logs',
      'Dedicated success manager'
    ]
  }
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  const scope = useGsap(({ scope: el, reduced }) => {
    revealOnScroll(el.querySelectorAll('.lp-reveal'), { trigger: el, reduced, stagger: 0.06 });
    revealOnScroll(el.querySelectorAll('.lp-pricing-card'), {
      trigger: el.querySelector('.lp-pricing-grid') ?? el,
      y: 36,
      stagger: 0.1,
      reduced
    });

    if (reduced) return;

    /* The backlight breathes in place. Deliberately no x/y drift — any
       translation pulls the glow off the cards it is meant to be lighting
       and leaves the composition lopsided. */
    gsap.to(el.querySelector('.lp-pricing__orb'), {
      scale: 1.09,
      opacity: 0.92,
      duration: 9,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  }, []);

  return (
    <section className="lp-section lp-pricing" id="pricing" ref={scope}>
      <div className="lp-pricing__backdrop" aria-hidden="true">
        <span className="lp-pricing__orb" />
        {/* Shell-aligned so the wordmark and brand tag track the content
            grid instead of the full-bleed section edge. */}
        <div className="lp-pricing__stage">
          <span className="lp-pricing__watermark">Pricing</span>
          <span className="lp-pricing__brand">
            {BRAND.name}
            {BRAND.suffix}
          </span>
        </div>
      </div>

      <div className="lp-shell">
        <div className="lp-pricing-grid">
          {PLANS.map((plan) => {
            const price = yearly ? plan.yearly : plan.monthly;
            return (
              <article
                key={plan.id}
                className={`lp-pricing-card ${plan.featured ? 'lp-pricing-card--featured' : ''}`}
              >
                <span className="lp-pricing-card__name">{plan.name}</span>

                <div className="lp-pricing-card__price">
                  {price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`}
                  {price > 0 && <span className="lp-pricing-card__period">/m</span>}
                </div>

                <p className="lp-pricing-card__tagline">{plan.tagline}</p>

                <ul className="lp-pricing-card__features">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <span className="lp-pricing-card__check">
                        <Check size={11} strokeWidth={3.2} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Every plan starts the same way — create the account first.
                    There is no checkout to send paid plans to yet, so this
                    does not pretend otherwise. */}
                <a className="lp-pricing-card__cta" href="/signup">
                  {plan.monthly === 0 ? 'Start free' : 'Get started'}
                </a>
              </article>
            );
          })}
        </div>

        <div className="lp-pricing-toggle-row lp-reveal">
          <button
            type="button"
            className={`lp-pricing-toggle ${yearly ? 'lp-pricing-toggle--on' : ''}`}
            role="switch"
            aria-checked={yearly}
            aria-label="Bill yearly"
            onClick={() => setYearly((v) => !v)}
          >
            <span className="lp-pricing-toggle__track">
              <span className="lp-pricing-toggle__thumb" />
            </span>
          </button>
          <span>Yearly</span>
          <span className="lp-pricing-save">Save 20%</span>
        </div>
      </div>
    </section>
  );
}
