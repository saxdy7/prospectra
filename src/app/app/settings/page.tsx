'use client';

import { useRef, useState } from 'react';
import { AlertTriangle, Check, Trash2, Upload } from 'lucide-react';
import { PageHeader, Tabs, DemoTag, ConfirmDialog, useToast } from '@/components/app';
import { TextField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { LOGO_RULES, TEAM_SIZES } from '@/lib/onboarding/config';
import type { TeamSize } from '@/lib/onboarding/types';
import { dataStore } from '@/lib/workspace/store';

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'members', label: 'Members' },
  { id: 'branding', label: 'Branding' },
  { id: 'security', label: 'Security' },
  { id: 'credits', label: 'Credits' },
  { id: 'notifications', label: 'Notifications' }
];

export default function SettingsPage() {
  const ctx = useWorkspace();
  const { push } = useToast();
  const [tab, setTab] = useState('general');
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
      <PageHeader title="Settings" description="Workspace details. Changes save as you make them." tabs={<Tabs items={TABS} active={tab} onChange={setTab} />} />

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
