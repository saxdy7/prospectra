import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Refreshes the Supabase auth token on every matched request and forwards the
 * rotated cookies to both the request (for Server Components rendered in this
 * pass) and the response (for the browser).
 *
 * The `await supabase.auth.getUser()` call is the whole point of this helper —
 * it is what performs the refresh. Constructing the client alone does nothing,
 * so removing that call silently expires everyone's session.
 */
export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({ request });

  /**
   * Bail out rather than throw when the environment is not configured.
   * This middleware runs on nearly every request, so constructing a client
   * with undefined credentials would turn one missing env var into a
   * site-wide 500. Anonymous pages keep working; only auth stops.
   */
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      }
    }
  });

  // Do not remove: this is what refreshes the token.
  // Use getUser(), not getSession() — getSession() reads the cookie without
  // revalidating it against the auth server, so it can be spoofed.
  await supabase.auth.getUser();

  return supabaseResponse;
};
