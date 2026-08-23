/**
 * Single source of truth for product naming.
 *
 * Every string the landing page renders for the product comes from here, so
 * renaming the product is a one-file change. Nothing else should hardcode it.
 */
export const BRAND = {
  /** Wordmark. Rendered as `Prospectra` + a lighter `.ai` suffix. */
  name: 'Prospectra',
  suffix: '.ai',
  domain: 'prospectra.ai',

  /** Sits in the eyebrow pill above the hero headline. */
  eyebrow: 'Prospect smarter with',

  /** One-liner used in the footer and meta description. */
  tagline: 'Find every lead. Enrich every row. Call every prospect.',

  /**
   * Positioning sentence — what the product actually is, in one breath.
   * Used under the hero headline.
   */
  promise:
    'Scrape live business and job data, enrich it in a reactive table, then reach out with AI voice agents and email — all from one workspace.'
} as const;

export type Brand = typeof BRAND;
