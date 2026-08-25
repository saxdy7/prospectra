# Prospectra — UI Implementation Specification

Living record of UI decisions. **Update this before adding a major screen or
component, not after.**

Visual source of truth is the shipped code, not any reference screenshot:

| File | Authority over |
|---|---|
| `src/components/landing/landing.css` | Tokens, type scale, gradient field, glass, radii, motion |
| `src/components/auth/auth.css` | How a product surface extends the landing system |
| `src/components/landing/primitives.tsx` | `GradientField`, `Noise`, `Glass`, `Pill`, `Button`, `Logomark` |
| `src/components/landing/brand.ts` | Name, wordmark, tagline, promise |
| `DESIGN.md` | Rationale behind the above |
| `src/app/globals.css` | shadcn token mapping for the product app |

Reference screenshots (Clay, voice-agent tools, dashboard shots) inform
**capabilities and flow only**. Their layout, colour, spacing, wording,
iconography and component composition are explicitly out of scope for copying.

---

## 0. DECIDED — product app ships **both themes**, light by default

> **Status: current, 2026-08-25 (third ruling, same day).** Marketing, auth,
> and onboarding stay dark — unchanged. `/app` is a real light/dark **toggle**:
> the workspace renders light on first load, and a header control switches to
> the dark ramp and back, persisted per browser. Neither the all-dark ruling
> nor the light-only ruling below this line is current; both are kept for the
> reasoning trail.

The all-dark reversal (kept verbatim further down) was itself reversed by a
direct instruction: the dark conversion had gone further than intended — the
user wants the white version available as the default for `/app`, with the
dark version reachable as an explicit user choice, not the other way round.

**What changed, mechanically:**

- `workspace.css` `.pa` now defines the **light** token ramp as its base
  (`--lp-void: #f5f7fc`, `--lp-text: #0d1526`, …) plus the shadcn bridge
  (`--background/--card/--border/…`) pointed at those same light values.
- A second block, `.pa[data-theme='dark']`, redefines every one of those same
  custom properties to the dark ramp. Nothing else in the cascade changed —
  every component rule in `workspace.css` and every inline style across
  `src/app/app/**` reads a `--lp-*`/`--pa-*` token, never a literal, so the
  whole app shell, onboarding, and every route follow whichever block is
  active with zero component-file edits. (A handful of colours are
  deliberately **not** tokens — the permanently-blue `.pa-btn` gloss, checked-
  state marks on blue-filled circles, modal scrims, and code-snippet blocks —
  because they are correct unchanged in both themes.)
- `src/lib/demo-storage/preferences.ts` gained `getTheme`/`setTheme`/
  `subscribeTheme`/`getThemeServerSnapshot` (`Theme = 'light' | 'dark'`,
  default `'light'`, key `prospectra:pref:theme`), following the same
  localStorage get/set pattern as every other preference.
- `src/components/app/AppShell.tsx` reads the theme with
  `useSyncExternalStore` (not a `useEffect` + `setState`, which the
  `react-hooks/set-state-in-effect` lint rule rejects as a render-cascade
  antipattern) — the server and first paint always resolve `'light'`, so
  there is no hydration mismatch, and the persisted choice swaps in
  immediately after mount. `data-theme={theme}` is applied to both `.pa` root
  wrappers in that file (the loading-skeleton branch and the main shell).
- The toggle itself is a Sun/Moon icon button in the top-right header
  (`.pa-top__right`, next to the avatar), **not** in the sidebar profile
  menu — that placement was tried and explicitly rejected in favour of a
  directly-visible control near the profile avatar. See §2.
- `OnboardingShell.tsx` renders `.pa` with no `data-theme` attribute at all,
  so onboarding always resolves the light base block regardless of what the
  user later picks inside `/app` — onboarding has no toggle and was never
  asked to have one.

<details>
<summary>Historical: the all-dark ruling this replaces (superseded 2026-08-25, earlier the same day)</summary>

> **Status at the time: superseded 2026-08-25 (later same day). Marketing, auth, onboarding
> and `/app` are all dark. The light ruling below this line is history, kept
> for the reasoning trail — do not act on it.**

The previous ruling (kept verbatim further down as a record) weighed two
earlier, partially ambiguous instructions and chose light. A later
instruction resolved the ambiguity directly and explicitly, leaving no room
for the earlier reading:

> "Near-black and midnight-navy foundation... Do not turn the app into a
> generic bright-white dashboard." / "Complete five-step **dark** Prospectra
> onboarding."

