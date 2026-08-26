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

- **Active Milestone:** `v2.5.0 — Polish, No-AI-Slop Audit, & 2D Responsive Alignment`
- **Current Status:** 🟢 Production Ready & Fully Deployed
- **Active Task:** Built `CONTEXT.md` matching `template/CONTEXT.md` standard.
- **Known Blockers / Gotchas:** None. Build completes with zero errors.

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

### Session Entry: `2026-08-07` (Navbar Centering & Full-Height Hero Section)
- **Objective:** Fix desktop Navbar menu off-center shifting and set Home Hero Section to full viewport height.
- **Completed Work:**
  - Updated `Navbar.astro` desktop layout to 3-column CSS Grid (`grid-template-columns: 1fr auto 1fr`) so the 7 navigation links align to exact screen center regardless of logo or theme button width differences.
  - Updated `index.astro` `.hero-section` to `min-height: calc(100vh - 64px)` and `min-height: calc(100dvh - 64px)` with vertical centering.

### Session Entry: `2026-08-26` (Template CONTEXT.md Standardization)
- **Objective:** Reformat and standardize root `CONTEXT.md` according to the reference template in `template/CONTEXT.md`.
- **Completed Work:**
  - Preserved all historical context, domain technical stack details, SEO architecture, and phase histories.
  - Applied standardized 12-section blueprint format.

---

## 📋 12. Backlog & Next Actions

- [x] Upgrade deployment runner to Node.js 24
- [x] Remove section eyebrow badges across all pages
- [x] Audit and fix AI-slop text patterns using `no-ai-slop` skill
- [x] Clean up dead code (`src/i18n/ui.ts`)
- [x] Update projects grid to 3 columns on desktop
- [x] Align desktop navbar links to true screen center
- [x] Set Home Hero Section to full-viewport height (`100dvh`)
- [x] Reformat `CONTEXT.md` using `template/CONTEXT.md` structure
