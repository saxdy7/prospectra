/**
 * Workflow templates for /app/workflows — static starter graphs. No workflow
 * actually executes in this milestone; the canvas is frontend-only.
 */

import type { Workflow } from '../types/product';

export const WORKFLOW_TEMPLATES: Omit<Workflow, 'id' | 'workspaceId' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Source → Enrich → Email',
    description: 'Run a local-business search, enrich contacts, then start an email sequence.',
    status: 'draft',
    isTemplate: true,
    nodes: [
      { id: 'n1', kind: 'trigger', label: 'Manual trigger', x: 40, y: 140 },
      { id: 'n2', kind: 'search', label: 'Search local businesses', x: 280, y: 140 },
      { id: 'n3', kind: 'enrich', label: 'Enrich contact email', x: 520, y: 140 },
      { id: 'n4', kind: 'campaign', label: 'Start email sequence', x: 760, y: 140 }
    ],
    edges: [
      { id: 'e1', fromNodeId: 'n1', toNodeId: 'n2' },
      { id: 'e2', fromNodeId: 'n2', toNodeId: 'n3' },
      { id: 'e3', fromNodeId: 'n3', toNodeId: 'n4' }
    ]
  },
  {
    name: 'New row → Claygent → Score filter → Voice call',
    description: 'Score every new row with a Claygent, filter for hot leads, then queue a voice call.',
    status: 'draft',
    isTemplate: true,
    nodes: [
      { id: 'n1', kind: 'trigger', label: 'New table row', x: 40, y: 220 },
      { id: 'n2', kind: 'claygent', label: 'Run account scoring', x: 280, y: 220 },
      { id: 'n3', kind: 'filter', label: 'Score ≥ 70', x: 520, y: 220 },
      { id: 'n4', kind: 'voice_call', label: 'Queue voice call', x: 760, y: 220 }
    ],
    edges: [
      { id: 'e1', fromNodeId: 'n1', toNodeId: 'n2' },
      { id: 'e2', fromNodeId: 'n2', toNodeId: 'n3' },
      { id: 'e3', fromNodeId: 'n3', toNodeId: 'n4' }
    ]
  },
  {
    name: 'Call completed → Webhook',
    description: 'Notify an external system whenever a voice call finishes.',
    status: 'draft',
    isTemplate: true,
    nodes: [
      { id: 'n1', kind: 'trigger', label: 'Call completed', x: 40, y: 140 },
      { id: 'n2', kind: 'delay', label: 'Wait 30s for summary', x: 280, y: 140 },
      { id: 'n3', kind: 'webhook', label: 'POST to endpoint', x: 520, y: 140 }
    ],
    edges: [
      { id: 'e1', fromNodeId: 'n1', toNodeId: 'n2' },
      { id: 'e2', fromNodeId: 'n2', toNodeId: 'n3' }
    ]
  }
];
