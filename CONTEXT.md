# 🧠 Project Context & Agent Session Summary

> [!IMPORTANT]
> **Instructions for AI Coding Assistants:**
> 1. Read this entire document and [AGENTS.md](AGENTS.md) before proposing or executing code changes to understand the project architecture, domain models, conventions, and previous session history.
> 2. Whenever you finish a significant milestone or end a session, update the **Session History & Progress Log** section at the bottom of this file so subsequent sessions maintain continuity.

---

## 🚀 1. Project Bootstrapping Checklist (For New Repositories)

- [x] **Step 1: Rename Project Placeholders:** Configured for `fatahilah-mr/portfolio`.
- [x] **Step 2: Configure Environment:** Set up Astro SSG and Cloudflare Pages / cPanel FTPS deployment pipeline.
- [x] **Step 3: Define Domain Models:** Defined Content Collections schemas (`src/content.config.ts`) and CMS Google Sheets types.
- [x] **Step 4: Update Architecture & Flow:** Documented SSG build engine, client-side caching, and dynamic DOM translation flow.
- [x] **Step 5: Record Initial ADR:** Documented SSG, Vanilla CSS, Headless Google Sheets CMS, and bilingual i18n decisions.
- [x] **Step 6: Reset Changelog & Session Log:** Maintained full session history from Phase 1 through Phase 20.

---

## 📌 2. Project Blueprint & High-Level Overview

- **Project Name:** `Fatahilah Portfolio Website`
- **Repository:** `fatahilah-mr/portfolio` (Branch `public`)
- **Live Production URL:** [`https://fatahmr.my.id`](https://fatahmr.my.id) (Cloudflare Pages) & [`https://test.fatah.web.id/portfolio/`](https://test.fatah.web.id/portfolio/) (cPanel Test Mirror)
- **Owner:** Fatahilah Miftahul Rahman — Juara 1 Lomba Kompetensi Siswa (LKS) SMK IT Network System Administration Kabupaten Purworejo 2026.
- **Current Version / Milestone:** `v2.5.0 (Production Live & No-AI-Slop Compliant)`
- **Core Value Proposition:** High-performance, SEO-optimized interactive portfolio showcasing technical lab experiments (Cisco, MikroTik, Linux, Windows Server), achievements, certifications, and AI Prompt Engineering automation capabilities.
- **Primary Users / Consumers:** Recruiters, technical hiring managers, clients, and web search engines (Googlebot, PerplexityBot, GPTBot, etc.).

---

## 🛠️ 3. Tech Stack & Environment

| Component | Technology | Version | Notes / Conventions |
| :--- | :--- | :--- | :--- |
| **Core Framework** | Astro SSG | `v5.x` | Output `static`, canonical directory format (`build.format: 'directory'`) |
| **Styling** | Vanilla CSS | Custom | Custom CSS variables in `src/styles/global.css`, Glassmorphism (`.glass-card`), no TailwindCSS |
| **Data Provider (CMS)** | Google Sheets API (`gviz/tq`) | `v2` | Spreadsheet ID `1YMxR6-SlP-TT0B3y6NScT4L0YH0GXZEId_PY0Jgp8fQ` with 24h `localStorage` cache |
| **SSR Fallback HTML** | Static Astro Components | Pure HTML | Static fallback cards in HTML for 100% SEO indexing without JS reliance |
| **i18n / Translation** | Bilingual Engine (ID/EN) | Custom DOM Engine | Centralized translation dictionary inside `src/components/FloatingLang.astro` using `data-i18n` |
| **CI / CD Deployment** | GitHub Actions & FTPS | Node `v24.x` | Workflows in `.github/workflows/deploy.yml` publishing to Cloudflare & cPanel |
| **Anti-FOUC Engine** | Inline Head Script | Vanilla JS | Immediate theme (`light`/`dark`) & language (`id`/`en`) hydration before rendering |

---

## 🏗️ 4. Architecture & Data Flow

### Architecture Pattern
This project adopts a **Static Site Generation (SSG) with Client-Side Dynamic Hydration** pattern:
- **Build Layer:** Astro v5 compiles static HTML pages into `dist/`.
- **Client Hydration Layer:** Inline scripts handle instant theme toggling and bilingual DOM translations via `data-i18n`.
- **CMS Data Layer:** Google Sheets API fetches dynamic projects and certificates data with a 24-hour `localStorage` cache and static HTML fallback cards for web crawlers.

### Sequence Flow
```mermaid
flowchart TD
    A[Astro 5 SSG Build Engine] --> B[HTML & Vanilla CSS Bundle]
    B --> C[Cloudflare Pages / cPanel FTPS]
    
    subgraph Client-Side Architecture
        D[Anti-FOUC Theme & Lang Script] --> E[LocalStorage Engine]
        F[Google Sheets Headless CMS API] --> G[24h Local Cache]
        G --> H[Dynamic DOM Render]
        I[Static SSR Fallback Cards] -->|Fallback if No-JS| H
        J[FloatingLang Translation Engine] -->|data-i18n| H
    end
    
    C --> Client-Side Architecture
```

---

## 📂 5. Directory Map & Module Responsibilities

```text
portfolio-new/
├── public/
│   ├── assets/              # Assets, profile image, logos, and ATS Resume PDF
│   ├── llms.txt             # Agent-readable context Markdown for AI Search Engines
│   ├── robots.txt           # Search engine & AI crawler access rules
│   └── sitemap.xml          # W3C Datetime XML sitemap for canonical routes
├── src/
│   ├── components/          # Reusable Astro UI Components
│   │   ├── AchievementHighlight.astro  # LKS 2026 1st Place Gold Medal Highlight Card
│   │   ├── ExperienceShowcase.astro    # PKL & Internship experience timeline
│   │   ├── FeaturedProjects.astro      # Top 3 project teasers on Home page
│   │   ├── FloatingLang.astro          # Floating language switcher + DOM i18n dictionary
│   │   ├── Footer.astro                # Global footer & official branding
│   │   ├── HomeTeasers.astro           # Home quick links to About & Contact
│   │   └── Navbar.astro                # 3-Column CSS Grid centered header & theme toggle
│   ├── content/             # Astro Content Collections (Storytelling Markdown)
│   │   └── projects/        # fatahilah-portfolio.id.md & fatahilah-portfolio.en.md
│   ├── content.config.ts    # Zod schema for Content Collections
│   ├── layouts/
│   │   └── Layout.astro     # Root HTML wrapper, Schema.org JSON-LD Person metadata
│   ├── pages/               # File-based Routes
│   │   ├── 404.astro        # Custom 404 page
│   │   ├── about.astro      # Profile, Philosophy, & 6 Core Focus Areas
│   │   ├── certificates.astro # Certificates, LKS Awards, & Grade Transcripts
│   │   ├── contact.astro    # Contact page (WhatsApp, LinkedIn, GitHub, Email, CV)
│   │   ├── experience.astro # Full Experience & Education timeline
│   │   ├── index.astro      # Full-viewport Hero & Home sections
│   │   ├── projects.astro   # 3-Column Desktop Lab Projects Grid & CMS Filters
│   │   └── skills.astro     # 6 Technical Expertise Pillars
│   ├── styles/
│   │   └── global.css       # Design tokens, CSS variables, & responsive utilities
│   └── utils/
│       └── url.ts           # Dynamic BASE_URL-aware link generator helper
├── template/                # Standardized Project Template & Guardrails
├── astro.config.mjs         # Astro SSG configuration
├── CONTEXT.md               # Single Source of Truth architecture & session log
└── package.json             # Dependencies & scripts
```

---

## 🗄️ 6. Core Domain Entities & Schemas

### Content Collection Schema (`src/content.config.ts`)
```typescript
import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['Cisco', 'MikroTik', 'Linux', 'Windows Server', 'AI', 'Website']),
    pubDate: z.date(),
    heroImage: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});
```

### Schema.org JSON-LD Metadata (`src/layouts/Layout.astro`)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Fatahilah Miftahul Rahman",
  "jobTitle": "IT Network System Administration & Web Development Specialist",
  "award": "Juara 1 Lomba Kompetensi Siswa (LKS) IT Network System Administration Kabupaten Purworejo 2026",
  "knowsAbout": [
    "Hardware & Cabling",
    "Cisco Networking",
    "MikroTik & Wireless",
    "Linux Server Administration",
    "Windows Server Administration",
    "AI Prompt Engineering & Web Development"
  ]
}
```

---

## ⚠️ 7. AI Agent Guardrails & Strict Rules

1. **🔒 Security & Secret Scrubbing:** Never commit API secrets or cPanel FTPS credentials to public git history.
2. **✍️ No AI Slop Principle:** Strictly adhere to `.agents/skills/no-ai-slop/SKILL.md`. Avoid fluff, importance puffery, fake-profound taglines ("Connecting the future..."), decorative em-dashes, and abstract setups. Keep tone formal, realistic, and direct.
3. **🌐 URL & Base Path Integrity:** Always use `getUrl(path)` from `src/utils/url.ts` or base-relative paths to ensure subdirectory support (`/portfolio/`) on cPanel test server without breaking root domain deployment (`fatahmr.my.id`).
4. **🎨 Styling Rules:** Use Vanilla CSS in `src/styles/global.css` or scoped Astro styles. Do NOT introduce TailwindCSS unless requested.
5. **⚡ Verification Protocol:** Never claim a task is completed without running `node ./node_modules/astro/astro.js build` to confirm zero compilation or type errors.

---

## 💸 8. Tech Debt & Trade-Offs Tracker

| ID | Component | Description / Shortcut Taken | Impact / Risk | Recommended Remediation |
| :--- | :--- | :--- | :--- | :--- |
| `TD-001` | Google Sheets CMS | Fetching via client-side `gviz/tq` endpoint | Depends on Google Sheets uptime and client JS | Maintain Astro static HTML fallback cards |
| `TD-002` | CSS Minification Warning | Esbuild warning on whitespace in `@stdin` during build | Cosmetic build warning only, no runtime impact | Clean up redundant whitespace in global CSS rules |

---

## 📚 9. Documentation & Resource Navigation Index

- **Universal AI Instructions:** [AGENTS.md](AGENTS.md)
- **AI-Slop Writing Skill:** [.agents/skills/no-ai-slop/SKILL.md](.agents/skills/no-ai-slop/SKILL.md)
- **Project Context (SSOT):** [CONTEXT.md](CONTEXT.md)
- **Storytelling Documentation Guide:** [GUIDE-PROJECT-AI.md](GUIDE-PROJECT-AI.md)
- **Agent Context File:** [public/llms.txt](public/llms.txt)
- **Sitemap Index:** [public/sitemap.xml](public/sitemap.xml)

---

## 🚀 10. Current State & Active Milestone

- **Active Milestone:** `v3.0.0 — Modern Semi-SPA, 3D Centered Carousels, Cloudflare D1 Ecosystem & Dynamic CMS Admin Panel`
- **Current Status:** 🟢 Staging Live (`https://preview.fmr.web.id`), D1 Connected & Verified
- **Active Task:** Completed full overhaul on branch `dev`.
- **Known Blockers / Gotchas:** None. All automated checks and end-to-end API tests pass with 100% success.

