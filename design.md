# Nirmaan Aluminium House — Design System

> A considered interpretation of Duna's design language (premium, minimal, editorial, architectural)
> adapted for **Nirmaan Aluminium House** — a bespoke aluminium windows & doors fabrication practice.
>
> Status: This is the **authoritative design spec** for the build. Every token, type size, spacing
> value and component rule below is concrete and implementation-ready. Where Duna's exact values
> could not be extracted from the live site, values below are a coherent synthesis in Duna's idiom;
> they are internally consistent and should be applied as-is rather than re-interpreted.

---

## 1. Brand Intent & Voice

Nirmaan Aluminium House designs, fabricates and installs premium aluminium window and door systems
for architectural residential and commercial projects. The website must communicate four things,
in this order of priority:

1. **Craftsmanship** — mitred joints, thermal-break systems, anodised finishes; the hand of a maker.
2. **Architectural quality** — systems that belong in considered buildings, not commodity fittings.
3. **Precision** — millimetre tolerances, tested performance, documented specs.
4. **Trust** — measurable performance, real projects, named people, direct contact.

**Voice:** Quiet, confident, technical when it matters, never salesy. Short declarative sentences.
Present tense. Concrete nouns (alloy grades, section depths, U-values) over adjectives.

**Do not:** use exclamation marks, emoji, "cutting-edge", "world-class", "best-in-class", stock
testimonial language, or countdown timers.

---

## 2. Design Tokens

All tokens are CSS custom properties exposed at `:root` and consumed by Tailwind v4 via
`@theme inline` so utilities like `bg-paper`, `text-ink`, `font-display` resolve to them.
**No hard-coded color or size values appear in components.**

### 2.1 Color

A material-honest, monochrome-leaning palette: warm paper, deep charcoal ink, graphite and aluminium
greys. No saturated brand color. A single restrained signal color is reserved for the WhatsApp /
contact CTA only — everything else lives on the paper-to-ink axis.

```css
:root {
  /* Surfaces */
  --color-paper:        #F5F4F1;  /* warm off-white, primary background */
  --color-paper-2:      #EDEBE6;  /* alternating section background */
  --color-surface:      #FFFFFF;  /* cards, elevated panels */
  --color-ink:          #15171B;  /* primary text, primary button bg */
  --color-ink-2:        #15171B;  /* dark section background (footer/CTA) */

  /* Text */
  --color-graphite:     #3A3D44;  /* secondary text */
  --color-slate:        #6B6F76;  /* muted text, captions */
  --color-mute:         #9A9EA4;  /* disabled, placeholder */

  /* Aluminium (accent system) */
  --color-aluminium:    #A8ACB3;  /* accent, meta labels, metallic detail */
  --color-aluminium-2:  #C9CCD1;  /* subtle fills, hover wash */
  --color-hairline:     #E4E2DC;  /* hairline borders on paper */
  --color-hairline-ink: #2A2D33;  /* hairline borders on dark sections */

  /* Signal (reserved — WhatsApp / direct contact only) */
  --color-signal:       #1F6F54;  /* deep viridian; used ONLY on contact CTA */

  /* Focus */
  --color-focus:        #15171B;  /* focus ring on light */
  --color-focus-ink:    #C9CCD1;  /* focus ring on dark */
}
```

**Usage rules:**
- Body sits on `--color-paper`. Alternate long sections with `--color-paper-2` for rhythm.
- Cards / elevated panels use `--color-surface` with a `--color-hairline` border, never a heavy shadow.
- Dark sections (CTA, footer, full-bleed testimonial) use `--color-ink-2` with `--color-paper` text.
- `--color-signal` appears at most **once per page** (the primary contact/WhatsApp CTA). Never in
  body text, nav, or decorative elements.
- Maintain WCAG AA: `ink` on `paper` (≥12.5:1), `graphite` on `paper` (≥7:1), `paper` on `ink-2`
  (≥12.5:1). `slate` on `paper` is ≈4.6:1 — use only for secondary captions ≥14px.

