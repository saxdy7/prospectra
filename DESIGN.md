# Prospectra — Landing Page Design

Reference doc for the design system implemented in `src/landing/`. Scoped
entirely under the `.lp` class so it never leaks into other parts of the app.

## Brand

Single source of truth: `src/landing/brand.ts`.

| | |
|---|---|
| Wordmark | **Prospectra** + lighter `.ai` suffix |
| Tagline | Find every lead. Enrich every row. Call every prospect. |
| Promise | Scrape live business and job data, enrich it in a reactive table, then reach out with AI voice agents and email — all from one workspace. |

## Color

**Ink & surface**

| Token | Value | Use |
|---|---|---|
| `--lp-void` | `#01030f` | Page background (hero, footer) |
| `--lp-deep` | `#030720` | Stat tiles |
| `--lp-navy` | `#04102f` | — |
| `--lp-paper` | `#f4f6fd` | Light sections (Features) |
| `--lp-paper-soft` | `#e9edfa` | Skeleton fills on paper |

**Blue ramp** (lifted from the source Figma gradient stops)

| Token | Value |
|---|---|
| `--lp-blue-core` | `#285fff` |
| `--lp-blue-deep` | `#004fff` |
| `--lp-blue-mid` | `#8aa8ff` |
| `--lp-blue-pale` | `#b6c9ff` |
| `--lp-blue-lift` | `#4d7bff` |

**Text** — `--lp-text` (white) / `--lp-text-soft` (66%) / `--lp-text-faint`
(42%) on dark; `--lp-ink` / `--lp-ink-soft` / `--lp-ink-faint` on paper.

**Lines & glass** — `--lp-line` / `--lp-line-strong` for hairlines,
`--lp-glass` / `--lp-glass-strong` for translucent fills.

## Typography

- Display: `Plus Jakarta Sans` (weights 500–800)
- Body: `Inter` (weights 400–700)
- Loaded via Google Fonts `<link>` in `index.html`

Fluid scale — every step is a `clamp()` tied to viewport width, so type grows
smoothly with no breakpoint jumps:

| Token | Range | Role |
|---|---|---|
| `--lp-t-micro` | 12px | eyebrow / label |
| `--lp-t-caption` | 13px | meta, captions |
| `--lp-t-sm` → `--lp-t-lead` | 14–20px | UI text, lead paragraphs |
| `--lp-t-h4` → `--lp-t-h2` | 18–56px | subheads |
| `--lp-t-h1` | 44–100px | hero display |

Optical rule: **larger type sets tighter.** Tracking runs from `-0.045em`
(display) to `+0.14em` (uppercase micro labels, which need the air). Leading
runs the same way in reverse — `0.94` on the display size up to `1.65` on
body copy. Body measure is capped at `64ch` (`48ch` tight) so paragraphs
never over-run a comfortable line length.

## Layout & rhythm

- Shell: centered, `max-width: 1200px`, fluid gutter `clamp(1.25rem, 4vw, 2.5rem)`
- Section padding: `clamp(5rem, 10vw, 9rem)` top/bottom
- Radii: 10 / 14 / 20 / 28px + a `999px` pill, used consistently for
  buttons → cards → sections
- One easing curve for the whole page: `cubic-bezier(0.22, 1, 0.36, 1)`
  ("EASE" in `motion.ts`) — a single custom curve is what makes separate
  animations read as one system instead of a pile of effects

## Signature visual techniques

**Gradient field ("grading")** — `GradientField` in `primitives.tsx`. Four
stacked radial "bands" (`#285FFF→#8AA8FF`, `#285FFF→#B6C9FF`,
`#285FFF→#004FFF`, and a grounding black mass) behind two nested blur passes
(85px inner, 50px outer) plus a mono SVG-noise overlay at 20% opacity. This
is the one recurring background treatment — hero, How It Works, and the
closing CTA all reuse it at different opacities.

**Glass cards** — `.lp-glass`: translucent gradient fill, `blur(22px)
saturate(150%)` backdrop-filter, soft outer shadow, and a specular sheen
pseudo-element across the top edge. `--light` variant flips it to a near-opaque
white card with a dark shadow for content sitting on the gradient field
(the floating hero deck).

**Scallop transition** — `.lp-scallop`: a paper-colored div with a large
top border-radius and negative margin, creating the soft rounded shoulder
where the dark hero folds into the light Features section.