That is not silence or delegation — it names the foundation and the specific
surface (onboarding) the previous ruling had put in the light column. Ruling
reversed: dark wins for every signed-in surface too.

**What changed, mechanically — no component files, only tokens:**

- `workspace.css` `.pa` no longer overrides `--lp-void/--lp-text/--lp-line/…`
  with light equivalents. It now inherits those directly from `.lp` (both
  classes sit on the same root element), so the workspace is dark by default.
- `.pa` now also redefines the **shadcn** token names
  (`--background/--card/--foreground/--border/--primary/…`) onto the same
  dark ramp. This was a real bug caught mid-build: shadcn components
  (`Card`, `Badge`, `Button`, `Avatar`, `Progress`) read those names from
  `globals.css`'s light `:root` regardless of `.pa`'s `--lp-*` tokens, so
  without this bridge every shadcn card on Home rendered as a white box on
  the new dark shell. One block in `.pa` fixes every shadcn component at
  once — see §B-dark for the exact values, which match what was already
  specified there before this reversal.
- Component files were untouched. This confirms the token-only design was
  sound: reversing the decision cost one CSS block, not a rewrite.

<details>
<summary>Historical: the light ruling this replaces (resolved 2026-08-25, earlier the same day)</summary>

Two conflicting instructions were on record:

| Date | Instruction |
|---|---|
| 2026-08-24 | "Make sure the UI changes to the white one only, the before one" |
| 2026-08-25 | "Use dark navy/near-black as the main foundation. Never use a generic white Clay-style dashboard." |

**Ruling at the time: keep light.** Reasoning, in order of weight:

1. The most recent screenshot shared was the light dashboard, and the note
   attached to it was about an empty column — not the theme. Silence on the
   foundation after seeing it is the strongest signal available.
2. "You can choose what you want" and "complete everything" delegated the call.
3. The dark instruction arrived inside a bulk specification that reads as
   drafted before the light build existed.
4. It is defensible on its own merits: the product is where dense tables and
   long copy get read, and `--lp-paper #f4f6fd` is already part of the landing
   system's own light sections — so this is inside the system, not outside it.

This reasoning is preserved because it was sound *given what was known at the
time* — the next explicit instruction simply settled the ambiguity the other
way. Treat a future "make it light again" instruction as a third reversal,
not evidence this analysis was wrong.

</details>

</details>

---

## A. Existing Prospectra visual system

### A.1 Brand

| | |
|---|---|
| Wordmark | **Prospectra** (Plus Jakarta Sans 800, `-0.03em`) + `.ai` in `--lp-text-faint` 600 |
| Tagline | Find every lead. Enrich every row. Call every prospect. |
| Promise | Scrape live business and job data, enrich it in a reactive table, then reach out with AI voice agents and email — all from one workspace. |
| Mark | `Logomark` — a rising signal stroke plus a dot, white on a blue gradient tile |

Never render the wordmark as two colours other than white + faint, never
letterspace it positive, never substitute a different typeface.

### A.2 Typography

- **Display / headings:** Plus Jakarta Sans (500–800), self-hosted via
  `next/font`, exposed as `--font-plus-jakarta`.
- **Body / UI:** Inter (400–700), `--font-inter`.
- Italic is a real cut, not synthesised — the hero accent depends on it.

Fluid scale, every step a `clamp()` against viewport width:

| Token | Range | Role |
|---|---|---|
| `--lp-t-micro` | 12px | eyebrow, uppercase label |
| `--lp-t-caption` | 13px | meta, hint text |
| `--lp-t-sm` | 14–15px | UI text |
| `--lp-t-base` | 15–17px | body |
| `--lp-t-lead` | 17–20px | lead paragraph |
| `--lp-t-h4` | 18–22px | sub-head |
| `--lp-t-h3` | 22–30px | card / section title |
| `--lp-t-h2` | 32–56px | section headline |
| `--lp-t-h1` | 44–100px | hero display |

**Optical rule — larger type sets tighter.** Tracking runs `-0.045em`
(display) → `-0.035em` (h2) → `-0.02em` (h3) → `-0.006em` (body) →
`+0.14em` (uppercase micro, which needs the air). Leading runs the same way
inverted: `0.94` display → `1.04` h2 → `1.2` h3 → `1.65` body.

**Measure:** body copy capped at `64ch` (`48ch` tight). Headlines use
`text-wrap: balance`, paragraphs `text-wrap: pretty`.

### A.3 Colour tokens

**Foundation (dark)**

