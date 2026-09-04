'use client';

import { useCallback, useRef, useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Moon, Sparkles, Sun } from 'lucide-react';
import { AppSidebar, NAV } from '@/components/workspace/AppSidebar';
import { AiAssistant } from './AiAssistant';
import { PageSkeleton } from './Skeleton';
import { ProfileMenu } from './ProfileMenu';
import { ToastProvider } from './Toast';
import { useDismissible } from './useDismissible';
import { useWorkspace } from './useWorkspace';
import { preferences } from '@/lib/demo-storage/preferences';
import '@/components/landing/landing.css';
import '@/components/workspace/workspace.css';

/**
 * The shared shell for every `/app/*` route: sidebar, compact top bar, and
 * the content well. Mounted once by `src/app/app/layout.tsx` so every nested
 * page only has to render its own content — the auth/onboarding gate, the
 * mobile drawer, and the toast portal all live here.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const closeProfile = useCallback(() => setProfileOpen(false), []);
  useDismissible(profileRef, profileOpen, closeProfile);
  const ctx = useWorkspace();

  /* Server and first paint always see 'dark' — the product default;
     useSyncExternalStore swaps in the persisted choice right after
     hydration and re-renders whenever the toggle below calls
     preferences.setTheme(). Light stays available, but only as an
     explicit, remembered opt-in — never the initial presentation. */
  const theme = useSyncExternalStore(
    preferences.subscribeTheme,
    preferences.getTheme,
    preferences.getThemeServerSnapshot
  );

  const toggleTheme = () => {
    preferences.setTheme(theme === 'light' ? 'dark' : 'light');
  };

  /* Longest-prefix match against the flat nav, so a nested route like
     /app/tables/abc123 still shows "Tables" in the compact top-bar title. */
  const activeNav = [...NAV]
    .sort((a, b) => b.href.length - a.href.length)
    .find((n) => (n.href === '/app' ? pathname === '/app' : pathname.startsWith(n.href)));

  if (!ctx) {
    return (
      <div className="lp pa" data-theme={theme}>
        <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 900, padding: 24 }}>
            <PageSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="lp pa" data-theme={theme}>
        <div className="pa-app">
          {menuOpen && (
            <button
              className="pa-scrim"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            />
          )}

          <AppSidebar
            onboarding={ctx.state.onboarding}
            checklistDone={ctx.state.checklistDone}
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
          />

          <div className="pa-main">
            <header className="pa-top">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <button
                  type="button"
                  className="pa-burger"
                  aria-label="Open menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen(true)}
                >
                  <Menu size={18} />
                </button>
                <h1 className="pa-top__title">{activeNav?.label ?? 'Workspace'}</h1>
              </div>

              <div className="pa-top__right">
                <Link href="/app/settings?tab=credits" className="pa-credits">
                  <Sparkles size={13} strokeWidth={2} />
                  <b>500</b> setup credits
                </Link>
                <button
                  type="button"
                  className="pa-icon-btn pa-icon-btn--round"
                  aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                </button>
                <div className="pa-profile pa-profile--header" ref={profileRef}>
                  {profileOpen && (
                    <ProfileMenu
                      name={ctx.firstName}
                      initial={ctx.firstName.charAt(0).toUpperCase()}
                      align="down"
                      onNavigate={closeProfile}
                    />
                  )}
                  <button
                    type="button"
                    className="pa-avatar pa-avatar--button"
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                    aria-label="Account menu"
                    onClick={() => setProfileOpen((v) => !v)}
                  >
                    {ctx.firstName.charAt(0).toUpperCase()}
                  </button>
                </div>
              </div>
            </header>

            <main className="pa-content">{children}</main>
          </div>
        </div>

        <AiAssistant />
      </div>
    </ToastProvider>
  );
}
