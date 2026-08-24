'use client';

import { createClient } from '@/utils/supabase/client';
import type { WorkspaceState } from './types';

/**
 * Push a finished workspace to Supabase.
 *
 * localStorage stays the live store for the in-progress flow — it is instant
 * and survives a refresh without a round trip. This runs at the *finish* line
 * to write the meaningful record (who, and what they chose) into the database
 * so it is queryable, e.g. joined against auth.users by email.
 *
 * It is deliberately best-effort and never throws to its caller:
 *   · No session (e.g. the project requires email confirmation and the user
 *     has not confirmed yet) → returns { ok:false, reason:'not-authenticated' }
 *     and the answers remain safely in localStorage.
 *   · Any Postgres/RLS error → returned as reason, not thrown.
 *
 * All writes go through the browser client, so they run as the signed-in user
 * and are constrained by the row-level-security policies on these tables — a
 * user can only ever write their own workspace.
 */
export async function syncWorkspaceToSupabase(
  state: WorkspaceState
): Promise<{ ok: boolean; reason?: string; workspaceId?: string }> {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: 'not-authenticated' };

  const o = state.onboarding;
  const name = o.workspaceName.trim() || 'My workspace';

  // One workspace per user in this milestone: reuse the existing row if any.
  const { data: existing, error: selErr } = await supabase
    .from('workspaces')
    .select('id')
    .eq('owner_id', user.id)
    .limit(1)
    .maybeSingle();
  if (selErr) return { ok: false, reason: selErr.message };

  let workspaceId = existing?.id as string | undefined;

  if (!workspaceId) {
    const { data: inserted, error } = await supabase
      .from('workspaces')
      .insert({
        owner_id: user.id,
        name,
        logo_url: o.workspaceLogo,
        team_size: o.teamSize ?? null
      })
      .select('id')
      .single();
    if (error) return { ok: false, reason: error.message };
    workspaceId = inserted.id as string;
  } else {
    const { error } = await supabase
      .from('workspaces')
      .update({
        name,
        logo_url: o.workspaceLogo,
        team_size: o.teamSize ?? null,
        updated_at: new Date().toISOString()
      })
      .eq('id', workspaceId);
    if (error) return { ok: false, reason: error.message };
  }

  const { error: onbErr } = await supabase.from('workspace_onboarding').upsert({
    workspace_id: workspaceId,
    version: o.version,
    step: state.onboardingStep,
    goal: o.goal ?? null,
    data_source: o.dataSource ?? null,
    crm_intent: o.crmIntent,
    prepare: o.prepare,
    calling: o.calling,
    completed_at: o.completedAt ?? null,
    updated_at: new Date().toISOString()
  });
  if (onbErr) return { ok: false, reason: onbErr.message };

  const rows = Object.entries(state.checklistDone).map(([item_id, done]) => ({
    workspace_id: workspaceId,
    item_id,
    done
  }));
  if (rows.length) {
    const { error: chkErr } = await supabase.from('workspace_checklist').upsert(rows);
    if (chkErr) return { ok: false, reason: chkErr.message };
  }

  return { ok: true, workspaceId };
}
