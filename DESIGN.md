---
name: Richard Vivanco Portfolio
description: A diffusion model rendering its author; one latent point field denoises into a form per section.
colors:
  ground: "#05070d"
  surface: "#0a0e18"
  surface-2: "#0f1522"
  ink: "#e9ecf2"
  muted: "#9aa3b5"
  faint: "#5d667a"
  line: "rgb(233 236 242 / 0.11)"
  line-strong: "rgb(233 236 242 / 0.22)"
  signal: "#3ee6ff"
  signal-ink: "#021016"
  dream: "#ff4fd8"
  ok: "#4dffa6"
  warn: "#ffb547"
  danger: "#ff6b7a"
typography:
  display:
    fontFamily: "Unbounded, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 12.5vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Unbounded, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 7vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Unbounded, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
  ui:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.4
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  data:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.12em"
    fontFeature: "tnum"
  readout:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.16em"
rounded:
  none: "0px"
spacing:
  gutter-sm: "16px"
  gutter-md: "24px"
  gutter-lg: "32px"
  column-gap: "40px"
  section-top-sm: "64px"
  section-top-lg: "112px"
  control: "40px"
  control-lg: "48px"
  submit: "56px"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "{spacing.control-lg}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "{spacing.control-lg}"
  button-secondary-hover:
    textColor: "{colors.signal}"
  button-icon:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    size: "{spacing.control}"
  input-field:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  chip-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "{spacing.control}"
  chip-toggle-on:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "32px"
  mobile-dock:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.muted}"
    height: "64px"
---

# Design System: Richard Vivanco Portfolio

## Overview

**Creative North Star: "The Latent Field"**

The page is a diffusion sampler rendering its author. One persistent WebGL point field sits behind the content and denoises into a different formation per section (portrait, helix, brain, device, portal). Scrolling is sampling. Every other surface is quiet so the field can be the image: an ink-black ground, bone text, and one phosphor-cyan signal color doing almost all of the accent work.

The chrome is a HUD, not a dashboard. It uses 1px hairline rules, square corners, crosshair corner ticks on the stages where the field lands, and mono readouts that report what the model is doing (step counters, formation names, system status). Depth comes from the field and from content resolving out of blur. The system does not use shadows, glows or glass. Density is editorial. Prose sits at 15px in Geist with roomy line height. Structure comes from rules and columns, not boxes.

Magenta is the model "dreaming". It appears where the field disperses between formations and in the moments where AI is actually doing the work. Its rarity carries the meaning.

**Key Characteristics:**
- One persistent latent point field; each section owns a stage that the field morphs into.
- Ink ground, bone text, cyan signal; magenta only for dispersal and AI moments.
- Square corners everywhere; 1px hairlines; crosshair ticks on stages.
- Three voices: Unbounded for display, Geist for UI and prose, JetBrains Mono for machine output.
- Motion is sampling: scroll-linked morph, glyph-denoise headings, blur/perspective reveal; reduced motion resolves everything in place.
- Dark is canonical; a light theme remaps the same roles.

## Colors

The palette is a night-vision instrument: near-black ground, cool bone text, one phosphor accent, and a latent magenta held in reserve.

### Primary
- **Phosphor Signal** (signal): The accent of record. Use it for primary action fills, active nav underlines, focus outlines, selection, caret, timeline nodes, bullet dashes, the second line of the hero name, and the field's resolved points. Text on a signal fill is always **Signal Ink** (signal-ink).

### Secondary
- **Latent Magenta** (dream): The field's dispersal color. The shader mixes it in only while points are scattered between formations. In the DOM it appears only on AI moments: a 40%-alpha hairline frames the Neural Networks & AI block and its icons, and it marks the scanner's AI advice line.

### Tertiary (status)
- **System Green** (ok): Live/operational status dots, confidence values, success states, the "graduated" status tag.
- **Amber** (warn): Reserved for warnings. It is defined in both themes.
- **Alarm Rose** (danger): Form error frame (50% alpha) and error icon.

### Neutral
- **Latent Ground** (ground): Page background, header, dock, form fields, modal scrim (85% alpha).
- **Surface** (surface): Raised panels such as the proposal form card, project modal and sidebar tooltip.
- **Surface 2** (surface-2): Second tonal step, reserved for nested panels.
- **Bone** (ink): Headings, primary text, values.
- **Muted** (muted): Body prose, inactive nav, icon buttons at rest.
- **Faint** (faint): Mono readouts, dates, tech-stack lines, placeholders, field labels in lists.
- **Hairline** (line): Default 1px rule, panel borders, section dividers, HUD grid.
- **Hairline Strong** (line-strong): Rules that need to hold an edge: secondary button borders, form card, modal, stage ticks, hover state of hairline controls.