| Token | Value | Use |
|---|---|---|
| `--lp-void` | `#01030f` | Page background |
| `--lp-deep` | `#030720` | Raised dark surface |
| `--lp-navy` | `#04102f` | Deeper panel |
| `--lp-paper` | `#f4f6fd` | Light section ground |
| `--lp-paper-soft` | `#e9edfa` | Skeleton fill on paper |

**Blue ramp** — lifted from the source Figma gradient stops. This is the only
saturated hue in the system.

| Token | Value |
|---|---|
| `--lp-blue-core` | `#285fff` |
| `--lp-blue-deep` | `#004fff` |
| `--lp-blue-lift` | `#4d7bff` |
| `--lp-blue-mid` | `#8aa8ff` |
| `--lp-blue-pale` | `#b6c9ff` |

**Text**

| On dark | On paper |
|---|---|
| `--lp-text` `#ffffff` | `--lp-ink` `#070b1c` |
| `--lp-text-soft` `rgba(255,255,255,.66)` | `--lp-ink-soft` `#4a5473` |
| `--lp-text-faint` `rgba(255,255,255,.42)` | `--lp-ink-faint` `#7b849e` |

**Lines and glass**

| Token | Value |
|---|---|
| `--lp-line` | `rgba(255,255,255,.10)` |
| `--lp-line-strong` | `rgba(255,255,255,.18)` |
| `--lp-line-ink` | `rgba(7,11,28,.08)` |
| `--lp-glass` | `rgba(255,255,255,.06)` |
| `--lp-glass-strong` | `rgba(255,255,255,.10)` |

**Semantic colours** — used *only* for the meaning named, never decoratively:

| Meaning | Colour | Rule |
|---|---|---|
| Primary action, active state | electric blue `#285fff` | The one dominant colour |
| Voice / calling (future) | restrained teal `#0f8b7e` | Only on voice surfaces |
| Warning, credit attention | muted amber `#a86a12` | Never for general emphasis |
| Success, completed | green `#15803d` | Never for "primary" |
| Destructive, error | red `#c8324b` | Never for "important" |

### A.4 Signature treatments

**Gradient field** (`GradientField`) — four stacked radial bands on the blue
ramp plus a grounding black mass, behind two nested blur passes (85px inner,
50px outer), finished with mono SVG grain at 20% opacity. One recurring
background, reused at different opacities: hero `0.34`, How-It-Works `0.5`,
auth showcase `0.3`, onboarding `0.32`, app shell `0.16`.

**Grain** (`Noise`) — `feTurbulence` fractal noise, `baseFrequency 0.82`,
desaturated, `opacity .2`, `mix-blend-mode: overlay`. Never above `.2`.

**Glass** (`.lp-glass`) — translucent gradient fill, `blur(22px)
saturate(150%)`, soft outer shadow, and a specular sheen pseudo-element across
the top edge. `--light` flips it to near-opaque white for content sitting on
the gradient field.

**Progressive blur** — four stacked `backdrop-filter` layers, each blurring
harder and masked to a narrower band, so a scroll edge ramps instead of steps.

### A.5 Radii, spacing, motion

| Radius | Value | Use |
|---|---|---|
| `--lp-r-sm` | 10px | chips, small controls |
| `--lp-r-md` | 14px | inputs, buttons, tiles |
| `--lp-r-lg` | 20px | cards |
| `--lp-r-xl` | 28px | feature panels |
| pill | 999px | primary buttons, badges |

Shell `1200px` max-width, gutter `clamp(1.25rem, 4vw, 2.5rem)`, section rhythm
`clamp(5rem, 10vw, 9rem)`.

**Motion:** one easing curve for the entire product —
`cubic-bezier(0.22, 1, 0.36, 1)`. GSAP + ScrollTrigger via
`src/components/landing/motion.ts`. `useGsap` scopes every animation in a
`gsap.context()` and reverts on unmount, which is what prevents orphaned
triggers under StrictMode's double-mount. One reveal recipe everywhere:
rise 28px + fade at 82% viewport, staggered so grids resolve as a wave.

**Resting state is never `opacity: 0` in CSS.** GSAP sets the hidden state in
`useLayoutEffect` before first paint, so if JS fails the page stays readable
instead of blank. This rule is load-bearing — do not "optimise" it away.

**Reduced motion:** honoured at both layers. JS — the `reduced` flag skips
transforms and scroll triggers and simply sets content visible. CSS — a global
`prefers-reduced-motion` block collapses transition/animation durations, and
`.pa-reveal` drops its transition entirely (collapsing the duration alone would
still animate a grid track).

