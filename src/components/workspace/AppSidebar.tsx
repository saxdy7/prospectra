'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Activity,
  BarChart3,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  Cable,
  ChevronDown,
  Code2,
  Compass,
  Contact,
  FunctionSquare,
  Gauge,
  Headphones,
  Home,
  Layers,
  Lightbulb,
  LineChart,
  LogOut,
  Megaphone,
  Mic,
  MessageCircle,
  Phone,
  Puzzle,
  Radio,
  Receipt,
  Search,
  Send,
  Settings,
  Sparkle,
  Store,
  Table2,
  UploadCloud,
  Users,
  Webhook,
  Workflow,
  X
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BRAND } from '../landing/brand';
import { Logomark } from '../landing/primitives';
import { createClient } from '@/utils/supabase/client';
import { checklistFor } from '@/lib/onboarding/plan';
import type { OnboardingData } from '@/lib/onboarding/types';

/**
 * Section maturity, stated plainly in the navigation.
 *
 *   live   — a complete, real page in this build
 *   soon   — the route exists and explains what is coming, not a dead click
 *
 * Every entry opens a real page either way — this milestone finishes the
 * whole frontend, so nothing in the nav is a stub.
 */
export type Maturity = 'live' | 'soon';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  maturity: Maturity;
  /** Sub-routes shown when the parent row is expanded — e.g. Find leads' five search kinds. */
  children?: NavItem[];
}

export interface NavGroup {
  label?: string;
  /** Shown on the group's own clickable header row — omit for the ungrouped Home row. */
  icon?: LucideIcon;
  items: NavItem[];
}

/** Grouped exactly as the product brief specifies. Each labeled group is its
    own expandable row — like "Products" in a Shopify-style sidebar — so the
    whole nav reads as a tree, not a flat list under passive section labels. */
export const NAV_GROUPS: NavGroup[] = [
  { items: [{ href: '/app', label: 'Home', icon: Home, maturity: 'live' }] },
  {
    label: 'Lead workspace',
    icon: Layers,
    items: [
      {
        href: '/app/find-leads',
        label: 'Find leads',
        icon: Search,
        maturity: 'live',
        children: [
          { href: '/app/find-leads/people', label: 'People', icon: Contact, maturity: 'live' },
          { href: '/app/find-leads/companies', label: 'Companies', icon: Building2, maturity: 'live' },
          { href: '/app/find-leads/local-businesses', label: 'Local businesses', icon: Store, maturity: 'live' },
          { href: '/app/find-leads/jobs', label: 'Jobs', icon: Briefcase, maturity: 'live' },
          { href: '/app/find-leads/lookalikes', label: 'Lookalikes', icon: Compass, maturity: 'live' }
        ]
      },
      { href: '/app/tables', label: 'Tables', icon: Table2, maturity: 'live' },
      { href: '/app/imports', label: 'Imports', icon: UploadCloud, maturity: 'live' },
      { href: '/app/claygents', label: 'Claygent research', icon: Bot, maturity: 'live' },
      { href: '/app/functions', label: 'Functions', icon: FunctionSquare, maturity: 'live' },
      { href: '/app/workflows', label: 'Workflows', icon: Workflow, maturity: 'live' }
    ]
  },
  {
    label: 'Engage',
    icon: Megaphone,
    items: [
      { href: '/app/audiences', label: 'Audiences', icon: Users, maturity: 'live' },
      { href: '/app/campaigns', label: 'Campaigns', icon: Send, maturity: 'live' }
    ]
  },
  {
    label: 'Voice',
    icon: Radio,
    items: [
      { href: '/app/voice-agents', label: 'Voice agents', icon: Mic, maturity: 'live' },
      { href: '/app/voice-playground', label: 'Voice playground', icon: Headphones, maturity: 'live' },
      { href: '/app/knowledge-base', label: 'Knowledge base', icon: BookOpen, maturity: 'live' },
      { href: '/app/concurrency', label: 'Concurrency', icon: Gauge, maturity: 'live' },
      { href: '/app/phone-numbers', label: 'Phone numbers', icon: Phone, maturity: 'live' },
      { href: '/app/whatsapp', label: 'WhatsApp', icon: MessageCircle, maturity: 'live' }
    ]
  },
  {
    label: 'Monitor',
    icon: LineChart,
    items: [
      { href: '/app/analytics', label: 'Analytics', icon: BarChart3, maturity: 'live' },
      { href: '/app/activity', label: 'Activity', icon: Activity, maturity: 'live' }
    ]
  },
  {
    label: 'Developer',
    icon: Code2,
    items: [
      { href: '/app/integrations', label: 'Integrations', icon: Puzzle, maturity: 'live' },
      { href: '/app/webhooks', label: 'Webhooks', icon: Webhook, maturity: 'live' },
      { href: '/app/mcp', label: 'MCP', icon: Cable, maturity: 'live' }
    ]
  }
];