The light theme (`[data-theme="light"]`) remaps every role to a cool paper ground and a deep-teal signal. The roles do not change, only the values (see sidecar).

### Named Rules
**The One Signal Rule.** Cyan is the only interactive accent. Primary fills, focus and active states all use signal and nothing else.

**The Dreaming Rule.** Magenta means the model is generating. It belongs to the field's dispersal and to AI-at-work moments. Never use it for navigation, chrome or decoration.

## Typography

**Display Font:** Unbounded (700, 800; fallback ui-sans-serif, system-ui)
**Body Font:** Geist (400, 500, 600; fallback ui-sans-serif, system-ui, Segoe UI)
**Label/Mono Font:** JetBrains Mono (400, 600; fallback ui-monospace, Menlo, Consolas)

All three are self-hosted woff2 with `font-display: swap`.

**Character:** Unbounded is wide, heavy and set uppercase with tight negative tracking, so the name and section titles land like formations. Geist is neutral and does the talking. Mono is the machine's voice and appears only where the system reports something.

### Hierarchy
- **Display** (Unbounded 800, clamp(2.6rem, 12.5vw, 6rem), 0.92, uppercase): The hero name only. The second line is in signal.
- **Headline** (Unbounded 700, clamp(1.9rem, 7vw, 3.5rem), 1, uppercase): Section titles. They resolve out of glyph noise.
- **Title** (Unbounded 700, 1.25 to 2.25rem, uppercase, -0.02em): Project titles, the AI block title, the form success title, the scanner kcal figure.
- **UI** (Geist 600, 15px; 14px in compact controls): Buttons, actions, tabs.
- **Body** (Geist 400, 15px, 1.625; hero lede 18 to 20px 500): Prose, held to max 46 to 65ch.
- **Label** (Geist 500 to 600, 14px; 11 to 12px in dock and status tags): Field labels, sub-headings, nav (13px, 0.06em tracking).
- **Data** (JetBrains Mono 400, 11 to 12px, 0.12 to 0.14em tracking, tabular): Dates, tech-stack lines (joined with "  /  "), numeric readouts, scanner results, CLI prompt line (12 to 13px).
- **Readout** (JetBrains Mono 400, 10px, 0.16em, uppercase): Stage corner readouts (`formation: …`, step counter).

### Named Rules
**The Three Voices Rule.** Unbounded names things: the person, the sections, the projects. Geist does everything a person reads or presses: actions, nav, labels and prose. JetBrains Mono is only for what the machine reports: the CLI prompt, stage readouts, dates, tech-stack tokens, numeric data and system status lines.

**The Uppercase Belongs to Display Rule.** Uppercase is for Unbounded display and the tiny mono readouts. Geist UI stays in sentence case.

## Layout

The page is a single column on phones and a 12-column grid on desktop (`lg`, 1024px) inside a 1400px container with a 40px column gap. Sections are separated by a full-width 1px hairline and open with 64px top padding (112px on desktop). Gutters are 16px, 24px from `sm`, and 32px on desktop.

Each content section pairs a **stage** with its copy. On desktop the stage is sticky (top 96px, height `100svh - 8rem`) and takes 4 to 6 columns, alternating sides. On phones it stacks above the copy at 40 to 46svh. The hero inverts this order: the stage is on the right on desktop and on top on phones.

Desktop chrome: a 64px sticky header with a bottom hairline, plus a fixed 64px left rail (the formation progress line and socials). Phone chrome: a fixed 64px bottom dock with five sections, safe-area padded. The footer pads 96px on phones to clear it.

Control heights follow a fixed ladder: 40px (icon buttons, chips, secondary links), 48px (hero actions), 56px (form submit), 64px (dock items, social tiles).

## Elevation & Depth

The system is flat and uses no shadows. Depth comes from three things. First, the WebGL field behind the content. Second, tonal steps (ground, surface, surface-2) with hairline borders. Third, motion along the z-axis: content arrives from `perspective(900px) translate3d(0, 28px, -60px) rotateX(10deg)` with a 10px blur and settles flat. Project frames tilt gently toward a fine pointer (up to 7 degrees). Modals sit on an 85% ground scrim with no backdrop blur.

### Named Rules
**The No Halo Rule.** No box-shadows, drop-shadow glows or backdrop-filter glass. An element that needs separation gets a hairline or a tonal step.

**The Sampling Motion Rule.** Motion depicts denoising. The field morphs between formations as you scroll. Headings resolve from random glyphs over about 900ms. Blocks rise out of blur and perspective with an expo-out ease and a 70ms stagger. Under `prefers-reduced-motion` the field shows final formations without interpolation, text renders resolved, and reveals are static.