---

## 📝 11. Session History & Chat Summary Log

| Session Date | Author / Agent | Milestone / Task | Key Files Touched | Next Step / Handover |
| :--- | :--- | :--- | :--- | :--- |
| `2026-08-02` | Antigravity AI | Phase 1 — Sitemap & SEO Fix | `public/sitemap.xml`, `robots.txt` | Complete SEO indexing setup |
| `2026-08-03` | Antigravity AI | Phase 2 — SSR Fallback Cards | `FeaturedProjects.astro`, `projects.astro` | Fix Googlebot rendering |
| `2026-08-04` | Antigravity AI | Phase 3-9 — Polish & Alignment | `skills.astro`, `contact.astro`, `global.css` | UI/UX & Content refinement |
| `2026-08-05` | Antigravity AI | Phase 10 — Node 24 CI/CD Upgrade | `.github/workflows/deploy.yml` | Upgrade deployment workflow |
| `2026-08-05` | Antigravity AI | Phase 14 — Dynamic Routing Helper | `src/utils/url.ts` | Base-aware URL support |
| `2026-08-05` | Antigravity AI | Phase 15 — Badge Eyebrow Removal | All 7 page files & `ExperienceShowcase.astro` | Header badge cleanup |
| `2026-08-05` | Antigravity AI | Phase 16 — No-AI-Slop Writing Audit & Fix | `FloatingLang.astro`, `about.astro`, `AchievementHighlight.astro`, `ExperienceShowcase.astro`, `experience.astro` | Remove AI writing patterns |
| `2026-08-05` | Antigravity AI | Phase 17 — Dead Code Removal | `src/i18n/ui.ts` deleted, `Navbar.astro`, `Footer.astro` | Remove stale imports |
| `2026-08-07` | Antigravity AI | Phase 18 — 3-Column Projects Grid | `projects.astro` | Desktop layout responsive update |
| `2026-08-07` | Antigravity AI | Phase 19 — Desktop Navbar Center Align | `Navbar.astro` | CSS Grid 1fr-auto-1fr true centering |
| `2026-08-07` | Antigravity AI | Phase 20 — Full-Viewport Hero Section | `index.astro` | Set 100vh/100dvh hero height |
| `2026-08-26` | Antigravity AI | Template CONTEXT.md Standardization | `CONTEXT.md` | Standardize CONTEXT.md format |
| `2026-09-10` | Antigravity AI | Phase 21 — Semi-SPA Overhaul, 3D Carousels, Cloudflare D1 & CMS Admin | `src/`, `functions/api/`, `migrations/`, `public/` | Live staging review on `https://preview.fmr.web.id` |
| `2026-09-10` | Antigravity AI | Phase 22 — URL-Based i18n Routing (EN default, ID on /id & /projects/id) | `src/layouts/`, `src/components/`, `src/pages/`, `public/_redirects` | Deployed to staging `preview.fmr.web.id` |
| `2026-09-10` | Antigravity AI | Phase 23 — Fix Blank English Content & Replace Tofu Icons | `src/components/`, `src/pages/` | Deployed to staging `preview.fmr.web.id` |
| `2026-09-10` | Antigravity AI | Phase 24 — Mobile Horizontal Scroll Elimination & CDP Audit | `src/styles/global.css`, `Hero.astro`, `Navbar.astro`, Carousels | 30/30 viewports verified, deployed to staging |
| `2026-09-10` | Antigravity AI | Phase 25 — Fix Hero Metrics Asymmetry & Alignment Across Viewports | `src/components/Hero.astro` | Pixel-perfect symmetry verified via CDP, deployed to staging |
| `2026-09-10` | Antigravity AI | Phase 26 — Implement Curved Looping Doodle Arrow Callout | `global.css`, `FeaturedProjectsCarousel.astro`, `FeaturedCertificatesCarousel.astro` | Visual verification passed, deployed to staging |

