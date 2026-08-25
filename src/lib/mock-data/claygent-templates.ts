/**
 * Claygent starter templates — the four research-agent templates named in
 * the frontend milestone brief. These are real, static starter content (not
 * a live provider), so they are not "Demo data" the way search results are.
 */

import type { Claygent } from '../types/product';

export const CLAYGENT_TEMPLATES: Omit<Claygent, 'id' | 'workspaceId' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Prospecting research',
    template: 'prospecting',
    prompt:
      'Visit the company website and find: what the company does in one sentence, their likely tech stack, recent news or funding, and a personalised opening line referencing something specific about them.',
    inputDescription: 'A table with a company name and website column.',
    outputColumns: [
      { id: 'summary', label: 'One-line summary', type: 'text', description: 'What the company does' },
      { id: 'tech_stack', label: 'Likely tech stack', type: 'text', description: 'Inferred from job posts and site metadata' },
      { id: 'signal', label: 'Recent signal', type: 'text', description: 'Funding, news, or hiring signal' },
      { id: 'opener', label: 'Opening line', type: 'text', description: 'A personalised first line for outreach' }
    ],
    runSettings: { model: 'prospectra-research-v1', maxRowsPerRun: 200, creditsPerRow: 3 },
    status: 'ready'
  },
  {
    name: 'Account scoring',
    template: 'account_scoring',
    prompt:
      'Score this account 0-100 on fit against our ideal customer profile (mid-market B2B, 50-500 employees, has a sales or growth team). Explain the score in one sentence.',
    inputDescription: 'A table of companies with headcount and industry columns.',
    outputColumns: [
      { id: 'score', label: 'Fit score', type: 'number', description: '0-100 ICP fit score' },
      { id: 'reason', label: 'Reasoning', type: 'text', description: 'One-sentence explanation' },
      { id: 'tier', label: 'Tier', type: 'status', description: 'Hot / Warm / Cold' }
    ],
    runSettings: { model: 'prospectra-research-v1', maxRowsPerRun: 500, creditsPerRow: 2 },
    status: 'ready'
  },
  {
    name: 'Contact scoring',
    template: 'contact_scoring',
    prompt:
      'Given a contact\'s title and department, score how likely they are to be a buying decision-maker for a sales-tooling product, 0-100.',
    inputDescription: 'A table of contacts with title and department columns.',
    outputColumns: [
      { id: 'score', label: 'Decision-maker score', type: 'number', description: '0-100' },
      { id: 'seniority_guess', label: 'Inferred seniority', type: 'text', description: 'IC / Manager / Director / VP / C-suite' }
    ],
    runSettings: { model: 'prospectra-research-v1', maxRowsPerRun: 500, creditsPerRow: 1 },
    status: 'ready'
  },
  {
    name: 'Copywriting assistant',
    template: 'copywriting',
    prompt:
      'Write a 3-sentence cold email opening for this row, referencing their company, role and the research signal column if present. Keep it under 40 words, no exclamation marks.',
    inputDescription: 'A table with company, role, and optionally a research-signal column.',
    outputColumns: [
      { id: 'opener', label: 'Email opener', type: 'text', description: 'Under 40 words' },
      { id: 'subject_line', label: 'Subject line', type: 'text', description: 'Under 8 words' }
    ],
    runSettings: { model: 'prospectra-research-v1', maxRowsPerRun: 300, creditsPerRow: 2 },
    status: 'ready'
  }
];