## Shapes

Every corner is square (0px), including scrollbars, status dots and timeline nodes. Every border is 1px. Stages carry **crosshair ticks**: 14px L-shaped hairlines at each corner in line-strong instead of a full frame. The same tick device frames the scanner's detection box. Bullets are 8px horizontal signal dashes rather than dots. The timeline is a 1px left rule with 10px square nodes. The scanner uses dashed borders for its detection box (signal at 70%) and empty state.

## Components

### Buttons
Flat, square and decisive.
- **Shape:** Square (0px).
- **Primary:** Signal fill, signal-ink text, Geist 600 15px, 48px tall with 24px side padding (56px full-width for form submit). One primary per view region.
- **Hover / Focus:** Hover lowers opacity to 0.85 over 200ms, and trailing arrows nudge 2px along their direction. Focus is a 2px signal outline at 3px offset (global).
- **Secondary:** Transparent with a line-strong hairline and ink text. On hover, border and text go to signal.
- **Quiet link-button:** No border, muted text, ink on hover (e.g. "view code").
- **Icon button:** 40px square, hairline border, muted icon. On hover the border goes to line-strong and the icon to ink.

### Chips
- **Style:** 40px square-cornered toggles with a hairline border and muted Geist 14px text.
- **State:** Pressed is a signal fill with signal-ink text. The language switch is a segmented pair of the same chips inside one hairline frame.

### Cards / Containers
- **Corner Style:** Square (0px).
- **Background:** Ground by default; surface for the form card and modals.
- **Shadow Strategy:** None (see Elevation & Depth).
- **Border:** line for sections and lists; line-strong for the form card and modals; dream at 40% only on the AI block.
- **Internal Padding:** 20px on phones, 32px from `sm`.
- Project entries are not cards. Each is a top-hairline row with a 16:9 screenshot frame, an Unbounded title with a mono date, and two bullets.

### Inputs / Fields
- **Style:** Ground fill, 1px line border, square, 12px by 16px padding, Geist 15px. Placeholder in faint. The label sits above in Geist 14px 500 muted.
- **Focus:** The border shifts to signal, with no ring or glow.
- **Error:** An inline block with a 50% danger hairline and a danger icon. The text stays ink.

### Navigation
- **Desktop header:** Geist 13px 500 links with 0.06em tracking, muted, ink on hover. The active link is signal with a 1px signal underline that scales in from the center along the header's bottom rule (500ms expo-out).
- **Left rail:** A vertical hairline with a signal progress fill. Square 8px nodes fill with signal up to the active formation. Hover shows a mono tooltip.
- **Mobile dock:** A five-column grid of 64px items with an 18px icon over an 11px Geist label. The active item is signal with a top 1px signal bar.

### Stage (signature)
A ticked, `aria-hidden` box that the latent field anchors a formation to. It is empty in the DOM except for a bottom-edge readout row in mono 10px uppercase faint: the formation name on the left and an optional note on the right (hero: live `step NN/50`, then "denoised").

### CLI Prompt
A mono 12 to 13px line, `rv@latent:~$` (user in ok, path in faint), followed by the prompt text and a blinking signal block caret. It appears above the hero name and in the terminal drawer.

## Do's and Don'ts

### Do:
- **Do** keep every corner square (0px) and every rule 1px; use line for structure and line-strong where an edge must hold.
- **Do** give each new section a ticked stage for the latent field and a Unbounded uppercase headline that denoises from glyph noise.
- **Do** use signal for every primary action, active state and focus outline (2px, 3px offset), with signal-ink text on signal fills.
- **Do** set actions, nav, labels and prose in Geist; reserve JetBrains Mono for the CLI prompt, stage readouts, dates, tech-stack tokens, numeric data and status lines.
- **Do** reveal content with the blur and perspective rise (`cubic-bezier(0.16, 1, 0.3, 1)`, 70ms stagger) and make it resolve statically under reduced motion.
- **Do** keep prose at 15px, line-height 1.625, max 65ch.

### Don't:
- **Don't** use magenta (dream) outside the field's dispersal and AI-at-work moments.
- **Don't** add box-shadows, glows, drop-shadow halos or backdrop-blur glass.
- **Don't** round corners, including pills, avatars and badges.
- **Don't** set buttons, nav or body copy in mono, or set data and readouts in Geist.
- **Don't** wrap projects or skills in a grid of equal bordered cards; use hairline rows beside a stage.
- **Don't** put a mono label line above a title as a kicker; readouts live in stage corners and beside data.
