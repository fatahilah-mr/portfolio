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
