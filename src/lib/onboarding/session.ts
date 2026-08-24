'use client';

import { createClient } from '@/utils/supabase/client';

export interface SessionUser {
  id: string;
  name?: string;
}

/**
 * The signed-in user, or null. Reads through the browser Supabase client, so
 * it reflects the current session cookie. `getUser()` (not `getSession()`)
 * revalidates against the auth server rather than trusting the cookie.
 */
export async function currentUser(): Promise<SessionUser | null> {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;

  const meta = user.user_metadata as { full_name?: string } | undefined;
  return { id: user.id, name: meta?.full_name };
}
