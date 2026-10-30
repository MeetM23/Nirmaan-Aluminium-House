# Antigravity Build Prompt — Nirmaan Aluminium House

> Paste everything below this line into Google Antigravity as your opening prompt.
> Keep `design.md` in the project root before you start — it is the authoritative design spec and
> this prompt references it constantly. Do not paraphrase or "summarise" design.md; read it whole.

---

## What to build

A multi-page marketing website for **Nirmaan Aluminium House**, a bespoke aluminium windows &
doors fabrication practice serving architectural residential and commercial projects. The site must
feel premium, minimal, editorial and architectural — the visual language of a high-end design
studio, not a commodity fabricator. It should communicate craftsmanship, precision and trust
through restraint: strong typography, generous whitespace, full-bleed imagery, hairline borders
instead of shadows, and a strictly monochrome material-honest palette (warm paper, charcoal ink,
aluminium greys).

The design language is a considered interpretation of **Duna's** premium-minimal idiom, adapted to
Nirmaan's aluminium-fabrication brand. The full spec lives in **`design.md`** — treat it as the
source of truth for every token, type size, spacing value, component rule, layout variation and
motion pattern. When this prompt and design.md disagree, **design.md wins.**

## Tech stack

- Next.js (App Router), TypeScript, React Server Components by default; `"use client"` only where
  interactivity demands it (mobile menu, scroll-reveal, contact form state).
- Tailwind CSS v4 (`@import "tailwindcss"` + `@theme inline` mapping tokens to utilities).
- Framer Motion for the documented motion patterns only. Wrap the app in
  `<MotionConfig reducedMotion="user">`.
- `next/font/google` to self-host **Fraunces** (display serif), **Inter** (sans) and
  **JetBrains Mono** (mono). No other fonts. No external font CDN.
- No other dependencies unless a component in design.md §5 genuinely requires it. State the reason
  in the plan if you propose any extra dependency.

## Routes

```
/                      Home
/services              Systems index (sliding, casement, fixed)
/services/[slug]       System detail
/projects              Project gallery
/projects/[slug]       Project detail
/about                 Studio / process / philosophy
/contact               Contact form + WhatsApp + studio details
```

Route names are lowercase, kebab-case. Do not add e-commerce routes, pricing pages, a cart, a
checkout, or any `/admin` route. Nirmaan is a specify-and-quote business; the only conversion
path is "view system → contact / WhatsApp".

## Content handling

Until real Nirmaan content is supplied, use **realistic placeholders** so the build is reviewable
end-to-end. Every placeholder must use the exact convention `{{PLACEHOLDER: description}}` in copy,
and a `--color-paper-2` fill with a faint JetBrains Mono label for images. Realistic technical
defaults (alloy grades, U-values, lead times) must carry a mono `[ default — verify ]` tag so they
are not mistaken for committed product data. The full placeholder list is in design.md §8 — surface
every one of them; do not silently invent committed facts (founding year, address, phone, WhatsApp
number, project names, testimonials).

## Plan-first (do this before writing any code)

Before generating any files, produce a **plan artifact** and ask me to approve it. The plan must
contain:

1. **Folder tree** — the full `app/` (or `src/app/`) structure, every route, every component file,
   the `lib/` or `data/` files for systems and projects, and where `design.md` lives.
2. **Token wiring** — exactly how `:root` CSS variables and the `@theme inline` block in
   `globals.css` map to Tailwind utilities (paper, ink, graphite, aluminium, hairline, signal;
   font-display, font-sans, font-mono). Confirm no duplicate color/font definitions anywhere.
3. **Component inventory** — the shared components you will create (Header, Footer, Button,
   MonoLabel, SystemCard, ProjectTile, SectionHeader, etc.) and which routes reuse each.
4. **Data shape** — the TypeScript types for a `System` and a `Project`, and the placeholder data
   files that back them.
5. **Layout-variation map** — which of the seven layout variations from design.md §4.3 each
   section of the home page uses, confirming no two adjacent sections share both background and
   layout.
6. **Motion inventory** — exactly which Framer Motion patterns you will use (from design.md §7)
   and the `MotionConfig` setup. Confirm the `prefers-reduced-motion` CSS block is present.
7. **Phased task list** — the seven phases below as a checklist I can track.

Do not write a single file until I approve this plan. If I request changes, revise the plan and
re-request approval.

## Phased execution (after plan approval)

Work phase by phase. After each phase, pause and let me verify before continuing.

**Phase 1 — Tokens & typography.**
Create `globals.css` with the full `:root` token block and `@theme inline` mapping from design.md
§2. Wire the three `next/font` setups. Add the base element styles (body on `--color-paper`,
`--text-body` size, left-aligned, no justify). Add the `prefers-reduced-motion` CSS block. Confirm
`bg-paper`, `text-ink`, `font-display`, `border-hairline` etc. all resolve.

**Phase 2 — Shared layout.**
Build `Header` (sticky, transparent-over-hero, paper-on-scroll, mobile full-screen overlay nav),
`Footer` (4-column dark, 2-column on mobile), `MonoLabel` (the `[ 02 — SYSTEMS ]` signature),
`SectionHeader`, and the two `Button` variants + the Signal variant. Build the mobile nav overlay
with body-scroll lock. Confirm hover states also fire on focus.

**Phase 3 — Home page.**
Assemble the home page using **at least five** distinct layout variations from design.md §4.3,
with varied section spacing (XL/LG/MD/SM) and alternating `paper` / `paper-2` backgrounds. Include:
full-bleed hero, systems section (editorial two-column, image side alternating per system),
asymmetric project gallery preview, centered philosophy statement, full-bleed dark testimonial,
process section (numbered rows), closing CTA with the single Signal WhatsApp button.

