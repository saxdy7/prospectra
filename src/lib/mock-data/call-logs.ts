/**
 * Demo call logs, transcripts and summaries — illustrate the voice-agent
 * conversations panel and the post-call metrics view. Fictional calls;
 * `redacted: true` on every transcript models the real PII/PCI redaction
 * pipeline described in docs/05, even though nothing here contains PII.
 */

import type { CallLog, CallSummary, CallTranscript } from '../types/models';

export const DEMO_CALL_LOGS: CallLog[] = [
  { id: 'call-1', callCampaignId: 'cc-1', contactId: 'ct-2', status: 'completed', startedAt: '2026-08-24T05:12:00.000Z', durationS: 224, outcome: 'Meeting booked', providerCallId: 'demo', createdAt: '2026-08-24T05:12:00.000Z', updatedAt: '2026-08-24T05:16:00.000Z' },
  { id: 'call-2', callCampaignId: 'cc-1', contactId: 'ct-9', status: 'completed', startedAt: '2026-08-24T04:40:00.000Z', durationS: 96, outcome: 'Not interested', providerCallId: 'demo', createdAt: '2026-08-24T04:40:00.000Z', updatedAt: '2026-08-24T04:42:00.000Z' },
  { id: 'call-3', callCampaignId: 'cc-1', contactId: 'ct-14', status: 'no_answer', durationS: 0, providerCallId: 'demo', createdAt: '2026-08-24T04:10:00.000Z', updatedAt: '2026-08-24T04:10:00.000Z' },
  { id: 'call-4', callCampaignId: 'cc-1', contactId: 'ct-17', status: 'completed', startedAt: '2026-08-23T11:05:00.000Z', durationS: 312, outcome: 'Callback requested', providerCallId: 'demo', createdAt: '2026-08-23T11:05:00.000Z', updatedAt: '2026-08-23T11:10:00.000Z' },
  { id: 'call-5', callCampaignId: 'cc-1', contactId: 'ct-6', status: 'failed', durationS: 0, providerCallId: 'demo', createdAt: '2026-08-23T09:44:00.000Z', updatedAt: '2026-08-23T09:44:00.000Z' }
];

export const DEMO_CALL_TRANSCRIPTS: CallTranscript[] = [
  {
    id: 'tr-1',
    callLogId: 'call-1',
    redacted: true,
    turns: [
      { speaker: 'agent', text: 'Hi, this is Prospectra calling on behalf of HyperScale Cloud — is now an alright time for a two-minute chat about your infra spend?', atMs: 0 },
      { speaker: 'contact', text: 'Sure, go ahead.', atMs: 4200 },
      { speaker: 'agent', text: 'Great — we help teams cut cloud egress costs by around 30%. Would it be useful to see how that maps to your current setup?', atMs: 8600 },
      { speaker: 'contact', text: 'Yeah, that sounds useful. Can we set up a call with our infra lead next week?', atMs: 16300 },
      { speaker: 'agent', text: 'Absolutely — I have a slot Tuesday at 3 PM or Thursday at 11 AM your time, which works better?', atMs: 21000 },
      { speaker: 'contact', text: 'Thursday at 11 works.', atMs: 27800 },
      { speaker: 'agent', text: 'Booked — you\'ll get a calendar invite shortly. Thanks for your time!', atMs: 31500 }
    ],
    createdAt: '2026-08-24T05:16:00.000Z',
    updatedAt: '2026-08-24T05:16:00.000Z'
  },
  {
    id: 'tr-2',
    callLogId: 'call-2',
    redacted: true,
    turns: [
      { speaker: 'agent', text: 'Hi, calling from Prospectra about NeuralGlow\'s outbound tooling — got two minutes?', atMs: 0 },
      { speaker: 'contact', text: 'We\'re actually happy with our current stack right now, but thanks.', atMs: 5100 },
      { speaker: 'agent', text: 'Understood — I\'ll leave you be. Have a good one.', atMs: 8900 }
    ],
    createdAt: '2026-08-24T04:42:00.000Z',
    updatedAt: '2026-08-24T04:42:00.000Z'
  }
];

export const DEMO_CALL_SUMMARIES: CallSummary[] = [
  {
    id: 'sum-1',
    callLogId: 'call-1',
    summary: 'Warm response. Interested in cloud cost reduction. Booked a follow-up call with infra lead for Thursday 11 AM.',
    extracted: { nextStep: 'Send calendar invite', interestLevel: 'high' },
    createdAt: '2026-08-24T05:16:30.000Z',
    updatedAt: '2026-08-24T05:16:30.000Z'
  },
  {
    id: 'sum-2',
    callLogId: 'call-2',
    summary: 'Not interested — satisfied with current outbound stack. No follow-up requested.',
    extracted: { nextStep: 'None', interestLevel: 'low' },
    createdAt: '2026-08-24T04:42:20.000Z',
    updatedAt: '2026-08-24T04:42:20.000Z'
  }
];
