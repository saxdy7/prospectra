'use client';

import { useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, Check, Trash2, Upload } from 'lucide-react';
import { PageHeader, DemoTag, ConfirmDialog, useToast } from '@/components/app';
import { TextField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { LOGO_RULES, TEAM_SIZES } from '@/lib/onboarding/config';
import type { TeamSize } from '@/lib/onboarding/types';
import { dataStore } from '@/lib/workspace/store';

/** Same three tiers as the landing pricing section (src/components/landing/Pricing.tsx) —
    kept as a small local copy since that component is wired to the landing page's own
    scroll-triggered motion setup, not something this settings panel should depend on. */
const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 0,
    yearly: 0,
    tagline: 'For teams taking their first steps with Prospectra.',
    features: ['Up to 500 rows in the workspace', '50 enrichment credits / month', 'Google Maps sourcing', '1 voice agent, trial minutes', 'Community support']
  },
  {
    id: 'growth',
    name: 'Growth',
    monthly: 2499,
    yearly: 1999,
    featured: true,
    tagline: 'For founders and small teams who need more reach and freedom.',
    features: ['Up to 3 workspaces', 'Up to 25,000 rows in the workspace', '5,000 enrichment credits / month', 'Full waterfall enrichment', '3 voice agents, multilingual calling', 'Unlimited email sequences', 'Priority support']
  },
  {
    id: 'scale',
    name: 'Scale',
    monthly: 7999,
    yearly: 6399,
    tagline: 'For agencies and sales floors running outbound at volume.',
    features: ['Unlimited workspaces', 'Unlimited rows', '25,000 enrichment credits / month', 'AI web researcher & auto-icebreakers', 'Unlimited voice agents', 'PII-safe transcripts & audit logs', 'Dedicated success manager']
  }
];

const NAV_GROUPS: { label: string; items: { id: string; label: string }[] }[] = [
  {
    label: 'Account',
    items: [
      { id: 'general', label: 'General' },
      { id: 'plan', label: 'Plan' },
      { id: 'credits', label: 'Credits' },
      { id: 'members', label: 'Members' }
    ]
  },
  {
    label: 'Workspace',
    items: [
      { id: 'branding', label: 'Branding' },
      { id: 'notifications', label: 'Notifications' }
    ]
  },
  {
    label: 'Security',
    items: [{ id: 'security', label: 'Security' }]
  }
];

const VALID_TABS = NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id));

