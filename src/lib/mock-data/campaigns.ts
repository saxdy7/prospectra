/**
 * Demo campaigns and steps — email/voice/multi-channel outreach records.
 * These are draft/demo campaigns only; nothing here has actually sent.
 */

import type { Campaign, CampaignMember, CampaignStep } from '../types/models';

export const DEMO_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    workspaceId: 'demo',
    name: 'HyperScale — Infra cost outreach',
    channel: 'email',
    status: 'draft',
    audienceId: 'aud-1',
    createdAt: '2026-08-19T10:00:00.000Z',
    updatedAt: '2026-08-22T09:00:00.000Z'
  },
  {
    id: 'camp-2',
    workspaceId: 'demo',
    name: 'Renewal reminder — voice',
    channel: 'voice',
    status: 'scheduled',
    audienceId: 'aud-2',
    createdAt: '2026-08-15T10:00:00.000Z',
    updatedAt: '2026-08-20T09:00:00.000Z'
  },
  {
    id: 'camp-3',
    workspaceId: 'demo',
    name: 'Q3 healthcare vertical push',
    channel: 'multi',
    status: 'completed',
    audienceId: 'aud-1',
    createdAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-07-28T09:00:00.000Z'
  }
];

export const DEMO_CAMPAIGN_STEPS: CampaignStep[] = [
  { id: 'step-1', campaignId: 'camp-1', position: 0, delayDays: 0, template: { subject: 'Cutting cloud egress at {{company}}', preview: 'Quick idea on trimming your egress bill by ~30%…' }, createdAt: '2026-08-19T10:00:00.000Z', updatedAt: '2026-08-19T10:00:00.000Z' },
  { id: 'step-2', campaignId: 'camp-1', position: 1, delayDays: 3, template: { subject: 'Re: Cutting cloud egress at {{company}}', preview: 'Following up in case this got buried…' }, createdAt: '2026-08-19T10:00:00.000Z', updatedAt: '2026-08-19T10:00:00.000Z' },
  { id: 'step-3', campaignId: 'camp-1', position: 2, delayDays: 6, template: { subject: 'Last note on this', preview: 'No worries if the timing is off — closing the loop.' }, createdAt: '2026-08-19T10:00:00.000Z', updatedAt: '2026-08-19T10:00:00.000Z' }
];

export const DEMO_CAMPAIGN_MEMBERS: CampaignMember[] = [
  { id: 'cm-1', campaignId: 'camp-1', contactId: 'ct-2', state: 'active', currentStep: 1, createdAt: '2026-08-19T10:05:00.000Z', updatedAt: '2026-08-22T08:00:00.000Z' },
  { id: 'cm-2', campaignId: 'camp-1', contactId: 'ct-1', state: 'pending', currentStep: 0, createdAt: '2026-08-19T10:05:00.000Z', updatedAt: '2026-08-19T10:05:00.000Z' },
  { id: 'cm-3', campaignId: 'camp-1', contactId: 'ct-9', state: 'replied', currentStep: 1, createdAt: '2026-08-19T10:05:00.000Z', updatedAt: '2026-08-21T15:00:00.000Z' },
  { id: 'cm-4', campaignId: 'camp-1', contactId: 'ct-17', state: 'bounced', currentStep: 0, createdAt: '2026-08-19T10:05:00.000Z', updatedAt: '2026-08-20T09:00:00.000Z' }
];
