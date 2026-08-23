import { useEffect, useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Shared easing. A single custom curve across the whole page is what makes
 * separate animations read as one system rather than a pile of effects.
 */
export const EASE = 'power3.out';
export const EASE_SOFT = 'power2.out';

/** True when the visitor has asked the OS to reduce motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Runs a GSAP setup function inside a scoped context and reverts it on
 * unmount, which kills every tween and ScrollTrigger the callback created.
 * Without this, StrictMode's double-mount leaves orphaned triggers behind.
 */
export function useGsap(
  setup: (ctx: { scope: HTMLElement; reduced: boolean }) => void | (() => void),
  deps: unknown[] = []
): RefObject<HTMLDivElement> {
  const scope = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;

    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => setup({ scope: el, reduced }), el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}

/**
 * The page's one reveal recipe: elements rise and fade as they enter.
 * Staggered when several share a scope, so a grid resolves as a wave.
 *
 * Under reduced motion the elements are simply set visible — no transform,
 * no scroll listener.
 */
export function revealOnScroll(
  targets: gsap.DOMTarget,
  options: {
    trigger?: Element;
    y?: number;
    stagger?: number;
    duration?: number;
    start?: string;
    reduced?: boolean;
  } = {}
) {
  const {
    trigger,
    y = 28,
    stagger = 0.075,
    duration = 0.9,
    start = 'top 82%',
    reduced = false
  } = options;

  if (reduced) {
    gsap.set(targets, { opacity: 1, y: 0, clearProps: 'transform' });
    return;
  }

  gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: EASE,
      scrollTrigger: {
        trigger: trigger ?? (targets as Element),
        start,
        once: true
      }
    }
  );
}

/**
 * Counts a number up when it scrolls into view. Formats with a thousands
 * separator and keeps the suffix (%, +, k) pinned to the end.
 */
export function countUp(
  el: HTMLElement,
  to: number,
  options: { suffix?: string; prefix?: string; duration?: number; reduced?: boolean } = {}
) {
  const { suffix = '', prefix = '', duration = 1.6, reduced = false } = options;
  const render = (v: number) => {
    el.textContent = prefix + Math.round(v).toLocaleString('en-US') + suffix;
  };

  if (reduced) {
    render(to);
    return;
  }

  const counter = { v: 0 };
  gsap.to(counter, {
    v: to,
    duration,
    ease: 'power2.out',
    onUpdate: () => render(counter.v),
    scrollTrigger: { trigger: el, start: 'top 88%', once: true }
  });
}

/**
 * Site-wide smooth scroll. Lenis owns the raf loop (driven through GSAP's
 * ticker, not its own, so ScrollTrigger and Lenis never fall a frame out of
 * sync) and reports every scroll tick back to ScrollTrigger.
 *
 * Skipped entirely under reduced motion — a smoothed, inertial scroll is
 * exactly the kind of motion that setting exists to opt out of.
 */
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.11, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);
}

export { gsap, ScrollTrigger };
