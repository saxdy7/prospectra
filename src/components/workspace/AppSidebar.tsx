'use client';

import {
  BarChart3,
  Home,
  Mic,
  Search,
  Send,
  Settings,
  Table2,
  Users,
  X
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { BRAND } from '../landing/brand';
import { Logomark } from '../landing/primitives';
import type { OnboardingData } from '@/lib/onboarding/types';

/**
 * Section maturity, stated plainly in the navigation.
 *
 *   live   — something real to look at in this build
 *   soon   — designed and specified, not built
 *
 * Every entry opens a panel either way, so nothing here is a dead click.
 */
export type Maturity = 'live' | 'soon';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  maturity: Maturity;
}

export const NAV: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, maturity: 'live' },
  { id: 'find-leads', label: 'Find leads', icon: Search, maturity: 'soon' },
  { id: 'tables', label: 'Tables', icon: Table2, maturity: 'soon' },
  { id: 'campaigns', label: 'Campaigns', icon: Send, maturity: 'soon' },
  { id: 'voice', label: 'Voice agents', icon: Mic, maturity: 'soon' },
  { id: 'audiences', label: 'Audiences', icon: Users, maturity: 'soon' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, maturity: 'soon' },
  { id: 'settings', label: 'Settings', icon: Settings, maturity: 'soon' }
];

export function AppSidebar({
  active,
  onNavigate,
  onboarding,
  open,
  onClose
}: {
  active: string;
  onNavigate: (id: string) => void;
  onboarding: OnboardingData;
  open: boolean;
  onClose: () => void;
}) {
  const name = onboarding.workspaceName.trim() || 'Your workspace';
  const initial = name.charAt(0).toUpperCase();

  return (
    <nav className="pa-side" data-open={open} aria-label="Workspace">
      <div className="pa-side__brand">
        <Link className="pa-brand" href="/">
          <Logomark size={26} />
          {BRAND.name}
          <span className="pa-brand__suffix">{BRAND.suffix}</span>
        </Link>
      </div>

      {/* One workspace exists in this build, so the switcher reports the
          current one rather than offering a list that is not there. */}
      <button
        type="button"
        className="pa-switcher"
        aria-label={`Current workspace: ${name}`}
        title="Switching between workspaces arrives with team accounts"
      >
        <span className="pa-switcher__mark" aria-hidden="true">
          {onboarding.workspaceLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={onboarding.workspaceLogo} alt="" />
          ) : (
            initial
          )}
        </span>
        <span className="pa-switcher__text">
          <span className="pa-switcher__name">{name}</span>
          <span className="pa-switcher__meta">
            {!onboarding.teamSize || onboarding.teamSize === 'solo'
              ? 'Personal'
              : `Team · ${onboarding.teamSize}`}
          </span>
        </span>
      </button>

      <ul className="pa-nav">
        {NAV.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="pa-nav__item"
              aria-current={active === item.id ? 'page' : undefined}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
            >
              <item.icon size={16} strokeWidth={1.9} />
              <span className="pa-nav__label">{item.label}</span>
              {item.maturity === 'soon' && <span className="pa-tag">Soon</span>}
            </button>
          </li>
        ))}
      </ul>

      <div className="pa-side__foot">
        {/* A placeholder balance for the demo workspace — not billing data. */}
        <div className="pa-meter">
          <div className="pa-meter__row">
            <span className="pa-meter__label">Setup credits</span>
            <span className="pa-meter__value">500</span>
          </div>
          <div className="pa-meter__track">
            <div className="pa-meter__fill" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      <button
        type="button"
        className="pa-btn pa-btn--quiet"
        onClick={onClose}
        style={{ display: open ? undefined : 'none', marginTop: 10 }}
      >
        <X size={15} strokeWidth={2.2} />
        Close menu
      </button>
    </nav>
  );
}