### 2.2 Typography

Three families, each with a clear job. Loaded via `next/font/google` with `display: swap`.

| Token | Family | Role | Weights |
|---|---|---|---|
| `--font-display` | **Fraunces** (variable serif, opsz) | Hero title, section openers, large statements | 400, 500, 600 |
| `--font-sans` | **Inter** | Body, UI, headings (h2–h6), buttons, nav | 400, 500, 600 |
| `--font-mono` | **JetBrains Mono** | Specs, measurements, meta labels, captions | 400, 500 |

**Why this pairing:** Fraunces carries *craftsmanship* (editorial, humanist serif with optical
sizing); Inter carries *precision* (engineered grotesque); JetBrains Mono carries *technical
authority* (alloy grades, tolerances, U-values). Each font earns its place in the brand story.

```css
:root {
  --font-display: "Fraunces", Georgia, serif;
  --font-sans:    "Inter", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;
}
```

### 2.3 Type Scale

Fluid type using `clamp()` so it responds between mobile and desktop without manual breakpoints.
Root size 16px. Display uses Fraunces with **negative** letter-spacing at large sizes; body Inter
with **slightly positive** tracking for small sizes only.

| Token | Size (fluid) | Weight | Line-height | Tracking | Family |
|---|---|---|---|---|---|
| `--text-display` | `clamp(2.75rem, 6vw, 5.5rem)` | 500 | 1.02 | -0.02em | display |
| `--text-h1` | `clamp(2.25rem, 4vw, 3.5rem)` | 600 | 1.08 | -0.015em | sans |
| `--text-h2` | `clamp(1.75rem, 3vw, 2.5rem)` | 600 | 1.15 | -0.01em | sans |
| `--text-h3` | `clamp(1.25rem, 2vw, 1.5rem)` | 600 | 1.25 | -0.005em | sans |
| `--text-h4` | `1.125rem` | 600 | 1.3 | 0 | sans |
| `--text-body` | `1.0625rem` (17px) | 400 | 1.6 | 0 | sans |
| `--text-body-lg` | `1.1875rem` (19px) | 400 | 1.55 | 0 | sans |
| `--text-small` | `0.875rem` (14px) | 400 | 1.5 | 0.01em | sans |
| `--text-mono-label` | `0.75rem` | 500 | 1.4 | 0.08em | mono, uppercase |
| `--text-mono-spec` | `0.8125rem` | 400 | 1.5 | 0.02em | mono |

**Paragraph measure (max width):**
- Long-form prose: `max-width: 64ch` (`--measure-prose`)
- Lead/intro paragraphs: `max-width: 52ch` (`--measure-lead`)
- Captions/meta: `max-width: 36ch` (`--measure-caption`)

### 2.4 Spacing

