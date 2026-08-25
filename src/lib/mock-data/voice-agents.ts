/**
 * Demo voice agents and versions — draft-only, matching the product rule
 * that voice stays draft until every compliance gate passes (see models.ts).
 */

import type { VoiceAgent, VoiceAgentVersion } from '../types/models';

export const DEMO_VOICE_AGENTS: VoiceAgent[] = [
  { id: 'va-1', workspaceId: 'demo', name: 'Inbound Qualifier — Hindi/English', status: 'published', currentVersionId: 'vav-1', createdAt: '2026-07-10T09:00:00.000Z', updatedAt: '2026-08-20T09:00:00.000Z' },
  { id: 'va-2', workspaceId: 'demo', name: 'Outbound SDR — English', status: 'published', currentVersionId: 'vav-2', createdAt: '2026-07-18T09:00:00.000Z', updatedAt: '2026-08-18T09:00:00.000Z' },
  { id: 'va-3', workspaceId: 'demo', name: 'Renewal Reminder — English', status: 'draft', currentVersionId: 'vav-3', createdAt: '2026-08-05T09:00:00.000Z', updatedAt: '2026-08-19T09:00:00.000Z' },
  { id: 'va-4', workspaceId: 'demo', name: 'Job Applicant Screener', status: 'draft', currentVersionId: 'vav-4', createdAt: '2026-08-12T09:00:00.000Z', updatedAt: '2026-08-14T09:00:00.000Z' }
];

export const DEMO_VOICE_AGENT_VERSIONS: VoiceAgentVersion[] = [
  {
    id: 'vav-1',
    agentId: 'va-1',
    version: 3,
    prompt: 'You are a friendly inbound qualifier for Prospectra. Confirm the caller\'s company and role, ask what problem they are trying to solve, and offer to book a follow-up with a human rep if there is a fit.',
    firstMessage: 'Hi, thanks for calling Prospectra — who am I speaking with?',
    model: 'prospectra-voice-v2',
    languages: ['hindi', 'english'],
    voice: 'Aria — warm, neutral accent',
    tools: { calendar: true, crmLookup: false },
    publishedAt: '2026-08-20T09:00:00.000Z',
    createdAt: '2026-08-20T09:00:00.000Z',
    updatedAt: '2026-08-20T09:00:00.000Z'
  },
  {
    id: 'vav-2',
    agentId: 'va-2',
    version: 5,
    prompt: 'You are an outbound SDR. Open with a one-line value prop, ask a qualifying question, and book a 15-minute call if there is interest. Never argue with a "not interested" — thank them and end the call.',
    firstMessage: 'Hi, this is Prospectra calling on behalf of {{company}} — is now an alright time?',
    model: 'prospectra-voice-v2',
    languages: ['english'],
    voice: 'Miles — confident, US accent',
    tools: { calendar: true, crmLookup: true },
    publishedAt: '2026-08-18T09:00:00.000Z',
    createdAt: '2026-08-18T09:00:00.000Z',
    updatedAt: '2026-08-18T09:00:00.000Z'
  },
  {
    id: 'vav-3',
    agentId: 'va-3',
    version: 1,
    prompt: 'You remind customers their plan renews in 7 days and offer to answer billing questions.',
    firstMessage: 'Hi, quick reminder call about your upcoming renewal — got a minute?',
    model: 'prospectra-voice-v2',
    languages: ['english'],
    voice: 'Priya — warm, Indian accent',
    tools: { calendar: false, crmLookup: true },
    createdAt: '2026-08-19T09:00:00.000Z',
    updatedAt: '2026-08-19T09:00:00.000Z'
  },
  {
    id: 'vav-4',
    agentId: 'va-4',
    version: 1,
    prompt: 'You screen job applicants for a first-round phone check: confirm availability, years of experience, and salary expectations.',
    firstMessage: 'Hi, thanks for applying — do you have a few minutes for a quick screening call?',
    model: 'prospectra-voice-v2',
    languages: ['english', 'hindi-english'],
    voice: 'Arjun — neutral, Indian accent',
    tools: { calendar: true, crmLookup: false },
    createdAt: '2026-08-14T09:00:00.000Z',
    updatedAt: '2026-08-14T09:00:00.000Z'
  }
];