**Phase 4 — Remaining routes.**
Build `/services` (index of system cards), `/services/[slug]` (editorial two-column + split spec
list + image strip), `/projects` (asymmetric gallery), `/projects/[slug]` (full-bleed hero +
editorial spec + image strip), `/about` (centered statement + process + one testimonial),
`/contact` (form + WhatsApp + studio details). The contact form submits via a Route Handler or
Server Action, validates server-side, shows inline confirmation (never `alert`), and includes a
honeypot. No CAPTCHA.

**Phase 5 — Responsive.**
Implement the documented responsive behaviour from design.md §6. Mobile must be intentionally
designed, not stacked: 2-column mini-grids for galleries and footer, image-first ordering for
service sections on mobile, spec lists staying two-column down to 480px. Touch targets ≥44px.
Verify the mobile nav overlay opens/closes cleanly and locks scroll.

**Phase 6 — Motion.**
Implement only the seven documented motion patterns from design.md §7 (fade-up on enter, hero
entrance, image hover zoom, nav underline grow, button arrow nudge, mobile menu open, header state
on scroll). Use Framer Motion with `whileInView`/`viewport={{ once: true }}` for reveals. Confirm
`<MotionConfig reducedMotion="user">` wraps the app and the reduced-motion CSS block disables all
transforms. Remove any motion you added that isn't in the documented list.

**Phase 7 — Validation.**
Run `next build`. Fix every TypeScript and ESLint error. Then verify the checklist at the end of
this prompt and report results.

## Hard constraints (do not break these)

1. Do not add e-commerce, pricing, cart, or checkout functionality — anywhere.
2. Do not create an `/admin` route or any invoice-generation tool. It is explicitly out of scope.
3. Do not replace placeholder image fills with random generated images, unrelated stock photos, or
   AI-generated fabrication imagery presented as Nirmaan's own work. Keep the `--color-paper-2`
   fill + mono label until real photos are supplied.
4. Do not introduce committed business facts (founding year, address, phone, WhatsApp number,
   project names, testimonials, client logos) — use the `{{PLACEHOLDER: ...}}` convention for all
   of them.
5. Do not add UI dependencies beyond Framer Motion. No component libraries (MUI, shadcn, etc.) —
   the components in design.md §5 are hand-built from tokens.
6. Do not use saturated colors anywhere except the single Signal CTA (`--color-signal`) on contact.
   No gradients except the hero image overlay. No shadows except the two documented in design.md §2.7.
7. Do not use emoji, exclamation marks, or marketing clichés ("cutting-edge", "world-class",
   "best-in-class") in any copy.
8. Do not paraphrase or summarise design.md. Read it whole and apply it literally.
9. Do not rename the routes listed above.
10. Do not skip the plan-first gate. No code before plan approval.

## Aesthetic direction (sensory guidance)

- **Paper, not white.** The background is a warm off-white (`#F5F4F1`), never pure `#fff` except
  on card surfaces. This is the single most important color decision — it sets the editorial tone.
- **Sharp, not soft.** Square corners on images and most cards; 4px only on buttons/inputs; 8px
  only on mobile cards. No rounded-2xl. No pill shapes except mono status badges.
- **Hairlines, not shadows.** Separate elements with 1px `--color-hairline` borders and whitespace.
  The only shadows are the sticky header and the floating mobile menu.
- **Quiet type, loud hierarchy.** Inter for almost everything; Fraunces only for the hero title,
  section openers and the testimonial pull-quote. JetBrains Mono for every label, spec and
  measurement — it is the rhythm instrument of the whole site.
- **Asymmetry, not grids-of-equal-cards.** Galleries use mixed column/row spans. Service sections
  alternate the image side. No section should look like the one next to it.
- **Restraint over richness.** If a feature is not in design.md, do not build it. If a motion is
  not in design.md §7, do not add it.

## Verification (do this in Phase 7 and report back)

1. Run `next build` and paste the output. It must finish with zero TypeScript and zero ESLint
   errors. Report any warnings.
2. Start the production server and visit every route: `/`, `/services`, `/services/[slug]` (with a
   placeholder slug), `/projects`, `/projects/[slug]`, `/about`, `/contact`. Confirm each renders
   without a console error.
3. Use Computer Use (Chrome) to capture screenshots of: home (desktop), home (mobile ≈390px),
   a system detail page, the project gallery, the contact page, and the mobile nav overlay open.
   Provide these as a walkthrough artifact.
4. Confirm against the design.md §10 checklist — go through each item and report pass/fail with a
   one-line note. Specifically confirm:
   - No hex literals in component files (only token utilities / `var(--...)`).
   - Section vertical padding varies (XL/LG/MD/SM), not one uniform value.
   - At least five distinct layout variations on the home page.
   - Mobile galleries and footer are 2-column, not 1-column stacked.
   - `prefers-reduced-motion: reduce` disables all transforms and scroll motion (test it).
   - Every `{{PLACEHOLDER: ...}}` is visible and intentional; nothing silently invented.
   - The Signal color appears at most once per page, only on the contact/WhatsApp CTA.
   - The mobile menu opens, closes, and locks body scroll.
   - The WhatsApp link resolves to `https://wa.me/{{WHATSAPP_NUMBER}}` in a new tab.
5. Do not claim pixel-perfect fidelity to Duna — I will do the visual comparison myself. Report
   what you built against the spec honestly, including anything you deviated from and why.

## Handoff

When done, the deliverable is a runnable Next.js project plus the screenshots/walkthrough artifact.
Leave `design.md` in the project root. List every `{{PLACEHOLDER: ...}}` still present in a final
summary so I know exactly what real content to supply next.
