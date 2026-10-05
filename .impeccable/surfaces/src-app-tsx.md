---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Portfolio home (single page)

Scope: the whole portfolio page (src/App.tsx and presentation components). Mode: Experience (the work leads), with a Persuade close (contact form + CV).

Audience/job: recruiters and freelance clients, phone first. Action: send the proposal form, open the CV. Proof: DK-Fitt AI scanner demo, project screenshots, repos, experience timeline.

Constraints: keep terminal/HUD identity, all resumeData content, ES/EN switch (now visible), formsubmit.co form, CLI drawer, theme toggle, resume modal. Fast on phones; prefers-reduced-motion = static.

Open: primary language (auto-detected from browser for now); unverified hardcoded commit/LOC stats kept as content, not amplified.

## Direction contract

THESIS: The portfolio is a diffusion model rendering its author. One persistent 3D latent field of points denoises into a form per section; scrolling is sampling. Refuses the category default: hero card + grid of equal cards on a neon grid.

OWN-WORLD: Ink-black latent ground (#05070d), phosphor cyan signal (#3ee6ff), latent magenta (#ff4fd8) used only where the model is "dreaming" (transitions, AI moments), bone text (#e9ecf2). Unbounded display, Geist body, JetBrains Mono strictly for CLI lines, timesteps, data. Hairline 1px HUD rules, square corners, crosshair ticks; no glow halos, no glass.

STORY: Visitor sees Richard generated out of noise, learns Full Stack + AI + Mobile in one line, watches the same field become his career path, a wireframe brain, a phone, then a portal into the form. Believes AI is his material. Sends a proposal or opens the CV.

FIRST VIEWPORT: Phone: particle portrait of Richard fills the top ~58% denoising from step 50→0 with a live mono step counter; under it the name in Unbounded at ~13vw, role line, two actions (Send proposal primary, Resume). Desktop: portrait field right 55%, name/role/actions left, CLI prompt line above name. Bottom dock on phone carries the section nav.

FORM: Pinned brief (terminal/HUD + AI + surreal 3D), no roll; latent-field-as-page, first on the ordered list. Seed key: none (brief-pinned).

Signature interaction: scroll-linked latent morph between formations (portrait → helix → brain → phone → portal), with section headings resolving from glyph noise; reduced motion shows final formations without interpolation.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
