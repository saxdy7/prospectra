import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Landing point for email links — signup confirmation and password recovery.
 *
 * Supabase sends the user here with a one-time `code`, which is exchanged for
 * a session and written to cookies. Without this route those links dead-end
 * and a confirmed account can never actually sign in.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  /**
   * Only allow relative redirects. `next` arrives from a URL, so accepting an
   * absolute one would let a crafted link bounce a freshly authenticated user
   * to an attacker's site.
   */
  const requested = searchParams.get('next') ?? '/app';
  const next =
    requested.startsWith('/') && !requested.startsWith('//') ? requested : '/app';

  if (!code) {
    return NextResponse.redirect(`${origin}/signin?error=missing_code`);
  }

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/signin?error=link_expired`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
