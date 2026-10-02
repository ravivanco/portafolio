# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences with equal weight:

- **Tech recruiters and engineering managers** screening a junior/early-career engineer. They usually arrive from a phone (LinkedIn, GitHub, a shared link), skim for role fit, stack, and proof of shipped work, then download the CV or get in touch.
- **Freelance clients** (small businesses, local organizations) looking for someone to build a mobile app, web platform, or AI-assisted product. They need to see finished projects and a low-friction way to send an inquiry.

## Product Purpose

Personal portfolio of Richard Alexis Vivanco Chicaiza, a Software Engineering graduate from Universidad de las Fuerzas Armadas ESPE-L (Quito, Ecuador). It exists to turn a visit into a job proposal, a freelance inquiry, or a CV download. Success = a submitted contact form, an email, or a resume opened.

## Positioning

**Full Stack + AI + Mobile.** The differentiator is shipped work that joins all three: DK-Fitt (thesis) pairs a React Native app with computer-vision calorie estimation and a nutritionist web dashboard; NutriSportFit adds a cloud recommendation engine; NEXOVO and PROWESS BIKE are real mobile delivery/logistics builds. AI is something he has integrated into products, not a buzzword.

## Operating Context

- Visitors evaluate on phones first, desktop second.
- Recruiters compare many portfolios quickly; the CV (printable in-page resume viewer) is a primary artifact.
- Bilingual audience: local/LatAm (Spanish) and international/remote (English).

## Capabilities and Constraints

- Stack: React 19, Vite 6, Tailwind CSS 4, `motion`, lucide-react / react-icons, pnpm. Clean Architecture layout (`src/core`, `src/infrastructure`, `src/presentation`).
- Content lives in `src/infrastructure/data/resumeData.ts` (per language) and `src/utils/i18n.ts`.
- ES/EN language switch must be kept.
- Contact form posts to formsubmit.co (`/ajax/rvivanco199@gmail.com`) and must keep working.
- Interactive CLI terminal drawer, dark/light theme, printable resume modal, and a simulated DK-Fitt AI food-scanner demo are existing features.
- Live GitHub repo/follower counts come from the public GitHub API.
- Must stay fast on phones and respect `prefers-reduced-motion`.
- **Open decision:** whether the hardcoded GitHub stats (1.2K+ commits, 500+ contributions, 50K+ LOC) are accurate. Do not amplify or add new numeric claims until confirmed.
- **Open decision:** primary language (ES vs EN). Default is undecided.

## Brand Commitments

- Terminal / HUD identity (CLI language, system labels, cyan signal color) is a user-confirmed commitment to keep.
- Name usage: "Richard Vivanco"; full legal name on the CV.
- Motto: "Building the present, designing the future." / "Construyendo el presente, diseñando el futuro."

## Evidence on Hand

- Portrait: `src/images/fotoPerfil.png` (white background).
- Project screenshots: `src/images/DK-Fitt.png`, `NutriSportFitt.png`, `Nexovo.png`, `ProwessBike.png`.
- Experience: Kaizen Software internship (Oct 2025), PROWESS BIKE community project (Aug 2023), NYC Arquitectos freelance (Aug 2021).
- Certifications: two ESPE cybersecurity / ML-for-cybersecurity certificates (2025).
- GitHub repos linked per project.
- Absent: testimonials, client logos, live deployments, real accuracy metrics for the scanner demo (its meal data is illustrative). Never fabricate these.

## Product Principles

1. Proof over adjectives: every claim should point at a project, repo, or demo.
2. Phone first: the first screen on a phone must say who, what role, and how to reach him.
3. AI is shown working, not decorated.
4. Two paths, one page: hiring and freelance visitors both reach the form without friction.
5. Bilingual parity: anything visible in one language exists in the other.

## Accessibility & Inclusion

Respect `prefers-reduced-motion` (no morphing/scrambling motion; static states). Keep text readable over any animated background, keyboard-reachable navigation, labeled form fields.
