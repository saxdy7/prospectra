'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, LogOut, Settings } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

/**
 * The account dropdown — shared by the sidebar's bottom profile row and the
 * top header's avatar, so both are genuinely functional rather than one
 * being a decorative copy of the other. Fetches the real signed-in email
 * once per mount; never a placeholder.
 */
export function ProfileMenu({
  name,
  initial,
  onNavigate,
  align = 'up'
}: {
  name: string;
  initial: string;
  onNavigate: () => void;
  /** 'up' opens above the trigger (sidebar, near the bottom of the page);
      'down' opens below it (header, near the top). */
  align?: 'up' | 'down';
}) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (!cancelled) setEmail(data.user?.email ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/signin');
  };

  return (
    <div className={`pa-profile__menu${align === 'down' ? ' pa-profile__menu--down' : ''}`} role="menu">
      <div className="pa-profile__plan">
        <span>
          <span className="pa-profile__plan-label">Current plan</span>
          <span className="pa-profile__plan-value">Starter plan</span>
        </span>
        <Link href="/app/settings?tab=plan" className="pa-profile__upgrade" onClick={onNavigate}>
          Upgrade
        </Link>
      </div>

      <div className="pa-profile__who">
        <span className="pa-avatar" aria-hidden="true">
          {initial}
        </span>
        <span className="pa-profile__who-text">
          <span className="pa-profile__who-name">{name}</span>
          {email && <span className="pa-profile__who-email">{email}</span>}
        </span>
      </div>

      <div className="pa-profile__divider" role="separator" />

      <Link className="pa-profile__item" href="/app/settings" role="menuitem" onClick={onNavigate}>
        <Settings size={15} />
        Workspace settings
      </Link>

      <div className="pa-profile__divider" role="separator" />

      <Link className="pa-profile__item" href="/app/help" role="menuitem" onClick={onNavigate}>
        <BookOpen size={15} />
        Help &amp; resources
      </Link>

      <div className="pa-profile__divider" role="separator" />

      <button type="button" className="pa-profile__item pa-profile__item--danger" role="menuitem" onClick={signOut}>
        <LogOut size={15} />
        Sign out
      </button>
    </div>
  );
}