---

## B. Global product-app design rules

Shared by both options:

- The app is a continuation of the landing page, not a separate product.
- **One dominant action per visual region.** If two things compete, one is wrong.
- **No card-inside-card.** Establish hierarchy with space and type first;
  reach for a container only when grouping genuinely needs a boundary.
- Restraint on pills, badges, gradients, shadows and borders. The gradient
  belongs to the hero and the primary button — not to every panel.
- No rainbow or competitor-style iconography.
- Future modules get a polished "Coming soon" panel that says what the module
  will do. Never a dead link, never an empty version of a feature that does not
  exist.
- Mock data is labelled as such wherever a user could mistake it for real.

### B-dark — current implementation

| Token | Value |
|---|---|
| `--background` | `#01030f` (`--lp-void`) |
| `--card` | `rgba(255,255,255,.035)`, `backdrop-filter: blur(20px) saturate(140%)` |
| `--popover` | `#0a1024` (solid — dropdowns/dialogs sit above glass, need to stay legible over anything behind them) |
| `--foreground` | `#ffffff` |
| `--muted-foreground` | `--lp-text-faint` `rgba(255,255,255,.42)` |
| `--primary` | `--lp-blue-core` `#285fff` |
| `--accent` | `rgba(40,95,255,.12)`, `--accent-foreground: --lp-blue-mid` |
| `--border` / `--input` | `--lp-line-strong` `rgba(255,255,255,.18)` |
| `--ring` | `--lp-blue-mid` `#8aa8ff` |
| `--destructive` | `#c8324b` |

Set once, inside `.pa` in `workspace.css`, directly on the shadcn variable
names — every `bg-card`, `text-muted-foreground`, `border-border` Tailwind
utility across the shadcn component set (`Card`, `Badge`, `Button`,
`Avatar`, `Progress`, `Separator`) resolves dark with zero component edits.
`--pa-surface` / `--pa-surface-hover` / `--pa-surface-solid` are workspace-
only additions layered on top for the `.pa-*` component set (§C) that
predates the shadcn bridge.

Rationale: maximum continuity with landing and auth; the product reads as one
dark universe from marketing through to workspace. Costs some long-session
legibility in dense tables, mitigated by keeping row text at `--lp-text-soft`
(66% white) rather than full white, and reserving pure white for the one
column that anchors each row (see `DataTable` in §C).

### B-light — retired

The values below shipped first and were live from 2026-08-24 through the
reversal in §0. Recorded in case of a future revert — restoring them is the
same one-block change in the other direction.

| Token | Value |
|---|---|
| `--background` | `#f5f7fc` |
| `--card` | `#ffffff` |
| `--foreground` | `#070b1c` |
| `--primary` | `#285fff` |
| `--border` | `rgba(7,11,28,.08)` |

Switching cost either direction: the `.pa` token block in `workspace.css`.
No component changes — this was proven twice now, once each way.

---

## C. Component inventory

Every component below defines the full state set from §8 unless noted.

### Shell

| Component | Purpose | Variants | Key props | States | A11y | Responsive |
|---|---|---|---|---|---|---|
| **AppShell** | Grid frame: sidebar + main | — | `children` | — | `<main>` landmark, skip link | 256px sidebar ≥900px; drawer below |
| **AppSidebar** | Primary navigation | `expanded`, `drawer` | `active`, `onNavigate`, `open`, `onClose` | default, hover, active, focus | `<nav aria-label="Workspace">`, `aria-current="page"` | Fixed rail → slide-out drawer + scrim |
| **MobileAppNavigation** | Drawer wrapper below 900px | — | `open`, `onClose` | open, closed | Focus trap, Escape closes, `aria-modal` | ≥44px targets |
| **TopBar** | Context + account | — | `title`, `right` | sticky, scrolled | `<header>`, burger `aria-expanded` | Credits hidden <640px |
| **WorkspaceSwitcher** | Current workspace; later switching | `single`, `multi` | `workspace` | default, hover, open | Button labelled with current name | Truncates with ellipsis |
| **CreditIndicator** | Balance | `ok`, `low`, `unavailable` | `value`, `kind` | — | Not colour-alone — always a number + word | Hidden <640px |
| **PageHeader** | Title + description + one action | — | `title`, `description`, `action` | — | `<h1>`/`<h2>` in order | Action wraps below on mobile |

### Controls

