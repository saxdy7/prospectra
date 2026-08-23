'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { OnboardingFlow } from '@/components/workspace/OnboardingFlow';

/**
 * Resolves a name to prefill the workspace field with, then hands off.
 *
 * The lookup is best-effort and never blocks: signup stores `full_name` in
 * user metadata, but the account may not be confirmed yet, Supabase may not be
 * configured on this deployment, or the request may simply fail. In every one
 * of those cases the flow still opens, just without a suggested name.
 */
export function OnboardingEntry() {
  const [suggestedName, setSuggestedName] = useState<string>();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const finish = (name?: string) => {
      if (cancelled) return;
      setSuggestedName(name);
      setChecked(true);
    };

    try {
      createClient()
        .auth.getUser()
        .then(({ data }) => {
          const meta = data.user?.user_metadata as { full_name?: string } | undefined;
          finish(typeof meta?.full_name === 'string' ? meta.full_name : undefined);
        })
        .catch(() => finish());
    } catch {
      /* Missing Supabase env vars throw at construction rather than on the
         promise, so the synchronous path needs catching too. */
      finish();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  /* Waiting one tick avoids mounting the flow with an empty name and then
     overwriting whatever the user has already typed. */
  if (!checked) return null;

  return <OnboardingFlow suggestedName={suggestedName} />;
}
