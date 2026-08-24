'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Plus,
  Send,
  Trash2,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconFrame } from '../IconIllustration';
import { newId } from '@/lib/workspace/store';
import type {
  DemoAudience,
  DemoCampaign,
  DemoRow,
  DemoTable,
  DemoVoiceAgent,
  WorkspaceData
} from '@/lib/workspace/store';

/* =============================================================================
   Shared: a gate banner for anything needing a provider we do not have.
   Stated once, plainly, wherever the limit actually bites.
   ============================================================================= */

function ProviderGate({ title, body }: { title: string; body: string }) {
  return (
    <Card className="border-amber-200 bg-amber-50/60">
      <CardContent className="flex gap-3 py-4">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-700" />
        <div>
          <p className="text-sm font-semibold text-amber-900">{title}</p>
          <p className="mt-1 text-sm text-amber-800/80">{body}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* =============================================================================
   Audiences — a saved slice of a table. Fully real.
   ============================================================================= */

export function AudiencesSection({
  workspaceId,
  data,
  onChange
}: {
  workspaceId: string;
  data: WorkspaceData;
  onChange: (next: WorkspaceData) => void;
}) {
  const [building, setBuilding] = useState(false);
  const [name, setName] = useState('');
  const [tableId, setTableId] = useState(data.tables[0]?.id ?? '');

  const rows: DemoRow[] = data.rows[tableId] ?? [];

  const create = () => {
    const a: DemoAudience = {
      id: newId(),
      workspaceId,
      name: name.trim() || 'Untitled audience',
      sourceTableId: tableId,
      memberIds: rows.map((r) => r.id),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onChange({ ...data, audiences: [a, ...data.audiences] });
    setBuilding(false);
    setName('');
  };

  if (building) {
    return (
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit" onClick={() => setBuilding(false)}>
          <ArrowLeft className="size-4" />
          Audiences
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Build an audience</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Manali hotels, 4★+"
                className="h-9 rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold">Source table</span>
              <select
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                className="h-9 rounded-lg border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
              >
                {data.tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({(data.rows[t.id] ?? []).length} rows)
                  </option>
                ))}
              </select>
            </label>

            <p className="text-sm text-muted-foreground">
              {rows.length} contacts will be included. Filtering a slice arrives
              with saved table views.
            </p>

            <div className="flex gap-2">
              <Button variant="brand" onClick={create} disabled={!tableId || rows.length === 0}>
                Create audience
              </Button>
              <Button variant="outline" onClick={() => setBuilding(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionHead
        title="Audiences"
        sub="A saved slice of a table, shaped for one campaign or agent."
        action={
          data.tables.length > 0 && (
            <Button variant="brand" onClick={() => setBuilding(true)}>
              <Plus className="size-4" />
              New audience
            </Button>
          )
        }
      />

      {data.tables.length === 0 ? (
        <EmptyModule
          icon="empty-audiences"
          title="No tables to build from"
          body="An audience is a slice of a table. Import a CSV first, then come back."
        />
      ) : data.audiences.length === 0 ? (
        <EmptyModule
          icon="empty-audiences"
          title="No audiences yet"
          body="Group the rows worth saying the same thing to."
          action={
            <Button variant="brand" onClick={() => setBuilding(true)}>
              Build your first audience
            </Button>
          }
        />
      ) : (
        <Card>
          <CardContent className="pt-5">
            <ul className="flex flex-col divide-y divide-border/60">
              {data.audiences.map((a) => {
                const t = data.tables.find((x) => x.id === a.sourceTableId);
                return (
                  <li key={a.id} className="flex items-center gap-3 py-3 first:pt-0">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-brand">
                      <Users className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{a.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.memberIds.length} contacts · from {t?.name ?? 'a deleted table'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${a.name}`}
                      onClick={() =>
                        onChange({
                          ...data,
                          audiences: data.audiences.filter((x) => x.id !== a.id)
                        })
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* =============================================================================
   Campaigns — real drafts. Sending is gated.
   ============================================================================= */

export function CampaignsSection({
  workspaceId,
  data,
  onChange
}: {
  workspaceId: string;
  data: WorkspaceData;
  onChange: (next: WorkspaceData) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);

  const create = () => {
    const c: DemoCampaign = {
      id: newId(),
      workspaceId,
      name: 'Untitled campaign',
      status: 'draft',
      steps: [
        {
          id: newId(),
          position: 0,
          delayDays: 0,
          subject: '',
          body: ''
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onChange({ ...data, campaigns: [c, ...data.campaigns] });
    setEditing(c.id);
  };

  const campaign = data.campaigns.find((c) => c.id === editing);

  const update = (next: DemoCampaign) =>
    onChange({
      ...data,
      campaigns: data.campaigns.map((c) => (c.id === next.id ? next : c))
    });

  if (campaign) {
    return (
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit" onClick={() => setEditing(null)}>
          <ArrowLeft className="size-4" />
          Campaigns
        </Button>

        <ProviderGate
          title="No email provider connected"
          body="You can write and save the whole sequence. Sending needs a configured provider and a verified sender address, so nothing leaves this browser."
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campaign</CardTitle>
            <Badge variant="muted">Draft</Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold">Name</span>
              <input
                value={campaign.name}
                onChange={(e) => update({ ...campaign, name: e.target.value })}
                className="h-9 rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold">Audience</span>
              <select
                value={campaign.audienceId ?? ''}
                onChange={(e) => update({ ...campaign, audienceId: e.target.value || undefined })}
                className="h-9 rounded-lg border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
              >
                <option value="">— choose —</option>
                {data.audiences.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.memberIds.length})
                  </option>
                ))}
              </select>
              {data.audiences.length === 0 && (
                <span className="text-xs text-muted-foreground">
                  Build an audience first.
                </span>
              )}
            </label>
          </CardContent>
        </Card>

        {campaign.steps.map((step, i) => (
          <Card key={step.id}>
            <CardHeader>
              <CardTitle className="text-base">
                Step {i + 1}
                {i > 0 && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    after {step.delayDays} day{step.delayDays === 1 ? '' : 's'}
                  </span>
                )}
              </CardTitle>
              {campaign.steps.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove step ${i + 1}`}
                  onClick={() =>
                    update({
                      ...campaign,
                      steps: campaign.steps.filter((s) => s.id !== step.id)
                    })
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-2">
              {i > 0 && (
                <label className="flex items-center gap-2 text-xs font-semibold">
                  Wait
                  <input
                    type="number"
                    min={0}
                    value={step.delayDays}
                    onChange={(e) =>
                      update({
                        ...campaign,
                        steps: campaign.steps.map((s) =>
                          s.id === step.id
                            ? { ...s, delayDays: Math.max(0, Number(e.target.value)) }
                            : s
                        )
                      })
                    }
                    className="h-8 w-16 rounded-lg border border-input bg-card px-2 text-sm tabular-nums outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
                  />
                  days
                </label>
              )}
              <input
                value={step.subject}
                onChange={(e) =>
                  update({
                    ...campaign,
                    steps: campaign.steps.map((s) =>
                      s.id === step.id ? { ...s, subject: e.target.value } : s
                    )
                  })
                }
                placeholder="Subject"
                className="h-9 rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
              />
              <textarea
                value={step.body}
                onChange={(e) =>
                  update({
                    ...campaign,
                    steps: campaign.steps.map((s) =>
                      s.id === step.id ? { ...s, body: e.target.value } : s
                    )
                  })
                }
                rows={5}
                placeholder="Write the message. Use {{name}} and {{company}} to personalise per row."
                className="rounded-lg border border-input bg-card p-3 text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
              />
            </CardContent>
          </Card>
        ))}

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() =>
              update({
                ...campaign,
                steps: [
                  ...campaign.steps,
                  {
                    id: newId(),
                    position: campaign.steps.length,
                    delayDays: 3,
                    subject: '',
                    body: ''
                  }
                ]
              })
            }
          >
            <Plus className="size-4" />
            Add step
          </Button>

          {/* Deliberately disabled, with the reason stated rather than implied. */}
          <Button variant="brand" disabled title="Connect an email provider to send">
            <Send className="size-4" />
            Send — needs a provider
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionHead
        title="Campaigns"
        sub="Write the sequence now; send once a provider is connected."
        action={
          <Button variant="brand" onClick={create}>
            <Plus className="size-4" />
            New draft
          </Button>
        }
      />

      {data.campaigns.length === 0 ? (
        <EmptyModule
          icon="empty-campaigns"
          title="No campaign drafts"
          body="Sketch an audience and a first message. It saves as a draft."
          action={
            <Button variant="brand" onClick={create}>
              Draft your first campaign
            </Button>
          }
        />
      ) : (
        <Card>
          <CardContent className="pt-5">
            <ul className="flex flex-col divide-y divide-border/60">
              {data.campaigns.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setEditing(c.id)}
                    className="flex w-full items-center gap-3 py-3 text-left transition hover:opacity-80"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-brand">
                      <Send className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{c.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {c.steps.length} step{c.steps.length === 1 ? '' : 's'}
                        {c.audienceId
                          ? ` · ${data.audiences.find((a) => a.id === c.audienceId)?.name ?? 'audience'}`
                          : ' · no audience yet'}
                      </span>
                    </span>
                    <Badge variant="muted">Draft</Badge>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* =============================================================================
   Voice agents — real drafts with version history. Calling is gated.
   ============================================================================= */

const VOICES = ['Rhea', 'Quinn', 'Magnus', 'Ella'];
const MODELS = ['GPT 4.1', 'Gemini Flash', 'Claude 3.7'];
const LANGS = ['English', 'Hindi', 'Spanish', 'French'];

export function VoiceSection({
  workspaceId,
  data,
  onChange
}: {
  workspaceId: string;
  data: WorkspaceData;
  onChange: (next: WorkspaceData) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const agent = data.agents.find((a) => a.id === editing);

  const [draft, setDraft] = useState({
    prompt: '',
    firstMessage: '',
    model: MODELS[0],
    languages: ['English'],
    voice: VOICES[0]
  });

  const create = () => {
    const a: DemoVoiceAgent = {
      id: newId(),
      workspaceId,
      name: 'Untitled agent',
      status: 'draft',
      versions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onChange({ ...data, agents: [a, ...data.agents] });
    setDraft({ prompt: '', firstMessage: '', model: MODELS[0], languages: ['English'], voice: VOICES[0] });
    setEditing(a.id);
  };

  if (agent) {
    const latest = agent.versions[agent.versions.length - 1];

    const saveVersion = () => {
      const next: DemoVoiceAgent = {
        ...agent,
        versions: [
          ...agent.versions,
          { ...draft, version: agent.versions.length + 1, savedAt: new Date().toISOString() }
        ],
        updatedAt: new Date().toISOString()
      };
      onChange({ ...data, agents: data.agents.map((a) => (a.id === next.id ? next : a)) });
    };

    return (
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit" onClick={() => setEditing(null)}>
          <ArrowLeft className="size-4" />
          Voice agents
        </Button>

        <ProviderGate
          title="Calling is not connected"
          body="You can write and version the agent. Placing a call needs a telephony provider, a number you own, recorded consent and a calling window — none of which exist yet, so there is no call button here."
        />

        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Agent prompt</CardTitle>
              <Badge variant="muted">Draft</Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold">Name</span>
                <input
                  value={agent.name}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      agents: data.agents.map((a) =>
                        a.id === agent.id ? { ...a, name: e.target.value } : a
                      )
                    })
                  }
                  className="h-9 rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold">Role &amp; objective</span>
                <textarea
                  rows={7}
                  value={draft.prompt}
                  onChange={(e) => setDraft({ ...draft, prompt: e.target.value })}
                  placeholder="You are Alex, calling local businesses to introduce automated booking. Qualify interest, then book a demo."
                  className="rounded-lg border border-input bg-card p-3 text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold">First message</span>
                <textarea
                  rows={2}
                  value={draft.firstMessage}
                  onChange={(e) => setDraft({ ...draft, firstMessage: e.target.value })}
                  placeholder="Hi, I noticed your business on the map — do you take bookings by phone?"
                  className="rounded-lg border border-input bg-card p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
                />
              </label>

              <Button variant="brand" className="w-fit" onClick={saveVersion} disabled={!draft.prompt.trim()}>
                <Check className="size-4" />
                Save version {agent.versions.length + 1}
              </Button>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 pt-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold">Model</span>
                  <select
                    value={draft.model}
                    onChange={(e) => setDraft({ ...draft, model: e.target.value })}
                    className="h-9 rounded-lg border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
                  >
                    {MODELS.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold">Voice</span>
                  <select
                    value={draft.voice}
                    onChange={(e) => setDraft({ ...draft, voice: e.target.value })}
                    className="h-9 rounded-lg border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
                  >
                    {VOICES.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </label>

                <fieldset className="flex flex-col gap-1.5">
                  <legend className="text-xs font-semibold">Languages</legend>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {LANGS.map((l) => (
                      <label
                        key={l}
                        className="cursor-pointer rounded-full border border-input px-3 py-1 text-xs transition has-[:checked]:border-brand has-[:checked]:bg-accent has-[:checked]:font-semibold has-[:checked]:text-brand-ink"
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={draft.languages.includes(l)}
                          onChange={() =>
                            setDraft({
                              ...draft,
                              languages: draft.languages.includes(l)
                                ? draft.languages.filter((x) => x !== l)
                                : [...draft.languages, l]
                            })
                          }
                        />
                        {l}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Version history</CardTitle>
                <span className="text-xs text-muted-foreground">{agent.versions.length}</span>
              </CardHeader>
              <CardContent className="pt-2">
                {agent.versions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nothing saved yet. Write a role and save a version.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2.5">
                    {[...agent.versions].reverse().map((v) => (
                      <li key={v.version} className="flex items-start gap-2.5">
                        <Badge variant={v === latest ? 'soft' : 'muted'}>v{v.version}</Badge>
                        <span className="min-w-0">
                          <span className="block truncate text-xs">
                            {v.voice} · {v.languages.join(', ')}
                          </span>
                          <span className="block text-[11px] text-muted-foreground">
                            {new Date(v.savedAt).toLocaleString()}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionHead
        title="Voice agents"
        sub="Draft the agent now, ready for when calling opens."
        action={
          <Button variant="brand" onClick={create}>
            <Plus className="size-4" />
            New agent
          </Button>
        }
      />

      {data.agents.length === 0 ? (
        <EmptyModule
          icon="empty-voice"
          title="No voice agents yet"
          body="Write the role and opening line. The part that takes thought is worth doing before the rest exists."
          action={
            <Button variant="brand" onClick={create}>
              Draft your first agent
            </Button>
          }
        />
      ) : (
        <Card>
          <CardContent className="pt-5">
            <ul className="flex flex-col divide-y divide-border/60">
              {data.agents.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => {
                      const last = a.versions[a.versions.length - 1];
                      setDraft(
                        last
                          ? {
                              prompt: last.prompt,
                              firstMessage: last.firstMessage,
                              model: last.model,
                              languages: last.languages,
                              voice: last.voice
                            }
                          : { prompt: '', firstMessage: '', model: MODELS[0], languages: ['English'], voice: VOICES[0] }
                      );
                      setEditing(a.id);
                    }}
                    className="flex w-full items-center gap-3 py-3 text-left transition hover:opacity-80"
                  >
                    <IconFrame name="action-voice-draft" size={38} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{a.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {a.versions.length} version{a.versions.length === 1 ? '' : 's'}
                      </span>
                    </span>
                    <Badge variant="muted">Draft</Badge>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* =============================================================================
   Shared bits
   ============================================================================= */

export function SectionHead({
  title,
  sub,
  action
}: {
  title: string;
  sub: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="font-display text-2xl font-extrabold tracking-tight">{title}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>
      </div>
      {action}
    </div>
  );
}

export function EmptyModule({
  icon,
  title,
  body,
  action
}: {
  icon: Parameters<typeof IconFrame>[0]['name'];
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
        <IconFrame name={icon} size={64} tone="lg" />
        <p className="mt-1 font-display text-lg font-bold">{title}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{body}</p>
        {action && <div className="mt-2">{action}</div>}
      </CardContent>
    </Card>
  );
}

export type { DemoTable, DemoRow };