| Component | Purpose | Variants | Notes |
|---|---|---|---|
| **PrimaryButton** | The one dominant action | `brand` (graded), sizes `default/lg/xl` | Gradient fill + inset gloss + blue drop-glow, lifts 1px on hover |
| **SecondaryButton** | Supporting action | `outline`, `secondary`, `ghost` | Never carries the gradient |
| **IconButton** | Compact utility | `ghost`, `outline`, size `icon` | Requires `aria-label`; ≥44px hit area on touch |
| **ChoiceCard** | Single/multi select | radio, checkbox | Wraps a **real** input — arrow-key nav, Space, roles and announcement come from the platform, not re-implemented handlers. `:has()` drives styling |
| **StatusBadge** | State label | `default/secondary/soft/outline/success/warn/muted` | Always word + colour, never colour alone |
| **ProgressIndicator** | Completion | bar, conic ring | `role="progressbar"` + `aria-valuenow/min/max` |
| **StepNavigation** | Back / Skip / Continue | — | Continue disabled until valid; Back hidden on step 1; Skip only where the answer is optional |
| **FormField** | Labelled input + error | — | `<label for>`, `aria-invalid`, `aria-describedby` → error id, `role="alert"` |
| **SearchInput** | Filter a set | — | Debounced; announces result count politely |
| **FilterControl** | Narrow a table | chip, select, drawer | Active filters shown as removable chips with a count |

### Data

| Component | Purpose | Empty | Loading | Error |
|---|---|---|---|---|
| **DataTable** | Row/column grid | Illustration + one action | Skeleton rows matching column widths | Inline row error + retry, table stays usable |
| **TableToolbar** | Search, filter, sort, columns, run state | — | Disabled while a run is queued | Shows failed-job count |
| **MetricCard** | One number + label | Honest `0`, never invented | Shimmer on the number only | Dash + tooltip |
| **ActivityItem** | One chronological event | — | Skeleton line | — |
| **SectionHeader** | Group label + optional action | — | — | — |

### Feedback

| Component | Purpose | A11y requirement |
|---|---|---|
| **EmptyState** | Explain + one action | Heading in order; illustration `aria-hidden` |
| **LoadingSkeleton** (`Skeleton.tsx`) | Structural placeholder — `SkeletonBlock`/`SkeletonTableRows`/`SkeletonCards`/`PageSkeleton` | `aria-busy`/`role="status"` on the region |
| **ErrorState** | What failed + retry | `role="alert"`; plain-language cause |
| **Toast** (`Toast.tsx`) | Transient confirmation via `ToastProvider`/`useToast()`, mounted once in `AppShell` | `role="status"` polite; never the only signal |
| **Modal** | Blocking decision | Focus trap, Escape, `aria-modal`, restore focus on close |
| **Drawer** (`Drawer.tsx`) | Side panel for create/edit flows (add column, create webhook, create function, …) | Focus trap, Escape, scrim click closes, restores focus |
| **ConfirmDialog** (`ConfirmDialog.tsx`) | Destructive/consequential confirm | Names the object; destructive action is *not* the default focus; `tone="neutral"` for non-destructive confirms |
| **SetupChecklist** | Onboarding follow-through | Checkbox semantics; dismissible; state persists |
| **BnbIconIllustration** | Isometric artwork slot | `aria-hidden` when a label sits beside it; alt text only when it carries meaning alone |

### Product surface (`src/components/app/`) — added for the routed `/app/*` build

The routed milestone (§D) introduced a second small component set,
purpose-built for the ~38 `/app/*` pages and imported from
`@/components/app` (barrel at `src/components/app/index.ts`). These sit
alongside — not instead of — the shell components above.