4px base. Section vertical rhythm uses a discrete scale; horizontal container padding scales with
viewport. **Section spacing is intentionally varied** (see §4.2) — do not apply one uniform value.

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  24px;
  --space-6:  32px;
  --space-7:  48px;
  --space-8:  64px;
  --space-9:  96px;
  --space-10: 128px;
  --space-11: 160px;   /* used sparingly for hero / closing whitespace */

  /* Section vertical padding (varied — see layout variations) */
  --section-y-xl: 128px;
  --section-y-lg: 96px;
  --section-y-md: 64px;
  --section-y-sm: 48px;
}
```

### 2.5 Container Widths

```css
:root {
  --container-default: 1280px;   /* standard content + grid */
  --container-wide:     1440px;  /* galleries, full-bleed-feeling content */
  --container-narrow:   960px;   /* services, about body */
  --container-prose:    680px;   /* long-form / philosophy text */
  --container-bleed:    1600px;  /* hero image, gallery strips */
}
```

Horizontal padding: `clamp(20px, 5vw, 80px)`.

### 2.6 Radii

Duna is sharp and editorial — corners are mostly square. Radii are used sparingly and intentionally.

```css
:root {
  --radius-0: 0;          /* images, full-bleed panels, most cards */
  --radius-xs: 2px;       /* tags, chips */
  --radius-sm: 4px;       /* buttons, inputs */
  --radius-md: 8px;       /* cards only on mobile, to soften touch UI */
  --radius-pill: 999px;   /* status dots, pill tags, mono badges */
}
```

### 2.7 Shadows & Elevation

Elevation is achieved with **hairline borders + whitespace**, not shadows. Two shadows only, both
subtle, both reserved for genuinely elevated states (sticky header shadow on scroll, floating
mobile menu).

```css
:root {
  --shadow-header: 0 1px 0 0 rgba(21,23,27,0.06);
  --shadow-float:  0 8px 32px -12px rgba(21,23,27,0.18);
}
```

### 2.8 Transitions & Motion Timing

```css
:root {
  --ease-out:    cubic-bezier(0.22, 0.61, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --t-fast:  150ms;   /* hover, focus, nav underline */
  --t-med:   300ms;   /* buttons, mobile menu */
  --t-slow:  500ms;   /* reveals, image zoom */
}
```

### 2.9 Breakpoints

Tailwind v4 defaults are kept so existing mental models and utilities line up.

```css
:root {
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-2xl: 1536px;
}
```

### 2.10 Tailwind v4 Integration

In `app/globals.css` (or `src/app/globals.css`):

```css
@import "tailwindcss";

@theme inline {
  /* colors → utilities like bg-paper, text-ink, border-hairline */
  --color-paper: var(--color-paper);
  --color-paper-2: var(--color-paper-2);
  --color-surface: var(--color-surface);
  --color-ink: var(--color-ink);
  --color-graphite: var(--color-graphite);
  --color-slate: var(--color-slate);
  --color-aluminium: var(--color-aluminium);
  --color-hairline: var(--color-hairline);
  --color-signal: var(--color-signal);

  /* fonts → utilities like font-display, font-sans, font-mono */
  --font-display: var(--font-display);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}
```

Define the raw `:root` token block above this, then consume via Tailwind utilities or
`var(--token)` directly. **No duplicate color or font definitions anywhere else.**

---

## 3. Typography Hierarchy & Rules

### Heading hierarchy

- **Hero title** (`--text-display`, Fraunces 500) — one per page, in the hero. Never used elsewhere.
- **Section opener** (`--text-h1`, Inter 600) — top of each major section, paired with a mono label.
- **Sub-section** (`--text-h2`, Inter 600) — within sections.
- **Card title** (`--text-h3`, Inter 600) — product/project card titles.
- **Card label / inline** (`--text-h4`, Inter 600).

### The "mono label" pattern

Every major section opens with a small uppercase JetBrains Mono label above its heading, in
`--color-aluminium`. This is the signature rhythm marker — it telegraphs precision and structure.

```
[02 — SYSTEMS]                          ← mono-label, aluminium, uppercase, tracked
Sliding & fixed aluminium windows        ← h1, ink
A two-line statement of intent.          ← lead paragraph, graphite, measure-lead
```

The numeric prefix (`02 —`) increments per section per page and provides editorial wayfinding.

### Body rules

- Body runs at `--text-body` (17px), line-height 1.6, measure ≤64ch.
- Lead paragraphs use `--text-body-lg` (19px), measure ≤52ch, color `--color-graphite`.
- Never justify text. Always left-aligned (RTL-aware if needed later).
- Links in body: `--color-ink`, 1px underline at 30% offset, underline grows to full on hover
  (`--t-fast`). No color change on hover.
- Numbers, alloy grades, U-values, dimensions: set in JetBrains Mono inline
  (e.g. "U-value 1.4 W/m²K", "6063-T6 alloy").

---

## 4. Layout & Spacing

### 4.1 Grid

12-column grid at `--container-default` (1280px) with `clamp(20px, 5vw, 80px)` gutters. Use CSS
grid, not float/flex hacks, for multi-column layouts. Galleries use asymmetric grids (see §4.3).

### 4.2 Section spacing — varied on purpose

**Do not apply one section padding to every section.** Alternate between four rhythms to create
editorial pacing:

| Rhythm | Padding y | Used for |
|---|---|---|
| XL | `--section-y-xl` (128px) | Hero, closing CTA, philosophy statement |
| LG | `--section-y-lg` (96px) | Major content sections (services, projects) |
| MD | `--section-y-md` (64px) | Compact sections (specs, process steps) |
| SM | `--section-y-sm` (48px) | Strips, marquees, narrow inserts |

Alternate background between `--color-paper` and `--color-paper-2` between adjacent sections
(except where a dark section intervenes).

### 4.3 Layout variations (use several — never one repeated)

A premium minimal site reads as designed because **no two adjacent sections share a layout**.
Implement at least these five variations across the site:

1. **Full-bleed hero** — image fills viewport height (85–95vh), Fraunces display title overlaid on a
   35% ink gradient at the bottom; mono label + lead below the title; CTA pair at bottom-left.
2. **Editorial two-column** — narrow text column (5/12) left, image column (7/12) right, image
   bleeds to the container edge. Used for service detail blocks.
3. **Asymmetric gallery** — 12-col grid where project tiles span mixed columns/rows
   (e.g. 7+5, 4+8, 6+6 with row offsets). Never a uniform 3×3 grid.
4. **Centered statement** — single `--container-prose` (680px) column, Fraunces h1, lead paragraph.
   Used once per page for the philosophy/intent statement.
5. **Split spec list** — two columns: left a mono label list (alloy / U-value / glazing / finish),
   right the value list in mono. Reads as a technical data sheet. Used on product/spec sections.
6. **Full-bleed dark testimonial** — `--color-ink-2` background, paper-text Fraunces pull-quote,
   attribution in mono. Breaks the paper rhythm.
7. **Offset image bleed** — image starts inside the container on one side and bleeds off the
   viewport edge on the other. Creates editorial asymmetry on desktop.

### 4.4 Image proportions & art direction

- Hero: 16:10 or 21:9, full-bleed.
- Project tiles: mixed — 4:5 (portrait), 3:2 (landscape), 1:1 (square). Variety is the point.
- Product/system card thumbnails: 4:3 uniform.
- All images: `object-fit: cover`, `object-position` set per image (default center). No stretched
  images. No placeholder blurs of random color — use a `--color-paper-2` fill with a faint mono
  label until loaded.
- Image grain: optional 2% noise overlay on hero only, to soften photographic sharpness against the
  paper background.

---

## 5. Components

All components consume tokens only. Props listed are the minimum contract.

### 5.1 Header / Site Nav

- Sticky, transparent over hero, switches to `--color-paper` with `--shadow-header` after 24px scroll.
- Left: wordmark "NIRMAAN" in Inter 600, tracked +0.04em, 18px; small mono "ALUMINIUM HOUSE"
  beneath at 10px. (Replace with real logo asset when provided — see §8.)
- Center/right: nav links (Services, Projects, About, Contact) in Inter 500, 15px, `--color-graphite`,
  with a 1px aluminium underline that grows from 0→100% on hover (`--t-fast`).
- Right: a single text link "Get a quote →" in `--color-ink`, mono arrow, no button chrome.
- Active route link: full underline in `--color-ink`.
- Mobile: nav collapses into a refined full-screen overlay (see §6), not a dropdown.

### 5.2 Hero

- Full-bleed image, 90vh, `--container-bleed`.
- Overlay: bottom-anchored linear gradient `linear-gradient(to top, rgba(21,23,27,0.55), transparent 60%)`.
- Content block bottom-left within `--container-default` padding:
  - mono label `[ Nirmaan Aluminium House — Est. {{year}} ]` in paper/aluminium
  - Fraunces display title (≤8 words)
  - lead paragraph (≤22 words) in `--color-paper` at 90% opacity
  - CTA pair: primary "View systems →" (ink button, paper text) + secondary "Visit projects"
    (text link with paper underline)
- Entrance motion: title fades up 24px over 600ms, image scales 1.03→1 over 800ms (see §7).

### 5.3 Buttons

Two button styles only. Both 44px min height (touch), `--radius-sm` (4px), Inter 500 15px.

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| Primary | `--color-ink` | `--color-paper` | none | bg → `#000`, lift -1px |
| Secondary | transparent | `--color-ink` | 1px `--color-hairline` | bg → `--color-surface`, border → `--color-aluminium` |
| Signal (contact only) | `--color-signal` | `--color-paper` | none | darken 8% |

- Padding: `14px 24px`.
- Arrow suffix "→" in mono, translates +2px on hover (`--t-fast`).
- Disabled: `--color-mute` text, `--color-paper-2` bg, no border, `cursor: not-allowed`.
- Never more than two buttons in a row; never a button inside body copy.

### 5.4 Product / System Card

- `--color-surface` background, 1px `--color-hairline` border, `--radius-0` (square) on desktop,
  `--radius-md` on mobile.
- 4:3 image top, no border-radius mismatch with card.
- Body: mono label (system code, e.g. `NAH-SL-120`), h3 title, 2-line graphite summary, a mono
  spec row (e.g. `6063-T6 · 1.4 W/m²K`).
- Hover (desktop): image scales 1.0→1.03 (`--t-slow`), border → `--color-aluminium`, a 1px
  aluminium underline grows under the title.
- Whole card is a link (`<a>`), no separate "read more".

### 5.5 Project Gallery

- Asymmetric 12-col grid (see §4.3 variation 3). Project tiles span mixed columns/rows.
- Each tile: full-bleed image, title + mono location label revealed on hover at bottom-left over a
  subtle gradient (desktop). On mobile, title is always visible below the image (no hover reliance).
- Clicking opens the Project detail route (not a lightbox).
- Gallery page shows 6–9 projects; individual project page shows a full-bleed hero + editorial
  two-column spec + image strip.

### 5.6 Service / System Section

- Editorial two-column (variation 2): text 5/12, image 7/12.
- Text column: mono label, h2, lead paragraph, a 3-row split spec list (system / glazing / finish),
  primary button.
- Image column: single 4:5 image bleeding to the container edge.
- Repeat the pattern for each system (sliding, casement, fixed), alternating image side per system.

### 5.7 Content / Process Section

- Numbered steps (01 / 02 / 03 / 04) in mono, each step a row: left mono number + h3 title,
  right body paragraph. 1px hairline divider between rows.
- Used for the fabrication process (Consult → Detail → Fabricate → Install).
- Vertical rhythm: `--section-y-md`.

### 5.8 Testimonial

- Full-bleed dark variation (§4.3 #6): `--color-ink-2` background, `--section-y-lg`.
- Fraunces h2 pull-quote (`--text-h1` size), `--color-paper`, measure ≤18ch wide centered.
- Attribution below in mono: name, role, project — `--color-aluminium`.
- One per page, maximum. No carousel. No star ratings.

### 5.9 CTA Section (closing)

- `--section-y-xl`, `--color-paper` background.
- Centered `--container-prose`: mono label `[ Start a project ]`, Fraunces h1 ("Let's detail your
  next build."), short lead, primary Signal button "Message on WhatsApp" + secondary "Email the
  studio" text link.
- Below: a single row of mono meta (response time, service area, lead time) — three items, hairline
  separated.

### 5.10 Footer

- `--color-ink-2` background, `--color-paper` text, `--section-y-lg` padding.
- Four columns: (1) wordmark + one-line positioning + address; (2) Sitemap (routes); (3) Systems
  (product links); (4) Contact (email, phone, WhatsApp) — all in mono labels.
- Bottom bar: mono row — © year Nirmaan Aluminium House, "Designed & built in-house", a "Back to
  top ↑" text link right-aligned.
- No social icons unless real accounts are provided (see §8 placeholders).

---

## 6. Responsive Behavior

**Rule: mobile is designed, not stacked.** Each breakpoint has intentional layout, not a vertical
collapse of the desktop.

### Desktop (≥1024px)
- Full nav visible. Multi-column grids (asymmetric galleries, editorial two-column). Display type
  at full clamp max. Hover states active.

### Tablet (768–1023px)
- Nav collapses to overlay (below 1024). Galleries move from 12-col asymmetric to a 6-col
  two-up grid with retained asymmetry (one tile per row spans full width as a feature).
  Editorial two-column collapses to single column but the image retains its bleed on one side.
  Type runs at clamp mid-range. Touch targets ≥44px.

### Mobile (<768px)
- **Do not simply stack everything.** Specifics:
  - Hero: single column, title at `--text-display` clamp min, image 80vh, CTA pair becomes
    full-width stacked buttons (primary then secondary).
  - Galleries: 2-column mini-grid (not 1-column) for project tiles; feature tile spans both
    columns. This preserves the "designed grid" feel on mobile.
  - Service sections: image first, then text (reverse of desktop reading order on mobile so the
    system is seen before the spec).
  - Spec lists: stay two-column (mono label / value) down to 480px, then collapse to label-above.
  - Footer: 2-column on mobile (not 1-column) — sitemap+systems in one column, contact+brand in
    the other.
- Mobile nav overlay: full-screen `--color-paper` panel, links in Fraunces h2 stacked with generous
  32px gaps, a mono contact line at the bottom, close affordance top-right ("Close ✕" in mono).
  Slide/fade in over 300ms. Locks body scroll.
- Touch targets ≥44×44px. No hover-only affordances — hover states also trigger on focus.

---

## 7. Motion & Animation

Use Framer Motion where motion is non-trivial (scroll reveals, mobile menu, image zoom). Use CSS
transitions for simple hover/focus. **Respect `prefers-reduced-motion`** globally: when set to
`reduce`, disable all transforms and scroll-triggered motion; keep only instant opacity changes.

### Documented motion patterns (only these)

| Pattern | Element | Implementation |
|---|---|---|
| Fade-up on enter | section headings, cards, spec rows | y: 16px → 0, opacity 0→1, 500ms `--ease-out`, stagger 60ms between siblings, once (`whileInView`, `viewport={{ once: true }}`) |
| Hero entrance | hero title + lead | y: 24px → 0, opacity 0→1, 600ms, image scale 1.03→1 over 800ms |
| Image hover zoom | product/project images | scale 1.0→1.03, 500ms `--ease-out` |
| Nav underline grow | nav links | width 0→100%, 150ms `--ease-out`, from left |
| Button arrow nudge | buttons with "→" | translateX 0→2px, 150ms |
| Mobile menu open | overlay | opacity 0→1 + y 8px→0, 300ms; lock body scroll |
| Header state on scroll | sticky header | transparent → paper bg + `--shadow-header`, 200ms |

**Forbidden motion:** parallax, marquee carousels of testimonials, count-up numbers, autoplaying
image sliders, bounce/elastic easing, anything that runs on a timer (not tied to user scroll or
interaction), any motion longer than 800ms.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Framer Motion: set `MotionConfig` with `reducedMotion="user"` at the app root so motion components
also respect the user preference automatically.

---

## 8. Content & Placeholders

Until real Nirmaan content is supplied, use **clearly-marked realistic placeholders** so the build
is reviewable end-to-end. Mark every placeholder with the convention `{{PLACEHOLDER: description}}`
in copy, and a `--color-paper-2` fill with a faint mono label for images.

### Required placeholders to surface

| Placeholder | Notes |
|---|---|
| `{{NIRMAAN_LOGO}}` | SVG wordmark; until provided, render the typographic wordmark in §5.1 |
| `{{ESTABLISHED_YEAR}}` | founding year for hero mono label |
| `{{SERVICE_AREA}}` | e.g. "Bengaluru & Karnataka" — used in CTA meta |
| `{{CONTACT_EMAIL}}` | studio email |
| `{{CONTACT_PHONE}}` | with country code |
| `{{WHATSAPP_NUMBER}}` | for Signal CTA `https://wa.me/<number>` |
| `{{ADDRESS_LINE}}` | workshop address for footer |
| `{{PROJECT_IMAGES}}` | 6–9 project photos; placeholder fill + mono "PROJECT — {{name}}" until supplied |
| `{{SYSTEM_SPECS}}` | real alloy/U-value/glazing values per system; use realistic defaults (6063-T6, 1.4 W/m²K, double-glazed) marked as defaults |
| `{{TESTIMONIAL}}` | one real quote + attribution; placeholder until supplied |
| `{{SOCIAL_ACCOUNTS}}` | omit footer social row entirely until real accounts exist |

All realistic defaults (alloy grades, U-values, lead times) must be marked with a mono
`[ default — verify ]` tag so they are not mistaken for committed product data.

---

## 9. Implementation Notes for Nirmaan

1. **Framework:** Next.js (App Router) + TypeScript + Tailwind v4 + Framer Motion. No other UI
   dependency unless a component in §5 genuinely requires it.
2. **Routes:** `/` (Home), `/services` (Systems index), `/services/[slug]` (System detail),
   `/projects` (Gallery), `/projects/[slug]` (Project detail), `/about`, `/contact`. Keep route
   names lowercase, kebab-case.
3. **Images:** use `next/image` with explicit `width`/`height` or `fill` + sized parent. Provide a
   blur placeholder (`blurDataURL`) only from real images; for placeholders use the paper-2 fill.
4. **WhatsApp integration:** the Signal CTA links to `https://wa.me/{{WHATSAPP_NUMBER}}?text=...`
   with a prefilled, specific message per context (e.g. "I'd like to discuss sliding doors for a
   residential project."). `target="_blank"`, `rel="noopener noreferrer"`.
5. **Contact form:** server-side submission (Next.js Route Handler or Server Action). Fields: name,
   project type (select: residential / commercial), location, message. Validate server-side; on
   success show an inline confirmation, never an alert. Honeypot field for spam, no CAPTCHA unless
   requested.
6. **No e-commerce, no pricing, no cart, no checkout.** Nirmaan is a specification-and-quote
   business. The conversion path is "view system → contact / WhatsApp".
7. **No standalone `/admin` invoice generator** in this build (it was part of a prior project and
   is intentionally out of scope here; do not reintroduce it).
8. **Accessibility:** semantic landmarks, `aria-current` on active nav, focus-visible rings using
  `--color-focus`/`--color-focus-ink`, skip-to-content link, alt text on all images, color
   contrast per §2.1.
9. **Performance:** self-host fonts via `next/font`, subset where possible; lazy-load below-the-fold
   gallery images; LCP target < 2.5s on the hero. No layout shift from fonts or images.
10. **Don't** introduce random generated images, stock photos of unrelated work, or AI-generated
    fabrication imagery as if it were Nirmaan's own. Use the placeholder fill until real photos
    are supplied.

---

## 10. Validation Checklist (apply before "done")

- [ ] All colors come from `--color-*` tokens; no hex literals in components.
- [ ] All type sizes come from `--text-*` tokens or the fluid clamp values.
- [ ] Section vertical padding varies (XL/LG/MD/SM) — not one uniform value.
- [ ] At least 5 distinct layout variations are used across the home page.
- [ ] No two adjacent sections share both background color and layout.
- [ ] Mobile layout is intentionally designed (2-col galleries, 2-col footer), not just stacked.
- [ ] `prefers-reduced-motion` disables all transforms and scroll motion.
- [ ] Every image has explicit dimensions; no CLS.
- [ ] Focus-visible rings present on all interactive elements, on light and dark.
- [ ] No placeholder text left unmarked (every `{{...}}` is visible and intentional).
- [ ] Production build (`next build`) passes with zero TypeScript and zero ESLint errors.
- [ ] No console errors on any route; mobile menu opens/closes; WhatsApp link resolves.
