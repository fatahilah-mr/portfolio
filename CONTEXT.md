# CONTEXT.md — Dokumentasi & Ringkasan Proyek Web Portofolio

Dokumen ini berisi detail teknis, arsitektur, struktur halaman, infrastruktur SEO/AI, serta ringkasan lengkap seluruh riwayat pengembangan dan perbaikan proyek web portofolio **Fatahilah Miftahul Rahman**.

---

## 👤 1. Informasi Pemilik & Profil Proyek

* **Nama Pemilik:** Fatahilah Miftahul Rahman
* **Domain Utama:** [`https://fatahmr.my.id`](https://fatahmr.my.id)
* **Hosting Platform:** Cloudflare Pages (Deployment otomatis via Git branch `public`)
* **Spesialisasi Utamanya:** 
  * IT Network & System Administration
  * Juara 1 Lomba Kompetensi Siswa (LKS) IT Network System Administration Kab. Purworejo 2026
  * Konfigurasi Jaringan Cisco (Routing & Switching) & MikroTik (RouterOS, Hotspot, Bandwidth Management)
  * Server Administration: Linux (Debian 12) & Windows Server 2022 (ADDS, DNS, DHCP)
  * AI Prompt Engineering & Otomatisasi Alur Kerja Teknis
  * Web Development Responsif (Astro, HTML, Vanilla CSS)
* **Pendidikan:** SMK Patriot Pituruh

---

## 🏗️ 2. Arsitektur Teknis & Tech Stack

* **Framework:** [Astro 5](https://astro.build/) (Output: `static` / Static Site Generation)
* **Styling System:** Vanilla CSS murni dengan CSS Custom Properties (CSS Variables), Glassmorphism UI, serta dukungan Dark Mode & Light Mode otomatis (`data-theme`).
* **Dynamic Content Provider (CMS):** Google Sheets API (`gviz/tq`) untuk memuat data proyek dan sertifikat secara dinamis, dilengkapi dengan *local caching* (24 jam) serta *SSR Static Fallback Cards* untuk mengamankan perayapan bot.
* **Internationalization (i18n):** Sistem dwibahasa (Bahasa Indonesia & English) yang diatur secara instan tanpa *page reload* melalui komponen `FloatingLang.astro` dan penyimpanan `localStorage`.

---

## 🗺️ 3. Struktur Halaman & Rute Utama

Seluruh halaman dibangun dengan struktur URL kanonikal berbasis direktori (*directory format*):

1. **Beranda (`src/pages/index.astro`)**
   * Section Hero dengan animasi fade-in yang aman bagi Googlebot.
   * `AchievementHighlight.astro`: Sorotan Juara 1 LKS ITNSA 2026.
   * `FeaturedProjects.astro`: 3 Kartu proyek unggulan dengan *fallback SSR*.
   * `HomeTeasers.astro`: Ringkasan pengalaman & keahlian.
2. **Tentang Saya (`src/pages/about.astro`)**
   * Profil lengkap, filosofi teknis (*"Connecting the future, one network at a time"*), riwayat pendidikan, dan pilar fokus utama.
3. **Pengalaman (`src/pages/experience.astro`)**
   * `ExperienceShowcase.astro`: Riwayat magang/PKL di UPTD BLK Kebumen, Fazza Computer (FTTH & Optik), dan IMC Computer.
4. **Keahlian Teknis (`src/pages/skills.astro`)**
   * 6 Pilar Keahlian: Hardware & Cabling, Cisco Networking, MikroTik & Wireless, Linux Server Administration, Windows Server Administration, serta AI & Web Development.
5. **Galeri Proyek (`src/pages/projects.astro`)**
   * Filter kategori CMS (AI, Cisco, Linux, MikroTik, Windows Server, Website) dengan kartu laboratorium teknis interaktif.
6. **Sertifikat & Transkrip (`src/pages/certificates.astro`)**
   * Galeri sertifikat resmi, piagam penghargaan LKS, transkrip nilai PKL, serta tombol akses Google Drive publik.
7. **Kontak (`src/pages/contact.astro`)**
   * Kartu kontak khusus per-tema (WhatsApp, LinkedIn, GitHub, Email, dan unduhan CV ATS PDF).
8. **Custom 404 (`src/pages/404.astro`)**
   * Halaman navigasi khusus jika pengguna mengakses URL yang tidak ditemukan.

---

## 🤖 4. Infrastruktur SEO, AI SEO (GEO), & Metadata

* **XML Sitemap (`public/sitemap.xml`):** Sitemap statis murni berstandar W3C Datetime (`2026-08-02`), kompatibel 100% dengan Google Search Console tanpa bentrok tag `hreflang`.
* **Robots.txt (`public/robots.txt`):** Mengizinkan perayapan penuh (`Allow: /`) bagi seluruh bot pencari & bot AI (Googlebot, Bingbot, GPTBot, PerplexityBot, ClaudeBot, Google-Extended).
* **LLM Context (`public/llms.txt`):** Berkas ringkasan berformat Markdown khusus untuk AI Search Engines & Autonomous Buying Agents.
* **Schema.org JSON-LD (`src/layouts/Layout.astro`):** Metadata entitas `Person` kaya yang mencantumkan `name`, `award` (LKS 2026), `knowsAbout` (6 pilar keahlian), `alumniOf`, dan profil `sameAs`.

---

## 📜 5. Ringkasan Riwayat Percakapan & Rekap Perbaikan

Berikut adalah riwayat kronologis seluruh perbaikan dan fitur yang telah dikerjakan dalam proyek ini:

1. **Perbaikan Sitemap Google Search Console:**
   * Mematikan integrasi `@astrojs/sitemap` yang berpotensi menghasilkan bentrok tag `hreflang` berulang.
   * Mengganti dengan berkas statis `public/sitemap.xml` W3C murni dan mendaftarkannya di `public/robots.txt`.
2. **Perbaikan Rendering Googlebot & Masalah Halaman Tidak Ditemukan:**
   * Mengidentifikasi penyebab Googlebot hanya merekam Navbar & Background: animasi CSS `animation-fill-mode: both` dengan `opacity: 0` mengunci rendering awal.
   * Menambahkan *SSR Static Fallback Content* pada komponen `FeaturedProjects`, `projects`, dan `certificates` agar konten langsung terbaca tanpa tergantung JavaScript klien.
3. **Penyusunan Dokumentasi Proyek AI (`GUIDE-PROJECT-AI.md`):**
   * Membuat berkas dokumentasi proyek berbasis storytelling (WHY, HOW, IMPACT) di `src/content/projects/fatahilah-portfolio.id.md` & `fatahilah-portfolio.en.md` beserta Zod Content Schema di `src/content.config.ts`.
4. **Penyelarasan Teks & Sub-judul Keahlian:**
   * Memperbarui sub-judul halaman `skills.astro` dari "Empat pilar" menjadi "Enam pilar keahlian" pada file halaman dan kamus dwibahasa `FloatingLang.astro` (ID/EN).
5. **Pemusatan Sub-judul Halaman Beranda (`FeaturedProjects`):**
   * Menambahkan `margin-left: auto; margin-right: auto;` pada `.featured-subtitle` dan `.section-subtitle` di `src/styles/global.css` sehingga teks paragraf berskala `max-width: 68ch` berada tepat di tengah layar secara simetris.
6. **Eksekusi AI SEO (`/ai-seo`) & Sitemap Audit (`/seo-sitemap`):**
   * Memperbarui `public/llms.txt` dengan tautan kanonikal bersih.
   * Memperkaya JSON-LD `Person` schema di `src/layouts/Layout.astro`.
   * Memperbarui `<lastmod>` sitemap ke versi rilis terbaru.
7. **Perbaikan Sudut Bulat Kartu Proyek Beranda:**
   * Menambahkan `border-radius: 14px 14px 0 0` pada `.project-img-wrap` di `FeaturedProjects.astro` sehingga sudut atas gambar thumbnail mengikuti sudut membulat kartu secara presisi, identik dengan halaman proyek (`projects.astro`).

---

## 🛠️ 6. Panduan Workflow & Perintah Penting

* **Perintah Build Lokal (Termux / Linux):**
  ```bash
  node ./node_modules/astro/astro.js build
  ```
* **Git Commit & Push Workflow:**
  ```bash
  git add .
  git commit -m "jenis(cakupan): pesan deskriptif"
  git push origin public
  ```

---
*Dokumen ini diperbarui secara otomatis dan berfungsi sebagai sumber kebenaran tunggal (Single Source of Truth) untuk pengembangan portofolio Fatahilah Miftahul Rahman.*