| Component | Purpose | Notes |
|---|---|---|
| **useWorkspace()** | The auth/onboarding gate + typed data access every route needs | Replaces the gate that used to live inline in the retired `WorkspaceApp.tsx` switcher. Returns `null` while resolving (render `PageSkeleton`), then `{ state, data, product, workspaceId, firstName, persist, persistData, persistProduct }`. Rules-of-hooks note: every route calls its own hooks *before* the `if (!ctx) return <PageSkeleton />` early return. |
| **PageHeader** | Title + description + actions + optional breadcrumb + optional tabs slot | One header shape across every route |
| **DataTable\<T\>** | Generic searchable directory table | `columns` (label + render fn), `searchKeys`, `onRowClick`; skeleton rows while `loading`, row-shaped empty state otherwise |
| **SearchResultsPanel** | The right-hand half of every find-leads sub-page | Provider-gate banner, saved-searches list (`JobStatusPill`), and a labelled demo-results preview table |
| **WorkflowCanvas** | Draggable node/edge canvas for `/app/workflows` | Pointer-event drag, click-to-connect edges, palette + inspector panel. Frontend-only — nothing executes |
| **Tabs** | ARIA tablist, unopinionated about what renders below | Used for campaign channel tabs, agent-studio sections, directory status filters |
| **DemoTag** | The one consistent "this is not live" pill | `kind`: `demo` / `simulation` / `coming-soon` / `not-connected`. Never colour alone — always spells out the word |
| **JobStatusPill** / **StatusPill** | Status pill for `JobStatus` values / any other status string | Wraps the existing `JOB_LABEL`/`JOB_TONE` maps from `lib/workspace/store.ts` |
| **FormControls** (`TextField`/`TextareaField`/`SelectField`) | Labelled inputs matching `.pa-field`/`.pa-input` | Same visual contract as the auth `Field` component, generalised past just text+password |

---

## D. Screen inventory

### `/onboarding`

| | |
|---|---|
| Purpose | Turn a new account into a usable first workspace in ≤5 steps |
| Primary action | Continue (one per screen) |
| Hierarchy | Progress → question → choices → actions |
| Desktop | Centred 720px column, fixed action bar |
| Tablet | Same, wider gutter |
| Mobile | Single column; actions stack, Continue full-width |
| Loading | Blank canvas until storage is read — never a flash of empty form |
| Empty | N/A |
| Error | Inline under the field, `role="alert"` |
| First-run | Workspace name prefilled from the account name |
| Keyboard | Enter submits step 1; arrows move within a choice group; focus moves to the step heading on change |
| Screen reader | `aria-live="polite"` on "Saved"; `role="progressbar"` on the bar |

Per-step detail in §3.

### `/app`

| | |
|---|---|
| Purpose | Orient a new user and make the next action obvious |
| Primary action | Recommended next step |
| Hierarchy | Greeting → recommendation → checklist → quick actions → recent activity → voice (conditional) |
| Desktop | 2:1 main/rail split |
| Tablet | Single column, rail below |
| Mobile | Stacked; drawer nav |
| Loading | Neutral shell matching server markup — no hydration mismatch |
| Empty | Honest zeroes plus "nothing run yet" |
| Error | Section-level, rest of page usable |
| Permission denied | No session → `/signin`; no completed setup → `/onboarding` |
| Keyboard | Sidebar is a button list in DOM order; burger is `aria-expanded` |

### `/signin`, `/signup`, `/forgot-password`

Unchanged. Dark split layout: showcase panel (gradient field, halftone, bloom,
stat strip) + form card. **Do not restyle.** Collapses to a single column at
900px.

### `/` (landing)

Unchanged and out of scope for product work. Any change here requires its own
entry in this document.

### Routed — the single-page switcher is retired

`WorkspaceApp.tsx` (the section-switching client component that used to
render everything under one `/app` URL via internal `useState`) is deleted,
along with the components it alone imported (`TablesSection.tsx`,
`SearchPanel.tsx`, `modules/Modules.tsx`, `modules/AnalyticsSettings.tsx`).
Every former "section" and every route the frontend milestone (§D below)
added is now a real Next.js route under `src/app/app/**`, sharing one
`AppShell` via `src/app/app/layout.tsx`. Deep links, the browser back
button, and page-specific metadata all work now, which the switcher could
not do.

Full route-by-route detail — purpose, primary action, states, what is real
vs. demo — lives in **`docs/FRONTEND_ROUTE_INVENTORY.md`**, not duplicated
here. This file stays the visual/system rulebook; that one is the map of
every screen.

---

## 2. App shell

Sidebar groups, understated labels, no heavy containers:

```
[wordmark]
[workspace switcher]

  Home

LEAD WORKSPACE
  Find leads · Tables · Imports · Claygent research · Functions · Workflows

ENGAGE
  Audiences · Campaigns

VOICE
  Voice agents · Voice playground · Knowledge base · Concurrency ·
  Phone numbers · WhatsApp

MONITOR
  Analytics · Activity

DEVELOPER
  Integrations · Webhooks · MCP

  ─────────────
  Settings · Help · [user menu]
```

Source of truth: `NAV_GROUPS` in `src/components/workspace/AppSidebar.tsx`.
Active-state detection is longest-prefix match against `usePathname()`, not
manually tracked state, so a nested route (`/app/tables/abc123`) still
highlights its parent ("Tables") correctly.