**Progressive blur** — `ProgressiveBlur`: four stacked `backdrop-filter`
layers, each blurring harder and masked to a narrower band via
`mask-image` gradients, so a scroll-edge blur ramps smoothly instead of
stepping.

## Motion system

All motion lives behind `src/landing/motion.ts` (GSAP + ScrollTrigger).

- `useGsap` scopes every animation with `gsap.context()` and reverts it on
  unmount — prevents orphaned ScrollTriggers under StrictMode's double-mount.
- `revealOnScroll` — the one reveal recipe used everywhere: elements rise
  28px and fade in as they cross 82% of the viewport, staggered so grids
  resolve as a wave.
- `countUp` — animates stat numbers from 0 with thousands separators.
- Resting state is never `opacity: 0` in CSS — GSAP sets the hidden state
  in `useLayoutEffect` before first paint. If JS fails or is disabled, the
  page stays fully readable instead of blank.
- `prefers-reduced-motion` is honored at both the JS layer (`reduced` flag
  skips transforms/scroll-triggers, content is just set visible) and in CSS
  (global transition/animation-duration override).

Notable per-section touches:

- **Hero** — headline splits into words, each masked and rotated in on a
  stagger; floating card deck enters, then idles on independent
  sine-wave loops per card so it never pulses in lockstep; outer cards
  parallax further than the center one on scroll (`data-depth`); a live
  voice-waveform strip animates bar heights on random offsets.
- **Features** — grid reveals with stagger; the highlighted "hot" card
  tracks the pointer and paints a radial sheen at the cursor position via
  CSS custom properties (`--mx`/`--my`) written by GSAP on `pointermove`.
- **How It Works** — a horizontal rail between the three steps draws itself
  left-to-right (`scaleX` 0→1) as the section enters.
- **FAQ** — accordion panels animate `height: auto`/`0` on toggle; only one
  open at a time.
- **Navbar** — becomes a solid, blurred bar (`--stuck`) once scrolled past
  24px; an `IntersectionObserver` tracks which section is in view to
  underline the matching nav link.

## Components (`primitives.tsx`)

| Component | Purpose |
|---|---|
| `GradientField` / `Noise` | The recurring background treatment |
| `ProgressiveBlur` | Scroll-edge blur ramp |
| `Pill` | Eyebrow label — `glass` (dark sections) or `ink` (paper sections) tone |
| `Button` | Primary (solid blue, optional trailing arrow chip) / `ghost` (outlined) |
| `LearnMore` | Inline "Learn more ↗" link with a wipe-in underline |
| `Glass` | The glass-card shell, `dark` or `light` tone |
| `SectionHead` | Shared eyebrow → H2 → lead rhythm used by every section |
| `Logomark` | The signal-glyph brand mark |

## Page structure (`Landing.tsx`)

`Navbar → Hero → (scallop) → Features → HowItWorks → Proof → Faq → Footer`

1. **Navbar** — fixed, floats over the hero at full transparency, solidifies
   on scroll; center-aligned links, right-aligned Log In / Get Started;
   collapses to a full-screen drawer under 900px.
2. **Hero** — eyebrow pill, staggered word-by-word headline with a gradient
   accent on the last three words, promise copy, dual CTA, and a
   three-card floating "deck" (credits card, live-search card with voice
   waveform, deal/call card) over the gradient field.
3. **Features** — 8-card grid on the paper background; first card is a
   highlighted "hot" variant with a pointer-tracked sheen.
4. **How It Works** — three numbered steps (Source → Enrich → Reach out)
   linked by a self-drawing rail.
5. **Proof** — a 4-stat strip (count-up on scroll) followed by three
   testimonial cards.
6. **FAQ** — single-open accordion, six questions.
7. **Footer** — closing gradient-field CTA card, then a 4-column footer
   (brand + Product / Company / Resources) and a base bar with legal links.

## Responsive behavior

Breakpoints at `1080px`, `900px`, `560px`:

- Feature grid: 4 → 2 → 1 columns
- Nav links collapse to a burger + drawer under 900px
- Hero card deck stacks to a single column under 900px
- Steps and testimonial grids collapse to 1 column under 900px
- Stats grid: 4 → 2 columns under 900px

## Accessibility

- `prefers-reduced-motion: reduce` disables all transitions/animations
  globally and forces reveal elements to their resting visible state.
- FAQ accordion and mobile drawer use proper `aria-expanded`,
  `aria-controls`, `role="dialog"`/`role="region"` wiring.
- Focus-visible outline defined on the primary button (`--lp-blue-mid`,
  3px offset).