/** The trailing, unlabeled cluster — account-level pages rather than workspace tools. */
const ACCOUNT_ITEMS: NavItem[] = [
  { href: '/app/invoices', label: 'Invoices', icon: Receipt, maturity: 'live' },
  { href: '/app/settings', label: 'Settings', icon: Settings, maturity: 'live' },
  { href: '/app/help', label: 'Help', icon: BookOpen, maturity: 'live' }
];

/** Flat list, for pages that need to resolve the active label (e.g. the top bar title). */
export const NAV: NavItem[] = [...NAV_GROUPS.flatMap((g) => g.items), ...ACCOUNT_ITEMS];

/** Animated disclosure — 0fr/1fr grid-rows tween height smoothly without
    measuring the content, and collapse to truly zero height (not just
    opacity) so it never traps tab focus. Shared by group and sub-nav rows. */
function Collapsible({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div className="pa-nav__collapse" data-expanded={open}>
      <div className="pa-nav__collapse-inner">{children}</div>
    </div>
  );
}

export function AppSidebar({
  onboarding,
  checklistDone,
  open,
  onClose
}: {
  onboarding: OnboardingData;
  checklistDone: Record<string, boolean>;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const name = onboarding.workspaceName.trim() || 'Your workspace';
  const initial = name.charAt(0).toUpperCase();

  /** Home only matches the exact route; every other item matches its own subtree. */
  const isActive = (href: string) =>
    href === '/app' ? pathname === '/app' : pathname === href || pathname.startsWith(`${href}/`);

  const parentsWithChildren = NAV.filter((i) => i.children);
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(parentsWithChildren.filter((i) => isActive(i.href)).map((i) => i.href))
  );
  const toggleExpanded = (href: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });

  /** Every labeled section opens by default — matching a Shopify-style tree
      where "Products" and its siblings are all real, expandable rows rather
      than passive uppercase labels — and can be collapsed independently. */
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(NAV_GROUPS.filter((g) => g.label).map((g) => g.label as string))
  );
  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });

  const checklist = useMemo(() => checklistFor(onboarding), [onboarding]);
  const checklistTotal = checklist.length;
  const checklistDoneCount = checklist.filter((i) => checklistDone[i.id]).length;
  const checklistComplete = checklistTotal > 0 && checklistDoneCount === checklistTotal;

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/signin');
  };

  const renderItem = (item: NavItem) =>
    item.children ? (
      <li key={item.href}>
        <div className="pa-nav__item pa-nav__item--parent" aria-current={isActive(item.href) ? 'page' : undefined}>
          <Link href={item.href} className="pa-nav__parent-link" onClick={onClose}>
            <item.icon size={16} strokeWidth={1.9} />
            <span className="pa-nav__label">{item.label}</span>
          </Link>
          <button
            type="button"
            className="pa-nav__expand"
            aria-label={expanded.has(item.href) ? `Collapse ${item.label}` : `Expand ${item.label}`}
            aria-expanded={expanded.has(item.href)}
            onClick={() => toggleExpanded(item.href)}
          >
            <ChevronDown
              size={14}
              strokeWidth={2.2}
              className={expanded.has(item.href) ? 'pa-nav__expand-icon--open' : undefined}
            />
          </button>
        </div>
        <Collapsible open={expanded.has(item.href)}>
          <ul className="pa-nav pa-nav--sub">
            {item.children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className="pa-nav__item pa-nav__item--sub"
                  aria-current={isActive(child.href) ? 'page' : undefined}
                  onClick={onClose}
                >
                  <child.icon size={14} strokeWidth={1.9} />
                  <span className="pa-nav__label">{child.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Collapsible>
      </li>
    ) : (
      <li key={item.href}>
        <Link
          href={item.href}
          className="pa-nav__item"
          aria-current={isActive(item.href) ? 'page' : undefined}
          onClick={onClose}
        >
          <item.icon size={16} strokeWidth={1.9} />
          <span className="pa-nav__label">{item.label}</span>
          {item.maturity === 'soon' && <span className="pa-tag">Soon</span>}
        </Link>
      </li>
    );

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
            {!onboarding.teamSize || onboarding.teamSize === 'solo' ? 'Personal' : `Team · ${onboarding.teamSize}`}
          </span>
        </span>
      </button>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {NAV_GROUPS.map((group, i) => {
          if (!group.label) {
            // Home — a single ungrouped row, not a section of its own.
            return (
              <div className="pa-nav__group" key={`g${i}`}>
                <ul className="pa-nav">{group.items.map(renderItem)}</ul>
              </div>
            );
          }

          const isOpen = openGroups.has(group.label);
          const GroupIcon = group.icon;
          const groupActive = group.items.some((item) => isActive(item.href));

          return (
            <div className="pa-nav__group" key={group.label}>
              <button
                type="button"
                className="pa-nav__item pa-nav__group-toggle"
                aria-expanded={isOpen}
                data-parent-active={groupActive && !isOpen ? '' : undefined}
                onClick={() => toggleGroup(group.label as string)}
              >
                {GroupIcon && <GroupIcon size={16} strokeWidth={1.9} />}
                <span className="pa-nav__label">{group.label}</span>
                <ChevronDown
                  size={13}
                  strokeWidth={2.2}
                  className={`pa-nav__group-chevron${isOpen ? ' pa-nav__expand-icon--open' : ''}`}
                />
              </button>
              <Collapsible open={isOpen}>
                <ul className="pa-nav pa-nav--group-items">{group.items.map(renderItem)}</ul>
              </Collapsible>
            </div>
          );
        })}

        <div className="pa-nav__group">
          <ul className="pa-nav">{ACCOUNT_ITEMS.map(renderItem)}</ul>
        </div>
      </div>

      {!checklistComplete && (
        <Link href="/app" className="pa-getting-started" onClick={onClose}>
          <div className="pa-getting-started__head">
            <span className="pa-getting-started__title">Getting started</span>
            <span className="pa-getting-started__count">
              {checklistDoneCount} of {checklistTotal}
            </span>
          </div>
          <div className="pa-meter__track" style={{ marginTop: 8 }}>
            <div
              className="pa-meter__fill"
              style={{ width: `${checklistTotal ? (checklistDoneCount / checklistTotal) * 100 : 0}%` }}
            />
          </div>
          <ul className="pa-getting-started__list">
            {checklist.slice(0, 4).map((item) => (
              <li key={item.id} data-done={Boolean(checklistDone[item.id])}>
                <span className="pa-getting-started__dot" aria-hidden="true" />
                {item.label}
              </li>
            ))}
          </ul>
        </Link>
      )}

      <div className="pa-side__links">
        <Link href="/app/help" className="pa-side__link" onClick={onClose}>
          <Lightbulb size={14} strokeWidth={1.9} />
          Request a feature
        </Link>
        <Link href="/#pricing" className="pa-side__link pa-side__link--upgrade" onClick={onClose}>
          <Sparkle size={14} strokeWidth={1.9} />
          Upgrade
        </Link>
      </div>

      <div className="pa-side__foot">
        <div className="pa-meter">
          <div className="pa-meter__row">
            <span className="pa-meter__label">Setup credits</span>
            <span className="pa-meter__value">500</span>
          </div>
          <div className="pa-meter__track">
            <div className="pa-meter__fill" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="pa-profile">
          {profileOpen && (
            <div className="pa-profile__menu" role="menu">
              <Link className="pa-profile__item" href="/app/settings" role="menuitem" onClick={() => setProfileOpen(false)}>
                <Settings size={15} />
                Workspace settings
              </Link>
              <button type="button" className="pa-profile__item pa-profile__item--danger" role="menuitem" onClick={signOut}>
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          )}
          <button
            type="button"
            className="pa-profile__trigger"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((v) => !v)}
          >
            <span className="pa-avatar" aria-hidden="true">
              {initial}
            </span>
            <span className="pa-profile__name">{name}</span>
          </button>
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
