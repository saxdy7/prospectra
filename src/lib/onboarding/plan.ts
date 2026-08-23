import type { ChecklistItem, GoalId, OnboardingData } from './types';
import { wantsCalling } from './config';

/**
 * Everything the finish screen and the workspace dashboard derive from the
 * user's answers. Kept as pure functions so both surfaces stay in step
 * without passing props between them.
 */

export interface NextStep {
  /** The single highest-value action for this user. */
  cta: string;
  /** One line explaining why this is the suggested starting point. */
  why: string;
  /** Which workspace section the action belongs to. */
  section: string;
}

const NEXT_BY_GOAL: Record<GoalId, NextStep> = {
  'local-business': {
    cta: 'Find local businesses',
    why: 'Name a category and a place, and the first rows land in a table you can work.',
    section: 'find-leads'
  },
  'company-list': {
    cta: 'Build your first list',
    why: 'Set the filters that describe a good account and save the result as a table.',
    section: 'find-leads'
  },
  'find-people': {
    cta: 'Build your first list',
    why: 'Start from the roles you sell to, then let enrichment fill in the rest.',
    section: 'find-leads'
  },
  'enrich-list': {
    cta: 'Create an enrichment table',
    why: 'Bring your rows in once and every column you add runs across all of them.',
    section: 'tables'
  },
  outreach: {
    cta: 'Build your first list',
    why: 'A campaign needs an audience first — start with the people you want to reach.',
    section: 'find-leads'
  },
  'voice-agent': {
    cta: 'Create a voice-agent draft',
    why: 'Write the role and opening line now so the agent is ready when calling opens.',
    section: 'voice'
  },
  explore: {
    cta: 'Explore the workspace',
    why: 'Have a look around — nothing here needs setting up before you can try it.',
    section: 'home'
  }
};

export function nextStepFor(data: OnboardingData): NextStep {
  /* An explicit import beats the goal default: someone who said "CSV" wants
     to see their own rows before anything else. */
  if (data.dataSource === 'import-csv') {
    return {
      cta: 'Import a CSV',
      why: 'Map your columns once and the list becomes a table the rest of the workspace can use.',
      section: 'tables'
    };
  }
  return NEXT_BY_GOAL[data.goal ?? 'explore'];
}

/** Two or three tailored lines for the finish screen. */
export function setupSummary(data: OnboardingData): string[] {
  const lines: string[] = [];

  lines.push(
    data.teamSize && data.teamSize !== 'solo'
      ? `Workspace created for a team of ${data.teamSize}`
      : 'Workspace created'
  );

  if (data.dataSource && data.dataSource !== 'later') {
    const label: Record<string, string> = {
      'search-web': 'Web search ready as your first source',
      'find-companies': 'Company search ready as your first source',
      'find-people': 'People search ready as your first source',
      'import-csv': 'CSV import ready for your first list',
      'connect-crm': 'CRM connection saved for when integrations open',
      'blank-table': 'A blank table is waiting for you'
    };
    lines.push(label[data.dataSource] ?? 'First data source noted');
  }

  if (data.prepare.length) {
    lines.push(
      `${data.prepare.length} enrichment ${
        data.prepare.length === 1 ? 'step' : 'steps'
      } queued for your first table`
    );
  }

  if (wantsCalling(data.calling.stance)) {
    lines.push('Calling preferences saved for the voice rollout');
  }

  return lines.slice(0, 3);
}

/**
 * The workspace checklist. Items are derived from the answers rather than
 * stored, so changing the config never leaves a stale row behind; only the
 * done/not-done flags persist.
 */
export function checklistFor(data: OnboardingData): ChecklistItem[] {
  const items: ChecklistItem[] = [
    {
      id: 'name-workspace',
      label: 'Name your workspace',
      hint: 'Done during setup.'
    }
  ];

  if (data.dataSource === 'import-csv') {
    items.push({
      id: 'first-import',
      label: 'Import your first CSV',
      hint: 'Map the columns once and the mapping is remembered.'
    });
  } else if (data.dataSource === 'connect-crm') {
    items.push({
      id: 'crm-intent',
      label: 'Confirm your CRM',
      hint: 'Saved as an intent — nothing is connected yet.'
    });
  } else {
    items.push({
      id: 'first-table',
      label: 'Create your first table',
      hint: 'Every list in Prospectra starts as a table.'
    });
  }

  if (data.prepare.length) {
    items.push({
      id: 'review-enrichment',
      label: 'Review your enrichment columns',
      hint: 'Check the order before a run spends anything.'
    });
  }

  if (wantsCalling(data.calling.stance)) {
    items.push({
      id: 'voice-draft',
      label: 'Draft your first voice agent',
      hint: 'Write the role and opening line ahead of the rollout.'
    });
  }

  if (data.goal === 'outreach') {
    items.push({
      id: 'first-campaign',
      label: 'Outline your first campaign',
      hint: 'Pick an audience and a first message.'
    });
  }

  items.push({
    id: 'invite-team',
    label: 'Invite a teammate',
    hint: 'Optional — a workspace works fine on your own.'
  });

  return items;
}

/** Pre-tick what setup genuinely completed, so the list starts honest. */
export function initialChecklistDone(data: OnboardingData): Record<string, boolean> {
  const done: Record<string, boolean> = { 'name-workspace': true };
  if (data.dataSource === 'connect-crm' && data.crmIntent.length) {
    done['crm-intent'] = true;
  }
  return done;
}
