/**
 * Demo companies — used to illustrate the company-search builder, audiences,
 * and campaign member lists. Fictional companies; no real business is
 * represented. Every consumer of this file must label it as demo/preview
 * data — see docs/MOCK_DATA_BOUNDARIES.md.
 */

import type { Company } from '../types/models';

export interface DemoCompanyDisplay extends Company {
  logoInitial: string;
  employeeRange: string;
}

const stamp = { createdAt: '2026-07-02T09:00:00.000Z', updatedAt: '2026-07-02T09:00:00.000Z' };

export const DEMO_COMPANIES: DemoCompanyDisplay[] = [
  { id: 'co-1', workspaceId: 'demo', name: 'HyperScale Cloud', domain: 'hyperscale.io', industry: 'Cloud Infrastructure', headcount: 420, location: 'Bengaluru, IN', logoInitial: 'H', employeeRange: '201-500', provenance: { source: 'search', provider: 'demo' }, ...stamp },
  { id: 'co-2', workspaceId: 'demo', name: 'NeuralGlow AI', domain: 'neuralglow.ai', industry: 'Artificial Intelligence', headcount: 85, location: 'San Francisco, US', logoInitial: 'N', employeeRange: '51-200', provenance: { source: 'search', provider: 'demo' }, ...stamp },
  { id: 'co-3', workspaceId: 'demo', name: 'Cedar & Co', domain: 'cedarand.co', industry: 'Management Consulting', headcount: 34, location: 'London, UK', logoInitial: 'C', employeeRange: '11-50', provenance: { source: 'search', provider: 'demo' }, ...stamp },
  { id: 'co-4', workspaceId: 'demo', name: 'Rupee Ledger', domain: 'rupeeledger.in', industry: 'Fintech', headcount: 260, location: 'Mumbai, IN', logoInitial: 'R', employeeRange: '201-500', provenance: { source: 'search', provider: 'demo' }, ...stamp },
  { id: 'co-5', workspaceId: 'demo', name: 'Northwind Logistics', domain: 'northwindlog.com', industry: 'Logistics', headcount: 1200, location: 'Toronto, CA', logoInitial: 'N', employeeRange: '501-1000', provenance: { source: 'search', provider: 'demo' }, ...stamp },
  { id: 'co-6', workspaceId: 'demo', name: 'Vertex Biosciences', domain: 'vertexbio.com', industry: 'Biotechnology', headcount: 190, location: 'Boston, US', logoInitial: 'V', employeeRange: '51-200', provenance: { source: 'search', provider: 'demo' }, ...stamp },
  { id: 'co-7', workspaceId: 'demo', name: 'Sundial Robotics', domain: 'sundialrobotics.com', industry: 'Robotics', headcount: 58, location: 'Pune, IN', logoInitial: 'S', employeeRange: '51-200', provenance: { source: 'search', provider: 'demo' }, ...stamp },
  { id: 'co-8', workspaceId: 'demo', name: 'Meridian Health Group', domain: 'meridianhealth.com', industry: 'Healthcare', headcount: 3400, location: 'Chicago, US', logoInitial: 'M', employeeRange: '1000+', provenance: { source: 'search', provider: 'demo' }, ...stamp },
  { id: 'co-9', workspaceId: 'demo', name: 'Loop Commerce', domain: 'loopcommerce.io', industry: 'E-commerce', headcount: 130, location: 'Singapore, SG', logoInitial: 'L', employeeRange: '51-200', provenance: { source: 'search', provider: 'demo' }, ...stamp },
  { id: 'co-10', workspaceId: 'demo', name: 'Terracore Materials', domain: 'terracore.com', industry: 'Manufacturing', headcount: 890, location: 'Ahmedabad, IN', logoInitial: 'T', employeeRange: '501-1000', provenance: { source: 'search', provider: 'demo' }, ...stamp },
  { id: 'co-11', workspaceId: 'demo', name: 'Halcyon Studios', domain: 'halcyonstudios.co', industry: 'Media & Entertainment', headcount: 42, location: 'Berlin, DE', logoInitial: 'H', employeeRange: '11-50', provenance: { source: 'search', provider: 'demo' }, ...stamp },
  { id: 'co-12', workspaceId: 'demo', name: 'Palm & Fern Realty', domain: 'palmfern.com', industry: 'Real Estate', headcount: 76, location: 'Dubai, AE', logoInitial: 'P', employeeRange: '51-200', provenance: { source: 'search', provider: 'demo' }, ...stamp },
  { id: 'co-13', workspaceId: 'demo', name: 'Orbital Freight', domain: 'orbitalfreight.com', industry: 'Logistics', headcount: 310, location: 'Austin, US', logoInitial: 'O', employeeRange: '201-500', provenance: { source: 'search', provider: 'demo' }, ...stamp },
  { id: 'co-14', workspaceId: 'demo', name: 'Indigo Fabrics', domain: 'indigofabrics.in', industry: 'Textiles', headcount: 540, location: 'Jaipur, IN', logoInitial: 'I', employeeRange: '501-1000', provenance: { source: 'search', provider: 'demo' }, ...stamp },
  { id: 'co-15', workspaceId: 'demo', name: 'Kestrel Analytics', domain: 'kestrelanalytics.com', industry: 'Data & Analytics', headcount: 68, location: 'Sydney, AU', logoInitial: 'K', employeeRange: '51-200', provenance: { source: 'search', provider: 'demo' }, ...stamp },
  { id: 'co-16', workspaceId: 'demo', name: 'Southbank Capital', domain: 'southbankcap.com', industry: 'Financial Services', headcount: 220, location: 'Hyderabad, IN', logoInitial: 'S', employeeRange: '201-500', provenance: { source: 'search', provider: 'demo' }, ...stamp },
  { id: 'co-17', workspaceId: 'demo', name: 'Bramblewood Foods', domain: 'bramblewood.com', industry: 'Consumer Goods', headcount: 410, location: 'Chennai, IN', logoInitial: 'B', employeeRange: '201-500', provenance: { source: 'search', provider: 'demo' }, ...stamp },
  { id: 'co-18', workspaceId: 'demo', name: 'Arcline Semiconductors', domain: 'arcline.com', industry: 'Semiconductors', headcount: 1650, location: 'Delhi NCR, IN', logoInitial: 'A', employeeRange: '1000+', provenance: { source: 'search', provider: 'demo' }, ...stamp }
];
