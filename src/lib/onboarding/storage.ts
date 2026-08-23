import {
  ONBOARDING_VERSION,
  emptyWorkspaceState,
  type WorkspaceState
} from './types';

/**
 * Persistence seam.
 *
 * Every read and write in the onboarding and workspace UI goes through this
 * interface, and every method is async even though the localStorage
 * implementation is synchronous. That is deliberate: swapping in Supabase
 * later becomes a new implementation of this interface plus one line in
 * `workspaceStore`, with no component changes and no new awaits to thread
 * through the call sites.
 */
export interface WorkspaceStore {
  read(): Promise<WorkspaceState | null>;
  write(state: WorkspaceState): Promise<void>;
  clear(): Promise<void>;
}

/** Namespaced so it cannot collide with anything else on the origin. */
export const STORAGE_KEY = 'prospectra:workspace:v1';

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Narrow an unknown parsed blob back to WorkspaceState.
 *
 * Anything written by an older build, hand-edited, or corrupted is discarded
 * rather than partially trusted — a half-valid object would surface as a
 * crash deep inside a step component instead of here.
 */
function reviveState(raw: unknown): WorkspaceState | null {
  if (typeof raw !== 'object' || raw === null) return null;

  const candidate = raw as Partial<WorkspaceState>;
  const onboarding = candidate.onboarding;

  if (typeof onboarding !== 'object' || onboarding === null) return null;
  if (onboarding.version !== ONBOARDING_VERSION) return null;
  if (typeof onboarding.workspaceName !== 'string') return null;

  const base = emptyWorkspaceState();

  return {
    onboarding: {
      ...base.onboarding,
      ...onboarding,
      /* Array fields are the ones most likely to arrive as null from an
         older shape, and every consumer maps over them. */
      crmIntent: Array.isArray(onboarding.crmIntent) ? onboarding.crmIntent : [],
      prepare: Array.isArray(onboarding.prepare) ? onboarding.prepare : [],
      calling: {
        ...base.onboarding.calling,
        ...(onboarding.calling ?? {}),
        interests: Array.isArray(onboarding.calling?.interests)
          ? onboarding.calling.interests
          : []
      }
    },
    checklistDone:
      typeof candidate.checklistDone === 'object' && candidate.checklistDone !== null
        ? candidate.checklistDone
        : {},
    checklistDismissed: candidate.checklistDismissed === true
  };
}

/**
 * localStorage-backed store used for this demo milestone.
 *
 * TODO(backend): replace with a Supabase-backed store once `workspaces` and
 * `workspace_onboarding` exist. See the migration notes in the task summary —
 * the interface above is the only contract callers depend on.
 */
export const localWorkspaceStore: WorkspaceStore = {
  async read() {
    if (!isBrowser()) return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return reviveState(JSON.parse(raw));
    } catch {
      /* Private-mode denials and malformed JSON both land here. Treating it
         as "no saved workspace" degrades to a fresh flow rather than a crash. */
      return null;
    }
  },

  async write(state) {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* Quota exceeded or storage disabled. The flow stays usable in-memory
         for this session; only persistence across reloads is lost. */
    }
  },

  async clear() {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Nothing actionable — see write(). */
    }
  }
};

/** The single instance the app talks to. Swap this to change backends. */
export const workspaceStore: WorkspaceStore = localWorkspaceStore;