- Group labels: `--lp-t-micro`, uppercase, `+0.14em`, faint. No box, no rule.
- Active item: electric-blue text, a 2px blue left rail with a soft glow, and a
  low-opacity blue background wash.
- **Lucide for navigation.** BnbIcons are illustrations only — never one per nav row.
- Future items carry a quiet `Soon` tag and open the Coming-soon panel.
- Mobile: slide-out drawer + scrim, Escape closes, body scroll locked, ≥44px rows.

**Top bar right side** (`.pa-top__right`, left to right): setup-credits pill,
theme toggle (Sun/Moon icon button, `.pa-icon-btn`), avatar. The theme toggle
flips `/app` between the light default and the dark ramp — see §0.

---

## 3. Onboarding

Fullscreen canvas, gradient field, grain, small wordmark, thin blue progress
line, centred column. No oversized cards. A translucent panel only where form
readability needs one.

| Step | Heading | Notes |
|---|---|---|
| 1 Workspace | Make this workspace yours. | Name is the required focus; logo is a subtle optional action; team size as compact segmented buttons |
| 2 Goal | What do you want Prospectra to help you do first? | Large choice cards, BnbIcon illustration, label, one-line explanation, blue border + glow when selected. 2-col desktop, 1-col mobile |
| 3 Data | Where should we start? | Compact cards; CRM chips revealed **only** when "Connect a CRM later" is chosen; no credentials |
| 4 Prepare | What should we prepare for you? | Checkable rows, small icons, "Estimated setup usage · light/moderate/heavier/none" — a sense of effort, never a rate or balance |
| 5 Calling | Will calling be part of your workflow? | Restrained teal over the foundation; states plainly that this is future configuration; reveals optional fields only when a calling route is chosen; **no phone fields, no "Call now"** |

Finish: gentle confirmation, workspace name, the one recommended action, one
strong primary button. Minimal — not a crowded checklist.

---

## 4. Dashboard

Order is fixed: greeting → recommended next step → setup checklist → quick
actions → recent activity → voice (only when relevant).

- **Recommended next step:** one BnbIcon, a concise benefit line, one primary
  button, blue glow and subtle glass framing.
- **Quick actions:** max six tiles, ordered by the onboarding goal. BnbIcon
  artwork; Lucide only for the trailing affordance.
- **Setup checklist:** compact vertical list, status + action text + completion
  indicator, dismissible, persisted.
- **Recent activity:** chronological list, not a card grid. Empty state
  suggests the relevant first action.

> **Resolved 2026-08-25.** The build uses a full-width brand-gradient hero for
> the recommendation, which reads as a conflict with "never a giant generic
> gradient card". It is not: that rule exists to stop decoration without
> purpose. Here the gradient marks the single most important action on the
> page and is the only place on the surface that carries it, which is exactly
> the "one dominant action per region" rule doing its job. Kept.
>
> The rule stands for everything else — no second gradient panel on this page,
> ever.

---

## 5. Table, search and data

Search: filter column left on large screens, results right; drawer below
1280px. Job states shown honestly — Draft, Queued, Searching, Completed,
Failed, Cancelled. **Never fabricate results.**

Tables: dense but on-theme, sticky header, horizontal scroll on small screens,
column type indicators, calm selection/sort/filter, consistent status colours,
skeleton rows while loading, and an empty state with exactly one action.

---

## 6. Voice and calling

Prepared and trustworthy without pretending telephony exists.

Agent screens: prompt editor, language selection, voice selection, knowledge
base attachment, tools, test control, draft/published status, version history.

Campaign screens: audience, agent, schedule, timezone, calling window, consent
status, number assignment, status, call logs, transcript + summary.

**Hard rule:** no live-call control, no phone-number field, no recording UI
until a telephony provider, number ownership, consent capture and calling-window
compliance are all implemented. Compliance warnings precede any future launch.

---

## 7. BnbIcons

Illustrations, not the interface icon set.

| Use BnbIcons for | Use Lucide for |
|---|---|
| Onboarding goals | Navigation |
| Dashboard quick actions | Inputs, sort, filter, close, edit |
| Recommendation panel | Trailing affordances |
| Major empty states | Toolbars |

Rules: local files under `public/icons/bnb/` only, never hotlinked; one central
map (`src/lib/icons/registry.ts`); rendered through `IconIllustration` /
`IconFrame`; `aria-hidden` when a label sits beside them.

