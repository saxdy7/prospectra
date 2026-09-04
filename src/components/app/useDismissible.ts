'use client';

import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Closes a popover-style menu the way people expect it to close: a pointer
 * press anywhere outside `ref`, or the Escape key. Used by the profile menus
 * (header and sidebar) and the workspace switcher, which previously only
 * closed by re-clicking their trigger or navigating.
 *
 * Listens on `pointerdown` rather than `click` so the menu is gone before a
 * click lands on whatever was behind it — the outside press both dismisses
 * and acts, which is the platform-native feel. Listeners attach only while
 * `open` is true, so an idle page carries no handlers.
 */
export function useDismissible(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const el = ref.current;
      if (el && e.target instanceof Node && !el.contains(e.target)) onClose();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [ref, open, onClose]);
}
