/**
 * Integrations directory listing — presentational only. Every item is
 * `not_connected` or `coming_soon`; none of these can be activated in this
 * frontend milestone. See docs/MOCK_DATA_BOUNDARIES.md.
 */

import type { IntegrationListing } from '../types/product';

export const INTEGRATIONS: IntegrationListing[] = [
  { id: 'salesforce', name: 'Salesforce', category: 'crm', blurb: 'Sync tables and audiences to Salesforce leads and contacts.', status: 'not_connected' },
  { id: 'hubspot', name: 'HubSpot', category: 'crm', blurb: 'Two-way sync with HubSpot CRM contacts and companies.', status: 'not_connected' },
  { id: 'pipedrive', name: 'Pipedrive', category: 'crm', blurb: 'Push enriched rows into Pipedrive as deals or people.', status: 'coming_soon' },
  { id: 'zoho', name: 'Zoho CRM', category: 'crm', blurb: 'Sync workspace tables with Zoho CRM modules.', status: 'coming_soon' },
  { id: 'attio', name: 'Attio', category: 'crm', blurb: 'Mirror Prospectra tables as Attio records.', status: 'coming_soon' },
  { id: 'clearbit', name: 'Clearbit', category: 'enrichment', blurb: 'Company and contact enrichment provider.', status: 'not_connected' },
  { id: 'apollo', name: 'Apollo', category: 'enrichment', blurb: 'B2B contact database and email-finding provider.', status: 'not_connected' },
  { id: 'hunter', name: 'Hunter.io', category: 'enrichment', blurb: 'Email-finding and verification provider.', status: 'coming_soon' },
  { id: 'openai', name: 'OpenAI', category: 'llm', blurb: 'Model provider for Claygents, formulas and voice prompts.', status: 'not_connected' },
  { id: 'anthropic', name: 'Anthropic', category: 'llm', blurb: 'Model provider for Claygents, formulas and voice prompts.', status: 'not_connected' },
  { id: 'gmail', name: 'Gmail', category: 'email', blurb: 'Send campaign emails from a connected Gmail account.', status: 'not_connected' },
  { id: 'outlook', name: 'Outlook', category: 'email', blurb: 'Send campaign emails from a connected Outlook account.', status: 'not_connected' },
  { id: 'sendgrid', name: 'SendGrid', category: 'email', blurb: 'Transactional and campaign email delivery.', status: 'coming_soon' },
  { id: 'twilio', name: 'Twilio', category: 'telephony', blurb: 'Voice and SMS provider for calling campaigns.', status: 'not_connected' },
  { id: 'vonage', name: 'Vonage', category: 'telephony', blurb: 'Alternative telephony provider for voice agents.', status: 'coming_soon' },
  { id: 'whatsapp_cloud', name: 'WhatsApp Cloud API', category: 'telephony', blurb: 'Deploy a voice agent as a WhatsApp conversation.', status: 'coming_soon' },
  { id: 's3', name: 'Amazon S3', category: 'storage', blurb: 'Store call recordings and knowledge-base files.', status: 'not_connected' },
  { id: 'gdrive', name: 'Google Drive', category: 'storage', blurb: 'Import knowledge-base documents from Drive.', status: 'coming_soon' }
];

export const INTEGRATION_CATEGORY_LABELS: Record<IntegrationListing['category'], string> = {
  crm: 'CRM',
  enrichment: 'Enrichment',
  llm: 'LLM',
  email: 'Email',
  telephony: 'Telephony',
  storage: 'Storage'
};