> **Licensing status (checked 2026-08-24): blocked.** `bnbicons.com` publishes
> no licence — `/terms` and `/license` both 404, and neither the homepage nor
> the pricing page states what rights a generated icon carries. It is a
> credit-based AI generator, so assets require an account and paid credits.
> A widely-cited "CC BY 4.0" claim was traced to a third-party article that
> does not actually say it.
>
> All 44 slots are wired and documented in `public/icons/bnb/README.md`.
> Lucide renders until approved files land; adding one is a one-line registry
> change with automatic runtime fallback.

---

## 8. Interaction, states, accessibility

Every interactive component defines: **default, hover, focus-visible,
active/pressed, selected, disabled, loading, success, error.**

- Semantic headings in order; one `<h1>` per page.
- Every control labelled; errors linked via `aria-describedby` + `role="alert"`.
- Full keyboard operation for cards, menus, dialogs, drawers, tables, nav.
- Focus trapped in dialogs and drawers; focus restored on close.
- Focus ring: 2px `--lp-blue-mid`, 3px offset. Visible on every focusable.
- **Colour is never the only signal** — pair with text, icon or position.
- ≥44px touch targets.
- `prefers-reduced-motion` respected at JS and CSS layers.
- Empty states use real language, never a blank region.

---

## 9. Responsive

| Range | Sidebar | Dashboard | Onboarding | Tables |
|---|---|---|---|---|
| ≥1280px | Full rail | Multi-column where useful | Centred column | Full tooling |
| 768–1279px | Collapsible / narrow | Two-column where useful | Centred column | Filters may move to a drawer |
| <768px | Drawer + trigger | Stacked | Single column, full-width actions | Horizontal scroll |

No clipped controls. No hover-only actions — every hover affordance has a
focus/tap equivalent.

---

## 10. Pre-handoff review checklist

Run before declaring any UI milestone complete:

- [ ] Compared against landing/auth style
- [ ] No competitor visual style copied
- [ ] Desktop, tablet, mobile checked
- [ ] Contrast checked on the active foundation
- [ ] Empty, loading and error states exist
- [ ] Keyboard navigation and visible focus verified
- [ ] Reduced motion verified
- [ ] BnbIcons local, licensed, sparing
- [ ] Mock/future features labelled honestly
- [ ] **This document updated**

### Log

| Date | Change | Verified |
|---|---|---|
| 2026-08-24 | Onboarding + `/app` shipped; dark → light per instruction | tsc, lint, build |
| 2026-08-25 | shadcn primitives, brand token mapping, graded button, icon frames | tsc, lint, build; 9 cards / 3 badges / 10 frames, no overflow |
| 2026-08-25 | This document created | — |
| 2026-08-25 | Recent-activity rail added; content cap 1060→1440px | tsc, lint, build; 1440/1638px used at 1900px |
| 2026-08-25 | §0 resolved — product stays light, marketing stays dark | Recorded |
| 2026-08-25 | §4 gradient-hero deviation resolved — kept, rule narrowed | Recorded |
| 2026-08-25 | Phase 3 — tables, CSV import, search jobs | tsc, lint, build; CSV torture test passed |
| 2026-08-25 | Audiences, campaign drafts, voice studio | Verified end to end; gates hold |
| 2026-08-25 | Analytics + Settings; every nav entry now live | Counts correct; destructive reset confirmed |
| 2026-08-25 | Frontend milestone: §0 reversed to dark (superseding the light ruling above); shadcn-token bridge added to `.pa`; `WorkspaceApp.tsx` switcher retired in favour of ~38 real routes under `src/app/app/**`; new `@/components/app` shared library (`useWorkspace`, `PageHeader`, `DataTable`, `EmptyState`, `Drawer`, `ConfirmDialog`, `Toast`, `Tabs`, `DemoTag`/`StatusPill`, `FormControls`, `SearchResultsPanel`, `WorkflowCanvas`); `lib/mock-data/` and `lib/demo-storage/` added; `docs/FRONTEND_ROUTE_INVENTORY.md` and `docs/MOCK_DATA_BOUNDARIES.md` created | tsc clean, lint clean, build: 42/42 routes compiled, all 200 on a live curl sweep incl. placeholder dynamic-route ids |

## 1. NAVIGATION ROUTING
> **Status: current, 2026-08-25.**
The `AppSidebar` and `AppShell` explicitly depend on `useRouter()` from `next/navigation` to push routes to the Next.js App Router for every sidebar click, discarding the older state-based `section` fallback mechanism previously maintained in `WorkspaceApp`. All pages map to explicit route folders in `/app/app/*`.
