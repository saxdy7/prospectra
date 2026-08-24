import type { ChecklistItem, GoalId, OnboardingData } from './types';
import { wantsCalling } from './config';

/**
 * Everything the finish screen and the workspace home derive from the
 * answers. Pure functions, so both surfaces stay in step without passing
 * props between them.
 */

export interface NextStep {
  /** The single highest-value action for this user. */
  cta: string;
  /** One line on why this is the suggested starting point. */
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
    why: 'Set the filters that describe a good account, and save the result as a table.',
    section: 'find-leads'
  },
  'find-people': {
    cta: 'Build your first list',
    why: 'Start from the roles you sell to, and let enrichment fill in the rest.',
    section: 'find-leads'
  },
  'enrich-list': {
    cta: 'Create an enrichment table',
    why: 'Bring your rows in once, and every column you add runs across all of them.',
    section: 'tables'
  },
  outreach: {
    cta: 'Build a campaign draft',
    why: 'Sketch the audience and the first message now, and send once channels connect.',
    section: 'campaigns'
  },
  'voice-agent': {
    cta: 'Create a voice-agent draft',
    why: 'Write the role and opening line now, so the agent is ready when calling opens.',
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
      why: 'Map your columns once, and the list becomes a table the rest of the workspace can use.',
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
      'search-web': 'Local business search ready as your first source',
      'find-companies': 'Company search ready as your first source',
      'find-people': 'People search ready as your first source',
      'import-csv': 'CSV import ready for your first list',
      'connect-crm': 'CRM noted, to connect when integrations open',
      'blank-table': 'A blank table is waiting for you'
    };
    lines.push(label[data.dataSource] ?? 'First starting point noted');
  }

  if (data.prepare.length) {
    lines.push(
      `${data.prepare.length} setup ${
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
 * stored, so changing the config never strands a row; only the done flags
 * persist.
 */
export function checklistFor(data: OnboardingData): ChecklistItem[] {
  const items: ChecklistItem[] = [
    { id: 'name-workspace', label: 'Name your workspace', hint: 'Done during setup.' }
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
      label: 'Confirm which CRM you use',
      hint: 'Noted for later — nothing is connected yet.'
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
      label: 'Review your setup columns',
      hint: 'Check the order before a run does any work.'
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

/**
 * The separate, future-facing calling checklist. Only shown to people who
 * said calling matters; every item is preparation, never a live call.
 */
export function callingTasksFor(data: OnboardingData): ChecklistItem[] {
  if (!wantsCalling(data.calling.stance)) return [];

  const tasks: ChecklistItem[] = [
    {
      id: 'draft-agent',
      label: 'Draft the agent’s role and opening line',
      hint: 'The part that takes thought — worth doing before the rest exists.'
    },
    {
      id: 'map-number-column',
      label: 'Decide which column holds the number to dial',
      hint: 'A dialler needs one agreed field to read from.'
    }
  ];

  if (data.calling.language) {
    const label: Record<string, string> = {
      english: 'English',
      hindi: 'Hindi',
      'hindi-english': 'Hindi and English',
      other: 'your chosen languages'
    };
    tasks.push({
      id: 'confirm-language',
      label: `Confirm handling for ${label[data.calling.language]}`,
      hint: 'Language shapes both the voice and the script.'
    });
  }

  if (data.calling.interests.includes('knowledge-base')) {
    tasks.push({
      id: 'gather-docs',
      label: 'Gather the documents an agent should answer from',
      hint: 'Collect them now; attach them when the knowledge base lands.'
    });
  }

  return tasks;
}

/** Pre-tick what setup genuinely completed, so the list starts honest. */
export function initialChecklistDone(data: OnboardingData): Record<string, boolean> {
  const done: Record<string, boolean> = { 'name-workspace': true };
  if (data.dataSource === 'connect-crm' && data.crmIntent.length) {
    done['crm-intent'] = true;
  }
  return done;
}