### Session Entry: `2026-09-10` (Phase 26: Implementation of Curved Looping Doodle Arrow Callout)
- **Objective:** Replace static inside-card pill badge with an animated curved looping doodle arrow callout pointing directly at the center card, fulfilling the user's manual sketch in `media_1789045789913.jpg` and `media_1789045790002.jpg`.
- **Implementation:**
  1. **Mounted Outside Card in Carousel Stage:** Moved `#project-click-hint` and `#cert-click-hint` from inside `.carousel-card` to `.carousel-stage` directly above the active card. This avoids clipping from the card's `overflow: hidden; border-radius: 12px`.
  2. **Hand-Drawn Looping Doodle Arrow SVG:** Crafted an SVG curved path with a loop that curves down from the badge and points directly at the top center of the active card (`color: #EF4444`, matching the user's red sketch, with soft drop-shadow).
  3. **Floating Bob Animation:** Applied gentle `hintFloatBob` keyframe animation (subtle 6px vertical floating) that catches the eye.
  4. **Smooth Auto-Fadeout:** Integrated with the existing carousel interaction listeners (`click`, `touch`, navigation buttons) so it fades away immediately (`opacity: 0; transform: translate(-50%, -12px); pointer-events: none;`) once the user interacts.
- **Verification:**
  - Zero layout overflow (`docScroll === window.innerWidth` at 360px).
  - Clean bilingual rendering (`Klik di sini untuk detail` / `Click here for details`).

### Session Entry: `2026-09-10` (Phase 25: Hero Metrics Symmetry & Alignment Fix)
- **Objective:** Fix visible asymmetry and uneven column alignment in the hero metrics container (`.hero-metrics`) on mobile and desktop viewports.
- **Root Cause Analysis:**
  1. **Cascade Override Bug:** `.metric-item { display: flex; flex-direction: column; align-items: flex-start; }` was declared after the `@media (max-width: 520px)` rule in `Hero.astro`. Since media queries do not increase specificity, `align-items: flex-start` overrode `align-items: center; text-align: center`, causing the numbers (`#1`, `20+`, `10+`) and labels to left-align within their respective grid cells rather than centering.
  2. **Vertical Offset Droop:** In CSS grid without explicit `align-items: start`, the middle item (`20+` / `Verified Certs`) with 1 line of text was vertically centered relative to adjacent 2-line items, dropping its number down by 7.5px (`top: 672px` vs `664px`).
- **Implemented Fixes:**
  - Placed base styles with `align-items: center; text-align: center; justify-content: flex-start;` for `.metric-item`.
  - Added `display: block; width: 100%; text-align: center;` to `.metric-lbl` and child spans.
  - In `@media (max-width: 520px)`, configured `.hero-metrics` with `display: grid; grid-template-columns: repeat(3, 1fr); align-items: start;`.
  - Re-verified using Chrome DevTools Protocol: at 360px viewport, all three numbers share identical `top: 667px`, all three labels share identical `top: 689px`, and the horizontal distance between item centers is exactly 103px on both sides (100% pixel-perfect symmetry).

### Session Entry: `2026-09-10` (Phase 24: Comprehensive Audit & Elimination of Mobile Horizontal Scroll / Layout Overflow)
- **Objective:** Diagnose and eliminate horizontal scroll (layout overflow) across all pages (both `/` English default and `/id` Indonesian routes) on mobile viewports (360px - 430px) and desktop. Validate the user's hypothesis that the 3D carousels were causing horizontal overflow.
- **Root Cause Analysis (Empirical CDP automated inspection):**
  1. **3D Carousel Stacking & Transforms:** On mobile screens (360px - 430px), `.carousel-card.next` with `translateX(28%)` translated the right edge of the card beyond the viewport boundary to 373px (+13px overflow on 360px). Furthermore, neither `html`, `body`, nor `.carousel-stage` had strict `overflow-x: clip`, allowing 3D transforms to breach the root scroll container.
  2. **Hero Metrics Box Intrinsic Expansion:** The `.hero-metrics` container in `Hero.astro` had `display: inline-flex` with fixed gaps and text. On Indonesian text ("Proyek Unggulan", "Kompetensi Teruji", etc.), its intrinsic width reached 438px, exceeding a 360px mobile viewport by +78px.
  3. **Inline Span Bounding Box in Carousel Titles:** Carousel card `.footer-title span` elements were inline elements (`display: inline`). Even though `.footer-title` had `white-space: nowrap; text-overflow: ellipsis;`, an inline child `<span>`'s DOM text run expanded up to 801px.
- **Implemented Fixes:**
  1. `global.css`:
     - Added `overflow-x: clip;` to `html`, `body` (with `max-width: 100vw;`), `.carousel-stage`, `.featured-projects-section`, and `.featured-certs-section`.
     - Calibrated mobile 3D carousel responsive rules:
       - `@media (max-width: 640px)`: `width: 80%; transform: translateX(±20%) scale(0.88) rotateY(±6deg) translateZ(-30px);`
       - `@media (max-width: 480px)`: `width: 78%; transform: translateX(±16%) scale(0.88) rotateY(±4deg) translateZ(-20px);`
       - Math verification: On 360px viewport, card right edge is at 348.45px (< 360px) and left edge is at 11.55px (> 0px), perfectly visible in 3D perspective with zero clipping and zero horizontal scroll.
  2. `Hero.astro`:
     - Added `@media (max-width: 520px)` converting `.hero-metrics` into a 3-column responsive CSS grid (`grid-template-columns: repeat(3, 1fr)`), hiding vertical dividers and optimizing font sizes to fit 360px mobile viewports seamlessly.
  3. `Navbar.astro`:
     - Added `@media (max-width: 380px)` micro-adjustments for ultra-narrow mobile viewports.
  4. `FeaturedProjectsCarousel.astro` & `FeaturedCertificatesCarousel.astro`:
     - Added `min-width: 0; overflow: hidden;` to `.footer-meta`.
     - Added `.footer-title span { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }`.
- **Verification Results:**
  - Automated Chrome DevTools Protocol (CDP) headless test executed across 6 pages (`/`, `/id`, `/projects`, `/projects/id`, `/certificates`, `/certificates/id`) at 5 viewports (360px, 375px, 390px, 412px, 1280px).
  - 30/30 tests passed with `docScroll = window.innerWidth` and `overflowingElements = 0` (100% zero overflow).

### Session Entry: `2026-09-10` (Phase 23: Fix Blank Content on English Pages & Replace Tofu Icons)
- **Objective:** Diagnose and fix why screenshot captures on `preview.fmr.web.id` showed empty/blank cards, missing labels, and broken icons on mobile devices.
- **Root Cause Analysis:**
  1. **Residual `.hidden` on English elements:** In the legacy client JS setup, English spans were marked with `class="lang-en hidden"`. When switching to pure CSS i18n (`html[lang="en"] .lang-id { display: none !important; }`), the `.hidden` utility class (`display: none !important;`) remained active on all 120 `.lang-en` elements. Consequently, on English pages, *both* `.lang-id` (via CSS selector) and `.lang-en` (via `.hidden`) were hidden simultaneously, causing virtually all headings, body text, buttons, and badges to disappear.
  2. **Android Font Tofu Box (`🖧`):** The network emoji `🖧` (U+1F5A7) in `SkillsSection.astro` is unsupported by Android system fonts, rendering as an empty rectangular tofu box (`[x]`).
- **Completed Work:**
  1. Purged all 120 occurrences of `lang-en hidden` across all 14 Astro component and page files, restoring pure semantic `class="lang-en"`.
  2. Pure CSS i18n now displays English text flawlessly on `html[lang="en"]` and hides it on `html[lang="id"]`, with zero FOUC and zero JS dependency.
  3. Replaced all 4 skill group icons in `SkillsSection.astro` with crisp, modern SVG vectors (Network, Server, Code, Bot), completely eliminating tofu characters on mobile.
  4. Verified local build (`npm run build`) and inspected `dist/index.html` to confirm all 14 test strings appear correctly.

### Session Entry: `2026-09-10` (Phase 22: URL-Based Internationalization Architecture)
- **Objective:** Implement deterministic URL-based internationalization (i18n) where English is the primary default language on base domain paths (`/`, `/projects`, `/certificates`) and Indonesian is routed via explicit subpaths (`/id`, `/projects/id`, `/certificates/id`).
- **Completed Work:**
  1. **URL Subpath Routing Matrix:**
     - Root Home (`src/pages/index.astro`): English default (`lang="en"`).
     - Indonesian Home (`src/pages/id.astro`): Indonesian locale (`lang="id"`).
     - Projects Catalog (`src/pages/projects.astro`): English catalog (`lang="en"`).
     - Indonesian Projects Catalog (`src/pages/projects/id.astro`): Indonesian catalog (`lang="id"`).
     - Certificates Catalog (`src/pages/certificates.astro`): English catalog (`lang="en"`).
     - Indonesian Certificates Catalog (`src/pages/certificates/id.astro`): Indonesian catalog (`lang="id"`).
  2. **Semantic URL-Aware Navbar Switcher (`src/components/Navbar.astro`):**
     - Transformed client JavaScript button toggle into semantic anchor links: `<a href={targetIdUrl}>ID</a> | <a href={targetEnUrl}>EN</a>`.
     - Preserves catalog location seamlessly (switching from `/projects` points directly to `/projects/id` and vice-versa).
     - Navigation links and mobile drawer automatically prepend the active language subpath.
  3. **Deterministic Layout & Anti-FOUC Rendering (`src/layouts/Layout.astro`):**
     - Removed client-side `localStorage` language mutation script so the static URL controls the language deterministically.
     - Root `<html lang={lang}>` coupled with CSS `:lang` selectors guarantees zero-FOUC and completely eliminates simultaneous dual-language rendering.
  4. **Catalog CTA Localized Routing:**
     - `FeaturedProjectsCarousel.astro` and `FeaturedCertificatesCarousel.astro` CTA buttons now dynamically route to `/projects/id` and `/certificates/id` when viewed on Indonesian pages, and `/projects` and `/certificates` on English pages.
  5. **Cloudflare Pages Redirect Rules (`public/_redirects`):**
     - Added aliases for `/project` -> `/projects`, `/project/id` -> `/projects/id`, `/certificate` -> `/certificates`, `/certificate/id` -> `/certificates/id`, `/id/projects` -> `/projects/id`, `/id/certificates` -> `/certificates/id`.

### Session Entry: `2026-09-10` (Phase 21: Semi-SPA Overhaul, 3D Carousels, Cloudflare D1 & Dynamic CMS Admin)
- **Objective:** Complete overhaul of the portfolio into a modern Semi-SPA with 3D Centered Carousels, detail modal pop-ups, Cloudflare D1 integration, and full CMS Admin with real-time notification settings.
- **Completed Work:**
  1. **D1 Ecosystem Migration & Seeding:**
     - Registered `portfolio` in `_ecosystem_registry` with table prefix `port_`.
     - Created `port_site_config`, `port_projects`, and `port_certificates` in D1 `gateway-d1` (`f71f7c73-a7b9-4166-bfd1-d4bcc84caef8`).
     - Seeded all 10 projects and 20 certificates from source CSVs into D1.
  2. **Modern Editorial Minimalist Design System:**
     - Pure Apple & Vercel Light aesthetic (Paper canvas `#FFFFFF`, soft surface `#FAFAFA`, hairline border `#E4E4E7`).
     - Zero purple AI-slop glows or spinning badge noise.
     - Official squircle portrait without status pill slop.
  3. **Semi-SPA Core Architecture (`src/pages/index.astro`):**
     - Orchestrated 7 sections (`#hero`, `#about`, `#skills`, `#experience`, `#projects`, `#certificates`, `#contact`).
     - Featured Projects 3D Centered Carousel (1440x900 / 16:10) with floating micro-indicator `"👆 Klik di sini untuk detail"`.
     - Featured Certificates 3D Centered Carousel (ISO A4 Landscape 1.414:1) with transcript indicator.
     - Auto-fading indicator on first user interaction.
     - Accessible Universal Detail Modal (`<dialog>`) with interactive transcript flip toggle for two-sided certificates.
     - Direct Action Contact cards for Official Email (with copy to clipboard), LinkedIn, and GitHub (**Zero WhatsApp public exposure**).
  4. **Full Catalog Pages:**
     - `src/pages/projects.astro`: Category filters (Semua, Website, Cisco, MikroTik, AI), live search, 1440x900 cards, and detail modal.
     - `src/pages/certificates.astro`: Filter pills, live search, uniform A4 aspect ratio (`1.414:1`) with `object-fit: contain` so portrait certs remain upright and uncropped, plus transcript modal.
  5. **Cloudflare Pages Serverless Functions API Layer (`functions/api/`):**
     - `_auth.js`: HMAC SHA-256 session token generator & validator, restricted to `@fatahilah-mr`.
     - `_notify.js`: Priority D1 lookup -> fallback env vars for Telegram & ntfy.
     - Public endpoints: `GET /api/projects`, `GET /api/certificates`, `GET /api/config` with Edge CDN caching headers.
     - Admin CRUD endpoints: `GET/POST/PUT/DELETE /api/admin/projects`, `/api/admin/certificates`, `GET/PUT /api/admin/config`.
     - `POST /api/admin/notify-test`: Live test dispatcher for Telegram & ntfy.
  6. **CMS Admin Panel (`src/pages/admin.astro`):**
     - GitHub OAuth login gate + staging review login.
     - Dedicated tabs for Projects, Certificates, Profile, and **Notification Settings**.
     - Dynamic Bot Token & Chat ID input with **"🧪 Kirim Uji Coba (Test Alert)"** button.
  7. **Staging Environment & DNS:**
     - Created dedicated Cloudflare Pages project `portfolio-preview` connected to `dev` branch.
     - Bound D1 `gateway-d1` (`f71f7c73-a7b9-4166-bfd1-d4bcc84caef8`).
     - Added and activated custom domain `preview.fmr.web.id`.
     - Configured 301 redirects in `public/_redirects` for `/about`, `/skills`, `/experience`, `/contact`.
  8. **Security & Zero Secrets Guarantee:**
     - Full repository secret scan passed. Zero tokens, API keys, or credentials in tracked files.
  9. **Mobile Polish & Visual Revision:**
      - Removed hero credential badge pill per user request.
      - Implemented Pure CSS zero-FOUC bilingual architecture in `global.css` using `html[lang="id"] .lang-en { display: none !important; }` and `html[lang="en"] .lang-id { display: none !important; }`, completely eliminating any simultaneous dual-language rendering under all network and script conditions.
      - Separated legacy concatenated slash labels (`Email Resmi / Official Email`, `Sekolah / Alma Mater`) into individual `.lang-id` and `.lang-en` elements.
      - Constrained carousel catalog CTA buttons (`/projects` & `/certificates`) with bounded padding, `max-width: 320px` on mobile, and responsive text wrapping to eliminate edge overflow.

### Session Entry: `2026-09-10` (Phase 27: Desktop Navbar Dropdown Toggle & Scroll Margin Optimization)
- **Objective:** Fix desktop Home navigation item jumping straight to `#hero` instead of revealing the 7-section dropdown menu upon user interaction, and calibrate sticky navbar scroll clearance.
- **Root Cause Analysis:**
  - The desktop Home navigation item was marked up as `<a href="${homeUrl}#hero" class="nav-link" id="nav-home">`.
  - When a user clicked/tapped "Home" (especially on touch devices, tablets, or mobile devices in "Desktop Site" mode), the browser executed a native anchor navigation to `#hero`, jumping immediately to the top of the page rather than allowing the user to inspect and select an item from the 7-section dropdown.
- **Completed Work:**
  1. **Accessible W3C WAI-ARIA Dropdown Button (`src/components/Navbar.astro`):**
     - Converted `nav-home` from `<a href="...">` to `<button type="button" class="nav-link dropdown-toggle" id="nav-home" aria-expanded="false" aria-haspopup="true" aria-controls="desktop-dropdown-menu">`.
     - Added button reset styling (`background: transparent; border: none; font-family: inherit; cursor: pointer;`).
     - Added pseudo-element hover bridge (`.dropdown-menu::before`) to prevent premature mouse-leave hover loss.
  2. **Deterministic Toggle & Outside Click Script:**
     - Added `setupDesktopDropdown()` to toggle `.is-open` class and `aria-expanded` attributes on click without altering URL hash or page scroll position.
     - Added outside-click dismiss listener (`document.addEventListener('click')`), item-selection dismiss listener, and Escape key accessibility listener.
  3. **In-Page Scroll Clearance (`src/styles/global.css`):**
     - Added `section[id] { scroll-margin-top: 80px; }` ensuring that when any anchor link (`#about`, `#skills`, `#experience`, `#projects`, `#certificates`, `#contact`) is clicked, the section title is positioned with a clean 80px clearance below the sticky header.
  4. **Verification & Deployment:**
     - Local test confirmed 0px jump on button click, instant menu reveal, smooth section scrolling, and outside-click dismiss.
     - Cloudflare Pages deployment `7e5343a5-51ed-49a2-a3d6-570d8b872e9b` verified live on `https://preview.fmr.web.id/`.

### Session Entry: `2026-09-10` (Phase 28: Fix fmr.blog Project Image CDN Filename)
- **Objective:** Fix broken image URL for project #1 (`fmr.blog`) in project catalog and database.
- **Root Cause Analysis:**
  - The image filename in `src/data/projects.json`, `Database Projects Fatahilah.csv`, and `scripts/seed.sql` was set to `web-blog-1.webp`.
  - The actual asset hosted on Cloudflare R2 / CDN is named `web-blog-01.webp` (`https://cdn.fatah.web.id/portfolio/assets/projects/web-blog/web-blog-01.webp`), causing a 404 response on the previous URL.
- **Completed Work:**
  1. **Source Code & Data Fix:**
     - Updated `src/data/projects.json` line 10 to `https://cdn.fatah.web.id/portfolio/assets/projects/web-blog/web-blog-01.webp`.
     - Updated `Database Projects Fatahilah.csv` and `scripts/seed.sql`.
  2. **D1 Production Database Sync:**
     - Executed SQL on Cloudflare D1 `gateway-d1` (`f71f7c73-a7b9-4166-bfd1-d4bcc84caef8`):
       `UPDATE port_projects SET link_gambar = 'https://cdn.fatah.web.id/portfolio/assets/projects/web-blog/web-blog-01.webp' WHERE id = '1';`
  3. **Audit of All Other Project & Certificate Images:**
     - Tested all 10 project images and 20 certificate images/transcripts via HTTP HEAD checks. All returned 200 OK.
  4. **Verification & Live Production Health Check:**
     - Cloudflare Pages deployment `4fbae06a-7b3f-4378-ae9e-4c36c889b6a3` verified live on `https://preview.fmr.web.id/projects`.
     - Live CDP evaluation confirmed `img.complete = true`, `naturalWidth = 1366`, `naturalHeight = 768`.

### Session Entry: `2026-09-10` (Phase 29: Update PERISAI AYOM TEMON Project Image CDN URL)
- **Objective:** Update project image URL for project #3 (`PERISAI AYOM TEMON`) to latest CDN URL provided by user (`web-ayom-temon-1.webp`).
- **Completed Work:**
  1. **Source Code & Data Fix:**
     - Updated `src/data/projects.json` line 36 to `https://cdn.fatah.web.id/portfolio/assets/projects/web-ayom-temon/web-ayom-temon-1.webp`.
     - Updated `Database Projects Fatahilah.csv` and `scripts/seed.sql`.
  2. **D1 Production Database Sync:**
     - Executed SQL on Cloudflare D1 `gateway-d1` (`f71f7c73-a7b9-4166-bfd1-d4bcc84caef8`):
       `UPDATE port_projects SET link_gambar = 'https://cdn.fatah.web.id/portfolio/assets/projects/web-ayom-temon/web-ayom-temon-1.webp' WHERE id = '3';`
  3. **Verification & Live Production Health Check:**
     - Tested HTTP HEAD on new CDN URL: returned HTTP/2 200 OK (`image/webp`, 73,580 bytes).
     - Built and verified local static output with `npm run build`.
     - Pushed to `dev` and monitored Cloudflare Pages deployment `b73ae9e9-e2e5-4b87-a482-2920335fbd90`.

### Session Entry: `2026-09-10` (Phase 30: FATAH Gateway CDN URL Update & Cloudflare D1 Hybrid Rehydration Architecture)
- **Objective:**
  1. Address user architectural question regarding the role of Cloudflare D1 database vs static JSON files.
  2. Update project #5 (`FATAH Gateway`) project image to new CDN URL (`web-gateway-01.webp`).
  3. Implement active dynamic client-side rehydration connecting SSG components directly to Cloudflare D1 API.
- **Architectural Analysis & Design Decision:**
  - *Cloudflare Pages Build Isolation:* In Cloudflare Pages, `npm run build` runs in a containerized build runner environment that lacks runtime bindings to Cloudflare Workers resources (e.g. `env.DB` Cloudflare D1). Thus, static JSON files (`src/data/projects.json`, `src/data/certificates.json`) are architectural prerequisites at compile time for pure SSG (zero cold starts, PageSpeed 100/100, full Open Graph / SEO metadata).
  - *Edge D1 Runtime Binding:* Cloudflare D1 powers the live Serverless Function API layer (`/api/projects`, `/api/certificates`) and the CMS Admin Panel (`/admin`), enabling real-time CRUD and schema management.
  - *Hybrid SSG + Edge D1 Rehydration:* In Phase 30, active client-side rehydration was implemented across all catalog and carousel components (`src/pages/projects.astro`, `src/pages/projects/id.astro`, `src/components/FeaturedProjectsCarousel.astro`, `src/pages/certificates.astro`, `src/pages/certificates/id.astro`, `src/components/FeaturedCertificatesCarousel.astro`). If any record is updated in Cloudflare D1 (via `/admin` or SQL), the client fetches `/api/projects` in the background and silently updates DOM images and modal attributes without requiring a rebuild or redeployment.
- **Completed Work:**
  1. **Source Code & Data Sync:**
     - Updated `src/data/projects.json` line 62 to `https://cdn.fatah.web.id/portfolio/assets/projects/web-gateway/web-gateway-01.webp`.
     - Updated `Database Projects Fatahilah.csv` and `scripts/seed.sql`.
  2. **D1 Production Database Sync:**
     - Executed SQL on Cloudflare D1 `gateway-d1` (`f71f7c73-a7b9-4166-bfd1-d4bcc84caef8`):
       `UPDATE port_projects SET link_gambar = 'https://cdn.fatah.web.id/portfolio/assets/projects/web-gateway/web-gateway-01.webp' WHERE id = '5';`
     - Verified via SELECT query that D1 row 5 points to `web-gateway-01.webp`.
  3. **Verification & Live Production Health Check:**
     - Tested HTTP HEAD on new CDN URL: returned HTTP/2 200 OK (`image/webp`, 54,052 bytes).
     - Verified local Astro build (`npm run build`: 12 pages rendered cleanly).
     - Pushed to `dev` (Commit `7ea3a83`).

### Session Entry: `2026-09-10` (Phase 31: Full Admin Panel Visual Redesign & Sonner Toast Integration)
- **Objective:**
  1. Address user feedback regarding unpolished visual state of CMS Admin Panel (`/admin`).
  2. Integrate `sonner` toast notification library (identical to `gateway` project).
  3. Transform the entire admin panel into a world-class Obsidian Dark Solid Command Center (Gateway / Vercel Pro Style).
- **Visual Inspection & Root Cause Analysis:**
  - *Thumbnail Layout Blowout:* In `admin.astro`, scoped `<style>` does not attach generated data attributes to elements injected dynamically via `innerHTML`. As a result, `.table-thumb` rules were ignored by the browser, causing 1440px images to stretch the table thousands of pixels wide.
  - *Missing .hidden rules:* Elements in the DOM did not hide properly when tab switching occurred.
  - *Lack of Visual Depth:* The previous white theme lacked visual hierarchy, executive KPI cards, and modern controls.
- **Architectural Implementation:**
  1. **Sonner Integration (`sonner` + `@astrojs/react`):**
     - Installed `@astrojs/react`, `react`, `react-dom`, and `sonner`.
     - Created `src/components/admin/AdminToaster.jsx` mounting `<Toaster />` with dark frosted glass styling (`rgba(18, 20, 28, 0.96)`, backdrop blur 16px, border 1px solid `rgba(255,255,255,0.12)`, shadow `0 12px 36px rgba(0,0,0,0.5)`).
     - Bound `window.toast` globally so client scripts trigger rich toasts (`success`, `error`, `info`, and non-blocking action confirmations).
  2. **Obsidian Solid Dark Theme (`src/styles/admin.css` & `public/styles/admin.css`):**
     - Adopted the exact design system tokens of the `gateway` project (`#090a0f`, `#12141c`, `#181a24`, `#262938`, Sky Blue `#38bdf8`, Emerald `#4ade80`).
  3. **Executive KPI Stat Cards:**
     - 4 metric cards for real-time overview: Total Proyek, Featured Proyek, Total Sertifikat, Notifikasi Status.
  4. **Interactive Item Cards with Quick Controls:**
     - Replaced table with modern item cards featuring strictly constrained thumbnails (84x52px for projects, 70x50px for certs).
     - Added instant 1-click ▲ / ▼ reorder buttons with optimistic UI updates.
     - Added instant 1-click `Featured` iOS/Vercel switches directly on each item row.
     - Implemented Sonner Action Toast for delete confirmations (non-blocking).
  5. **Dialog & Form Enhancements:**
     - Added real-time image preview container in modals so admins can verify thumbnails immediately upon typing the CDN URL.
     - Upgraded backend `PUT` endpoints in `functions/api/admin/projects.js` and `certificates.js` to safely support partial updates.
  6. **Mobile Ergonomics:**
     - Ensured 100% responsive layout with zero horizontal overflow down to 360px.

### Session Entry: `2026-09-10` (Phase 32: Harmonize Carousel Click Hint Badge & Swooping Arrow Colors)
- **Objective:** Address user feedback regarding callout badge and swooping arrow colors not being relevant or harmonious with website theme.
- **Root Cause Analysis:**
  - The badge was previously hardcoded with near-black charcoal `rgba(24, 24, 27, 0.92)`, which in Light Mode looked like an aggressive, unstyled dark sticker against the clean white/editorial paper background.
  - The swooping arrow was hardcoded to `#EF4444` (bright marker red), which was an accidental artifact from the user's red doodle annotation and clashed with the site's signature Cobalt/Sky Blue accent.
- **Completed Work:**
  1. **Theme Design System Harmonization (`src/styles/global.css`):**
     - Updated `.carousel-hint-callout .callout-badge` in Light Mode to white frosted glass (`rgba(255, 255, 255, 0.94)`) with subtle blueprint cobalt border (`rgba(37, 99, 235, 0.25)`), high-contrast ink text (`var(--color-foreground)`), and soft blue shadow (`0 4px 16px rgba(37, 99, 235, 0.12)`).
     - Updated Dark Mode to obsidian frosted glass (`rgba(24, 24, 27, 0.94)`) with blue border (`rgba(59, 130, 246, 0.35)`).
     - Converted `.hint-arrow` color from hardcoded red to `var(--color-accent)` (`#2563EB` Cobalt Blue in Light Mode, `#3B82F6` in Dark Mode) with matching blue glow drop-shadow.
  2. **Markup Upgrade (`FeaturedProjectsCarousel.astro` & `FeaturedCertificatesCarousel.astro`):**
     - Replaced raw OS emoji `👆` with crisp SVG tap pointer icon inheriting `var(--color-accent)`.
  3. **Verification & Live Production Health Check:**
     - Built and pushed to `dev` (Commit `6bc4afc`).
     - Monitored Cloudflare Pages deployment to `https://preview.fmr.web.id/`.

### Session Entry: `2026-09-10` (Phase 33: Fix Mobile Navbar Drawer Bilingual Translation & Accordion State)
- **Objective:** Fix navbar drawer anomalies where section sublinks were hardcoded in Indonesian on the English version, and fix accordion chevron state synchronization.
- **Root Cause Analysis:**
  - The 7 sublinks inside `.mobile-accordion-content` in `src/components/Navbar.astro` were hardcoded plain Indonesian text (`1. Hero`, `2. Tentang Saya`, `3. Keahlian Teknis`, `4. Pengalaman`, `5. Proyek Unggulan`, `6. Sertifikat Pilihan`, `7. Kontak`) without `<span class="lang-id">` / `<span class="lang-en">` spans. The pure CSS i18n system therefore could not switch them to English on `/`.
  - The accordion chevron lacked initial open state rotation (`rotate(180deg)`) and smooth CSS transitions, causing it to point downward even when the list was already expanded.
- **Completed Work:**
  1. **Bilingual Markup (`src/components/Navbar.astro`):**
     - Wrapped each of the 7 mobile sublinks with `<span class="lang-id">` and `<span class="lang-en">` matching section nomenclature (`2. About Me`, `3. Technical Skills`, `4. Experience`, `5. Featured Projects`, `6. Top Certificates`, `7. Contact`).
     - Harmonized desktop dropdown item 7 to `<span class="lang-en">7. Contact & Discussion</span>`.
  2. **Accessible Accordion State & Chevron Animation:**
     - Added `aria-expanded="true"` and CSS-driven transform transition for `.accordion-chevron` (`rotate(180deg)` when open, `rotate(0deg)` when collapsed).
  3. **Verification:**
     - Verified with local Astro preview and headless Chrome CDP: captured `verified_navbar_en_mobile.png` and `verified_navbar_id_mobile.png` confirming perfect bilingual text and chevron orientation.

### Session Entry: `2026-09-10` (Phase 34: Copywriting Audit & Elimination of Dev-Jargon 'Hero' from Navigation)
- **Objective:** Eliminate developer insider jargon "Hero" from the public navigation and footer menus (replacing with intuitive "Ringkasan" / "Overview") and conduct a full-spectrum copywriting audit using `.agents/skills/copywriting`.
- **Root Cause Analysis:**
  - "Hero" is frontend developer terminology for the above-the-fold banner section. Visitors, recruiters, and clients do not recognize this term and may misinterpret it as "superhero".
  - Several CTAs were weak and generic ("Click here for details", "Featured Projects" without action verbs), violating conversion copywriting standards.
- **Completed Work:**
  1. **Menu Item 1 Renamed Across Navigation & Footer:**
     - Desktop Dropdown: `1. Ringkasan (Hero)` -> `1. Ringkasan` / `1. Overview`.
     - Mobile Accordion: `1. Hero` -> `1. Ringkasan` / `1. Overview`.
     - Footer Jump Links: `Hero` -> `Ringkasan` / `Overview`.
  2. **CTA Copywriting Optimization (`copywriting/SKILL.md`):**
     - Upgraded carousel callouts from weak "Klik untuk detail" / "Click here for details" to action-oriented `Lihat Detail Proyek` / `View Project Details` and `Lihat Detail Sertifikat` / `View Certificate Details`.
     - Upgraded Hero CTA in English from noun `Featured Projects` to action verb `Explore Featured Projects`.
     - Upgraded CV CTA in English to `Download Official CV`.
     - Upgraded Contact CTA in Indonesian to `Hubungi Saya` and English to `Get In Touch`.
  3. **Comprehensive Copywriting Audit:**
     - Formulated structured analysis covering Clarity, Tone, Specificity, Proof Density, and Actionability.

### Session Entry: `2026-09-10` (Phase 35: Certificate & Project Catalog Redesign & AI Slop Badge Removal)
- **Objective:**
  1. Remove "Official Credentials" / "Kredensial Resmi" and "Complete Catalog" / "Katalog Lengkap" section badges from `/certificates` and `/projects` catalog pages (both EN and ID routes) as generic AI slop indicators.
  2. Remove obsolete metadata text `"Format: {cert.tipe}"` from certificate catalog cards.
  3. Resolve erratic card header wrapping and alignment: standardize `.card-meta` so issuer (`penerbit`) wraps gracefully on the left while the year (`tahun`) is pinned firmly to the top-right corner across all cards.
  4. Reposition `Featured ★` badge into `.card-actions` inside `.card-footer`, immediately preceding the `Lihat Detail` / `View Details` button.
- **Architectural & Design Implementation:**
  - *Clean Section Headers:* Removed `<span class="section-tag">` from `src/pages/certificates.astro`, `src/pages/certificates/id.astro`, `src/pages/projects.astro`, and `src/pages/projects/id.astro`. Title and subtitle now stand authoritative and uncluttered.
  - *Deterministic Card Meta Layout:* Changed `.card-meta` to `display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;`. Gave `.card-badge` (issuer) `flex: 1; min-width: 0; line-height: 1.4;` and `.cert-year` `flex-shrink: 0; white-space: nowrap; text-align: right;`. Regardless of whether an issuer has 3 characters or 80 characters, the year sits at the exact same horizontal baseline and top-right position across all cards.
  - *Integrated Card Footer Actions:* Placed `{cert.is_featured === 1 && <span class="featured-badge">Featured ★</span>}` inside `.card-actions` alongside the button with `margin-left: auto;`, providing balanced visual weight and pairing prominent CTAs together.
  - *Bilingual Transcript Tags:* Upgraded transcript tag inside `.card-tags` to render `<span class="lang-id">+ Transkrip Nilai</span><span class="lang-en">+ Transcript</span>`.
- **Verification & Visual Health Check:**
  - Verified local build with `npm run build` (all 12 pages rendered cleanly).
  - Executed automated browser inspection script on Astro preview server capturing both mobile (390px) and desktop (1280px) viewports:
    - `verified_certs_catalog_mobile.png`: Verified no section badge, no "Format:" text, clean meta alignment, and `Featured ★` docked to left of CTA.
    - `verified_certs_catalog_id_mobile.png`: Verified Indonesian locale equivalent.
    - `verified_certs_catalog_desktop.png`: Verified clean 3-column desktop grid with synchronized year alignment across varying issuer lengths.
    - `verified_projects_catalog_mobile.png`: Verified removal of "Complete Catalog" badge.

### Session Entry: `2026-09-11` (Phase 36: Fix Certificate Modal Redundant Format Metadata & Dock Featured Badge to Far Left)
- **Objective:**
  1. Fix certificate detail modal still displaying obsolete metadata `• Tipe: Format horizontal.` in `src/components/DetailModal.astro`.
  2. Dock `Featured ★` badge strictly to the far-left corner (`di pojok kiri`) of the card footer instead of floating in the center.
- **Architectural & Design Implementation:**
  - *Detail Modal Obsolete Format Purge:* In `src/components/DetailModal.astro`, removed `• Tipe: Format ${cert.tipe || 'horizontal'}.` from `descEl`. The modal now strictly renders clean bilingual metadata: `Issuer: ${cert.penerbit} • Year: ${cert.tahun}` (EN) and `Penerbit: ${cert.penerbit} • Tahun: ${cert.tahun}` (ID).
  - *Card Footer Alignment Standardized:* In `src/pages/certificates.astro` and `src/pages/certificates/id.astro`, moved `{cert.is_featured === 1 && <span class="featured-badge">Featured ★</span>}` directly into `.card-tags` as the first item on the far-left. Eliminated `.card-actions` wrapper entirely. Added `.open-cert-btn { margin-left: auto; flex-shrink: 0; }` so the action button always docks cleanly to the far-right corner, while badges (`Featured ★` and `+ Transcript`) always anchor firmly to the far-left corner.
- **Verification & Visual Health Check:**
  - Verified local build with `npm run build` (all 12 pages rendered cleanly).
  - Automated browser evaluation confirmed:
    - `verified_certs_far_left_mobile.png`: `Featured ★` is docked to the far-left (`pojok kiri`), and `View Details` is pinned to the far-right (`pojok kanan`).
    - `verified_cert_modal_no_format.png`: Modal description text confirmed as `Issuer: LKS SMK Kabupaten Purworejo • Year: 2026` with zero format text.
    - `verified_certs_scroll_cards.png`: Verified across multiple cards with different combinations of Featured and Transcript.

### Session Entry: `2026-09-11` (Phase 37: Implement Navbar Active State Indicator & Scrollspy for Pages and Sections)
- **Objective:**
  - Implement active indicators across the navbar for both pages (`Beranda`, `Proyek`, `Sertifikat`) and sections (`Ringkasan`, `Tentang Saya`, `Keahlian Teknis`, `Pengalaman`, `Proyek Unggulan`, `Sertifikat Pilihan`, `Kontak`).
- **Architectural & Design Implementation:**
  - *Page Active State:*
    - Integrated active link styling (`.nav-link.active`, `aria-current="page"`) with surface card background, subtle border, and high-contrast text.
    - Updated mobile drawer with `.mobile-mainlink.active` and `aria-current="page"` featuring left accent border (`border-left: 3px solid var(--color-accent)`).
    - Added smart navigation: when on `/projects` or `/certificates`, clicking `Beranda` / `Home` directly navigates to the home URL (`data-home-url`), while on the home page it toggles the sections dropdown.
  - *Dynamic Scrollspy & Active Section Badge:*
    - Added `#active-section-badge` pill with a pulsing dot indicator (`.active-dot`) directly inside the `Beranda` / `Home` dropdown button.
    - Attached `IntersectionObserver` with root margin `-15% 0px -50% 0px` to track the 7 sections (`#hero`, `#about`, `#skills`, `#experience`, `#projects`, `#certificates`, `#contact`).
    - Dynamically updates badge text with bilingual spans (`<span class="lang-id">...</span><span class="lang-en">...</span>`) to maintain 100% compatibility with CSS language switching.
    - Highlights active item in desktop dropdown menu (`.dropdown-link.active`) and mobile accordion sublinks (`.mobile-sublink.active`) with accent background, font weight, and dot indicator.
- **Verification & Visual Health Check:**
  - Verified local build with `npm run build` (all 12 routes built cleanly).
  - Executed automated browser inspection script on preview server with hard watchdog timeout:
    - `verified_navbar_home_desktop.png`: Verified desktop home top view shows `Beranda • Ringkasan ▾` active pill badge.
    - `verified_navbar_scrolled_desktop.png`: Verified sticky navbar updates badge to `Beranda • Pengalaman ▾` when scrolled to Experience section.
    - `verified_navbar_projects_desktop.png`: Verified `/projects/id` highlights `Proyek` while `Beranda` badge is hidden.
    - `verified_navbar_mobile_drawer.png`: Verified mobile drawer highlights `1. Ringkasan` with blue accent border and glowing dot indicator.

### Session Entry: `2026-09-11` (Phase 38: Fix Beranda Sublink Highlighted on Catalog Pages)
- **Objective:**
  - Fix issue where `1. Ringkasan` inside `Beranda (7 Bagian)` accordion was still highlighted with blue pill background and glowing blue dot when user was navigating catalog pages (`/projects` or `/certificates`).
- **Root Cause Analysis:**
  - In `src/components/Navbar.astro`, `active` was hardcoded statically in HTML on `<a href={`${homeUrl}#hero`} class="dropdown-link active">` and `<a href={`${homeUrl}#hero`} class="mobile-sublink active">`.
  - In addition, `setupScrollspy()` previously exited early on non-home pages without clearing active state classes and attributes from `dropdownLinks` and `mobileSublinks`.
- **Architectural & Design Implementation:**
  - *Conditional SSR Active State:* Replaced hardcoded `active` with `${isHome ? 'active' : ''}` and `aria-current={isHome ? 'true' : undefined}` on both the desktop dropdown and mobile sublinks.
  - *Dynamic Accordion Collapse:* Set `aria-expanded={isHome ? 'true' : 'false'}` on `mobile-beranda-accordion` and added `${!isHome ? 'hidden' : ''}` to `mobile-beranda-sublinks`, ensuring the accordion is neatly collapsed by default on catalog pages.
  - *Active State Purge in Client JS:* In `setupScrollspy()`, explicitly clear `active` and `aria-current` from all `dropdownLinks` and `mobileSublinks` whenever `!isHome`.
- **Verification & Visual Health Check:**
  - Verified local build with `npm run build` (all 12 routes built cleanly).
  - Automated browser inspection script with hard timeout:
    - `verified_projects_drawer_fixed.png`: Verified on `/projects/id` that `Beranda (7 Bagian)` is collapsed and inactive; `Katalog Proyek Lengkap` is the only active link.
    - `verified_projects_drawer_expanded_fixed.png`: Verified that if user manually expands `Beranda (7 Bagian)` on `/projects/id`, none of the 7 sublinks have an active highlight.
    - `verified_certs_drawer_fixed.png`: Verified on `/certificates/id` that `Beranda (7 Bagian)` is collapsed and inactive; `Katalog Sertifikat Lengkap` is the only active link.

### Session Entry: `2026-09-11` (Phase 39: Fix "Tentang Saya" Section Activation via Deterministic Focal-Line Scrollspy)
- **Objective:**
  - Resolve issue where clicking or scrolling to "Tentang Saya" (`#about`) failed to activate the item, causing "Ringkasan" (`#hero`) to remain highlighted.
- **Root Cause Analysis:**
  - *IntersectionObserver Batched Callback Flaw:* An `IntersectionObserver` callback only passes elements that *changed* intersection state in that tick. During smooth scroll towards `#about`, `#hero` crossed an intersection threshold while `#about` was already stationary in the viewport, causing `#hero` to be delivered as the only intersecting element in `entries` and overwriting the active state back to `#hero`. When `#hero` fully exited, `entries` had `isIntersecting: false`, leaving the state stuck on `#hero`.
  - *Full Path URL Fragment Reload:* Links were using `${homeUrl}#about` (e.g. `/id#about`). When already on `/id/`, clicking a full pathname link can cause browsers to trigger document navigations rather than clean in-page fragment jumps.
- **Architectural & Design Implementation:**
  - *Deterministic Focal-Line Position Detector:* Replaced the flawed `IntersectionObserver` sorting with a deterministic focal reading line detector (`focalY = 160px`, clearing the sticky header + breathing room) using `getBoundingClientRect()` throttled via `requestAnimationFrame`. Sections are verified against `rect.top <= focalY && rect.bottom > focalY`.
  - *Click Lock Mechanism:* Clicking any section link immediately invokes `updateActiveState(sectionId)` and engages a temporary scroll lock (`700ms`) preventing intermediate smooth scroll frames from resetting the target.
  - *In-Page Anchor Helper:* Added `getSectionHref(id)` to use direct fragment `#id` when on the home page (`isHome`), ensuring instant native smooth scrolling with zero full-page navigation attempts.
- **Verification & Visual Health Check:**
  - Verified local build with `npm run build` (all 12 routes built cleanly in 10.06s).
  - Executed automated Chrome CDP test script:
    - Initial top position verified active: `hero`.
    - Clicked `2. Tentang Saya`: Scrolled to `805px`, active badge updated to `Tentang Saya`, sublink updated to `about`.
    - Reopened mobile drawer: Verified `2. Tentang Saya` actively highlighted (`aboutLinkActive: true`, `heroLinkActive: false`).
    - Captured screenshot: `verified_about_active_drawer.png`.

---

## 📋 12. Backlog & Next Actions

- [x] Create clean working branch `dev` and purge old `rebuild` branch
- [x] Register portfolio app in `_ecosystem_registry` on D1 `gateway-d1`
- [x] Execute D1 migration `0001_portfolio_schema.sql`
- [x] Seed all 10 projects and 20 certificates into Cloudflare D1
- [x] Build Modern Editorial Minimalist (Apple & Vercel Light) design tokens
- [x] Implement 3D Centered Carousels with auto-fade micro-indicator
- [x] Implement Universal Accessible Detail Modal with transcript toggle
- [x] Implement 3-item Navbar (Beranda 7-section dropdown, Proyek, Sertifikat) with ID/EN switcher
- [x] Assemble 7-section Semi-SPA in `src/pages/index.astro`
- [x] Build `/projects` catalog with category tabs & search
- [x] Build `/certificates` catalog with uniform A4 ratio frame & transcript modal
- [x] Set up Cloudflare Pages Functions API and GitHub OAuth auth layer
- [x] Build Single-Page CMS Admin Panel (`/admin`) with Dynamic Notification Settings & "Kirim Uji Coba"
- [x] Add staging domain `preview.fmr.web.id` on Cloudflare Pages and verify DNS
- [x] Verify build (`npm run build`) and live endpoints via comprehensive health checks
- [ ] Merge `dev` to `public` when user approves final release to `https://fatahmr.my.id`
