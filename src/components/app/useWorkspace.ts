'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { currentUser } from '@/lib/onboarding/session';
import { readForOwner, workspaceStore } from '@/lib/onboarding/storage';
import type { WorkspaceState } from '@/lib/onboarding/types';
import { dataStore, type WorkspaceData } from '@/lib/workspace/store';
import { productStore, type ProductData } from '@/lib/demo-storage/store';

export interface WorkspaceContext {
  /** True until the auth/onboarding gate and both stores have resolved. */
  loading: boolean;
  state: WorkspaceState;
  data: WorkspaceData;
  product: ProductData;
  workspaceId: string;
  firstName: string;
  persist: (next: WorkspaceState) => Promise<void>;
  persistData: (next: WorkspaceData) => Promise<void>;
  persistProduct: (next: ProductData) => Promise<void>;
}

/**
 * The gate every `/app/*` page shares: no session → /signin, no completed
 * onboarding → /onboarding, otherwise load both local stores and hand back
 * a single context with typed persist helpers.
 *
 * Previously this logic lived inline in WorkspaceApp's single-page switcher.
 * Routes now each mount this hook directly, so the gate applies uniformly
 * without a shared client wrapper re-deriving it per page.
 */
export function useWorkspace(): WorkspaceContext | null {
  const router = useRouter();
  const [state, setState] = useState<WorkspaceState | null>(null);
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [product, setProduct] = useState<ProductData | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const user = await currentUser();
      if (cancelled) return;

      if (!user) {
        router.replace('/signin');
        return;
      }

      const saved = await readForOwner(user.id);
      if (cancelled) return;

      if (!saved || !saved.onboarding.completedAt) {
        router.replace('/onboarding');
        return;
      }

      const [d, p] = await Promise.all([dataStore.read(), productStore.read()]);
      if (cancelled) return;

      setState(saved);
      setData(d);
      setProduct(p);
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const persist = useCallback(async (next: WorkspaceState) => {
    setState(next);
    await workspaceStore.write(next);
  }, []);

  const persistData = useCallback(async (next: WorkspaceData) => {
    setData(next);
    await dataStore.write(next);
  }, []);

  const persistProduct = useCallback(async (next: ProductData) => {
    setProduct(next);
    await productStore.write(next);
  }, []);

  if (!state || !data || !product) return null;

  return {
    loading: false,
    state,
    data,
    product,
    workspaceId: state.ownerId ?? 'local',
    firstName: state.onboarding.workspaceName.trim() || 'your workspace',
    persist,
    persistData,
    persistProduct
  };
}
