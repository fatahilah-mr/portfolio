<!-- prettier-ignore -->
<div align="center">
  <img src="public/assets/favicon/favicon.ico" width="96" alt="Fatahilah M.R Logo">
  
  # Fatahilah M.R Portfolio
  *A high-performance, minimalist personal portfolio powered by a Google Sheets CMS*
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=flat-square&logo=vercel)](https://redesign-portfolio.vercel.app/)
  [![Astro](https://img.shields.io/badge/Astro-5.0.0-ff5a03?style=flat-square&logo=astro)](https://astro.build/)
  [![Vanilla CSS](https://img.shields.io/badge/CSS-Vanilla-1572B6?style=flat-square&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)

  ⭐ If you like this project, star it on GitHub!

  [Features](#features) • [Architecture](#architecture) • [Getting Started](#getting-started) 

</div>

This repository contains the source code for the personal portfolio of Fatahilah Miftahul Rahman. It is designed to be extremely lightweight, highly performant, and fully accessible, utilizing **Astro** for static site generation and a clever **Google Sheets** integration as a headless CMS for dynamic project management.

> [!TIP]
> The entire project content (like projects and lab experiments) can be updated on-the-fly simply by editing a Google Sheet, without requiring a new deployment.

## Features

- ⚡ **Blazing Fast Performance** - Zero JavaScript shipped to the client by default.
- 📊 **Google Sheets CMS** - Fetches data dynamically from Google Sheets via the `gviz/tq` API for the Projects/Lab section.
- 🌐 **Bilingual Support** - Instant language switching (ID/EN) managed via DOM manipulation and `localStorage`, avoiding full-page reloads.
- 🎨 **Premium Minimalist UI** - Sleek dark/light modes, ghost buttons, tailored color palettes, and responsive typography.
- 🪄 **Micro-animations** - Tactile feedback on all interactive elements using CSS `transform` and `-webkit-tap-highlight-color` resets for a native app feel.
- 📈 **Scroll Progress Indicator** - A subtle, glowing gradient scroll progress bar running on highly-optimized vanilla JS.

## Architecture

The project is structured following standard Astro conventions:

- `src/pages/` - Contains the main routes (`index.astro`, `projects.astro`, `about.astro`, etc.).
- `src/components/` - Reusable UI components like `Navbar.astro` and `FloatingLang.astro`.
- `src/layouts/` - The main `Layout.astro` wrapper that handles global metadata, font preloading, and anti-FOUC theme initialization scripts.
- `src/styles/` - Contains the single source of truth for styling, `global.css`, loaded with a robust set of CSS variables (design tokens).

## Getting Started

To run this project locally, you need [Node.js](https://nodejs.org/) installed on your machine.

**1. Clone the repository:**
```bash
git clone <your-repo-url>
cd redesign-portfolio
```

**2. Install dependencies:**
```bash
npm install
```

**3. Start the development server:**
```bash
npm run dev
```

The site will be available at `http://localhost:4321`.

**4. Build for production:**
```bash
npm run build
```
The compiled static files will be generated in the `dist/` directory.

## Connect with Me 🤝

Interested in discussing a project, collaboration, or just want to say hi? Feel free to reach out!

<div align="left">
  <a href="https://linkedin.com/in/fatahilah-miftahul-rahman">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="mailto:your.email@example.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
  </a>
</div>