export default function SettingsPage() {
  const ctx = useWorkspace();
  const { push } = useToast();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const [tab, setTab] = useState(() => (requestedTab && VALID_TABS.includes(requestedTab) ? requestedTab : 'general'));
  const [yearly, setYearly] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState<string>();
  const [confirmReset, setConfirmReset] = useState(false);

  if (!ctx) return <PageSkeleton />;

  const { state, persist } = ctx;
  const o = state.onboarding;

  const patch = async (next: Partial<typeof o>) => {
    await persist({ ...state, onboarding: { ...o, ...next } });
    push('Saved', 'success');
  };

  const pickLogo = (file: File | undefined) => {
    if (!file) return;
    setLogoError(undefined);
    if (!LOGO_RULES.accept.includes(file.type as (typeof LOGO_RULES.accept)[number])) {
      setLogoError('Use PNG, JPG, SVG or WebP.');
      return;
    }
    if (file.size > LOGO_RULES.maxBytes) {
      setLogoError(`That image is ${Math.round(file.size / 1024)} KB. Keep it under 512 KB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => patch({ workspaceLogo: typeof reader.result === 'string' ? reader.result : null });
    reader.onerror = () => setLogoError('That file could not be read.');
    reader.readAsDataURL(file);
  };

  const resetData = async () => {
    await dataStore.clear();
    push('Workspace data reset', 'success');
    window.location.reload();
  };

  return (
    <>
      <PageHeader title="Settings" description="Workspace details. Changes save as you make them." />

      <div className="pa-settings">
        <nav className="pa-settings__nav" aria-label="Settings sections">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="pa-settings__nav-group">
              <p className="pa-settings__nav-label">{group.label}</p>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="pa-settings__nav-item"
                  aria-current={tab === item.id ? 'page' : undefined}
                  onClick={() => setTab(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="pa-settings__content">
      {tab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>
          <div className="pa-panel">
            <p className="pa-h3" style={{ marginBottom: 16 }}>
              Workspace
            </p>
            <TextField label="Name" value={o.workspaceName} onChange={(e) => patch({ workspaceName: e.target.value })} />

            <div className="pa-field">
              <label className="pa-label">Image</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    display: 'grid',
                    placeItems: 'center',
                    overflow: 'hidden',
                    background: 'rgba(40,95,255,.1)',
                    color: 'var(--lp-blue-mid)',
                    flexShrink: 0
                  }}
                >
                  {o.workspaceLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={o.workspaceLogo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    (o.workspaceName.trim() || 'P').charAt(0).toUpperCase()
                  )}
                </span>
                <div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="pa-btn pa-btn--ghost" style={{ height: 34, padding: '0 12px' }} onClick={() => fileRef.current?.click()}>
                      <Upload size={13} />
                      {o.workspaceLogo ? 'Replace' : 'Upload'}
                    </button>
                    {o.workspaceLogo && (
                      <button className="pa-btn pa-btn--quiet" style={{ height: 34 }} onClick={() => patch({ workspaceLogo: null })}>
                        Remove
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)', marginTop: 6 }}>{LOGO_RULES.label}</p>
                  {logoError && <p className="pa-error">{logoError}</p>}
                </div>
              </div>
              <input ref={fileRef} type="file" accept={LOGO_RULES.accept.join(',')} className="pa-sr" onChange={(e) => pickLogo(e.target.files?.[0])} />
            </div>

            <fieldset>
              <legend className="pa-label" style={{ marginBottom: 8 }}>
                Team size
              </legend>
              <div className="pa-chips">
                {TEAM_SIZES.map((t) => (
                  <label key={t.id} className="pa-chip">
                    <input type="radio" name="team-size" checked={o.teamSize === t.id} onChange={() => patch({ teamSize: t.id as TeamSize })} />
                    {t.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="pa-panel" style={{ borderColor: 'rgba(200,50,75,.3)' }}>
            <p className="pa-h3" style={{ marginBottom: 8, color: '#ff8a8a' }}>
              Reset workspace data
            </p>
            <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)', marginBottom: 14 }}>
              Deletes every table, row, audience, campaign draft and voice agent in this browser. Your
              account and workspace settings are untouched. This cannot be undone.
            </p>
            <button className="pa-btn pa-btn--ghost" style={{ color: '#ff8a8a', borderColor: 'rgba(255,122,122,.3)' }} onClick={() => setConfirmReset(true)}>
              <Trash2 size={14} />
              Reset data
            </button>
          </div>
        </div>
      )}

      {tab === 'plan' && (
        <div style={{ maxWidth: 900 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
            <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)' }}>
              You&apos;re on Starter. Payments aren&apos;t connected yet — upgrading here takes you to the
              same plans on our site. <DemoTag kind="not-connected" />
            </p>
            <div className="pa-segment" role="tablist" aria-label="Billing period" style={{ flexShrink: 0 }}>
              <button type="button" className="pa-segment__item" data-active={!yearly || undefined} onClick={() => setYearly(false)}>
                Monthly
              </button>
              <button type="button" className="pa-segment__item" data-active={yearly || undefined} onClick={() => setYearly(true)}>
                Yearly <span style={{ opacity: 0.7 }}>· save 20%</span>
              </button>
            </div>
          </div>

          <div className="pa-grid pa-grid--two" style={{ marginTop: 0, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {PLANS.map((plan) => {
              const price = yearly ? plan.yearly : plan.monthly;
              const isCurrent = plan.id === 'starter';
              return (
                <div
                  key={plan.id}
                  className="pa-panel"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderColor: plan.featured ? 'var(--lp-blue-core)' : undefined,
                    boxShadow: plan.featured ? '0 0 0 1px var(--lp-blue-core)' : undefined
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <p className="pa-h3" style={{ margin: 0 }}>
                      {plan.name}
                    </p>
                    {plan.featured && <span className="pa-tag pa-tag--live">Popular</span>}
                    {isCurrent && <DemoTag kind="demo" label="Current plan" />}
                  </div>
                  <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)', marginBottom: 14, minHeight: 32 }}>
                    {plan.tagline}
                  </p>
                  <p style={{ marginBottom: 14 }}>
                    <span className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--lp-text)' }}>
                      {price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`}
                    </span>
                    {price > 0 && <span style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)' }}> /mo</span>}
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, flex: 1 }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-soft)' }}>
                        <Check size={13} strokeWidth={3} style={{ marginTop: 3, flexShrink: 0, color: 'var(--lp-blue-mid)' }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <button className="pa-btn pa-btn--ghost" disabled>
                      Current plan
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="pa-btn"
                      onClick={() => push(`Billing isn't connected yet — this is where you'd upgrade to ${plan.name} once payments are set up.`, 'success')}
                    >
                      Upgrade to {plan.name}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'members' && (
        <div className="pa-panel" style={{ maxWidth: 560 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <p className="pa-h3" style={{ margin: 0 }}>
              Team
            </p>
            <DemoTag kind="coming-soon" />
          </div>
          <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)', lineHeight: 1.6 }}>
            Inviting teammates and setting their access needs the members table and role policies,
            which are written but not yet applied to the database. Until then a workspace has exactly
            one member: you.
          </p>
        </div>
      )}

      {tab === 'branding' && (
        <div className="pa-panel" style={{ maxWidth: 560 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <p className="pa-h3" style={{ margin: 0 }}>
              Branding
            </p>
            <DemoTag kind="coming-soon" />
          </div>
          <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)', lineHeight: 1.6 }}>
            Custom colours for the widget and voice-agent test link, plus a custom sending domain for
            email campaigns, arrive once those providers are connected.
          </p>
        </div>
      )}

      {tab === 'security' && (
        <div className="pa-panel" style={{ maxWidth: 560 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <p className="pa-h3" style={{ margin: 0 }}>
              Security
            </p>
            <DemoTag kind="coming-soon" />
          </div>
          <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)', lineHeight: 1.6 }}>
            Two-factor authentication, session management, and API key rotation live here once account
            security settings move off Supabase defaults.
          </p>
        </div>
      )}

      {tab === 'credits' && (
        <div className="pa-panel" style={{ maxWidth: 560 }}>
          <p className="pa-h3" style={{ marginBottom: 10 }}>
            Credits
          </p>
          <div className="pa-meter" style={{ padding: 0, marginBottom: 14 }}>
            <div className="pa-meter__row">
              <span className="pa-meter__label">Setup credits</span>
              <span className="pa-meter__value">500 / 500</span>
            </div>
            <div className="pa-meter__track">
              <div className="pa-meter__fill" style={{ width: '100%' }} />
            </div>
          </div>
          <p style={{ fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)' }}>
            Every workspace starts with 500 free credits. Usage-based billing and top-ups activate once
            payments are connected. <DemoTag kind="coming-soon" />
          </p>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="pa-panel" style={{ maxWidth: 560 }}>
          <p className="pa-h3" style={{ marginBottom: 14 }}>
            Notifications
          </p>
          {['Search finished', 'Import finished', 'Campaign draft ready to review', 'Weekly summary'].map((n) => (
            <label key={n} className="pa-choice" style={{ marginBottom: 8 }}>
              <input type="checkbox" className="pa-choice__input" defaultChecked />
              <span className="pa-choice__text">
                <span className="pa-choice__label">{n}</span>
              </span>
              <span className="pa-choice__mark">
                <Check size={12} strokeWidth={3.4} />
              </span>
            </label>
          ))}
          <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)', marginTop: 10, display: 'flex', gap: 6 }}>
            <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
            Delivery needs a connected email address — these preferences save now and apply once one is.
          </p>
        </div>
      )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={resetData}
        title="Delete all workspace data?"
        description={`This deletes every table, row, audience, campaign and voice agent in "${o.workspaceName.trim() || 'this workspace'}". This cannot be undone.`}
        confirmLabel="Delete everything"
      />
    </>
  );
}
