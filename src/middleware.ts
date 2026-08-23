import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /**
     * Every path except the ones that never carry a session:
     *   _next/static     build assets
     *   _next/image      the image optimiser
     *   favicon.ico      the tab icon
     *   static image files
     *
     * Narrowing this matters — running auth on every asset request costs a
     * round trip to the auth server per file.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?)$).*)'
  ]
};
