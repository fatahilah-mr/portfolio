# CONTEXT.md — Dokumentasi Arsitektur, Kode, & Rekapitulasi Proyek Web Portofolio

> **Status Proyek:** Production Ready & Live at [`https://fatahmr.my.id`](https://fatahmr.my.id)  
> **Pemilik:** Fatahilah Miftahul Rahman  
> **Repository:** `fatahilah-mr/portfolio` (Branch `public`)  
> **Hosting:** Cloudflare Pages  

---

## 🚀 1. Ringkasan Eksekutif & Identitas Proyek

Situs web portofolio ini dirancang sebagai platform interaktif berkinerja tinggi untuk menampilkan profil profesional, galeri proyek laboratorium teknis, sertifikasi, serta riwayat pengalaman **Fatahilah Miftahul Rahman** — Juara 1 Lomba Kompetensi Siswa (LKS) SMK IT Network System Administration Kabupaten Purworejo 2026.

Situs dibangun menggunakan arsitektur **Static Site Generation (SSG)** berbasis **Astro 5** tanpa bergantung pada framework JavaScript berat di sisi klien. Seluruh data proyek dan sertifikat dikelola secara terpusat melalui **Google Sheets Headless CMS** yang dikombinasikan dengan sistem *caching* 24 jam dan *static SSR fallback cards* untuk menjamin indeksasi 100% sempurna di Google Search Console maupun mesin pencari AI.

---

## 🛠️ 2. Arsitektur Teknis & Tech Stack

```mermaid
flowchart TD
    A[Astro 5 SSG Build Engine] --> B[HTML & Vanilla CSS Bundle]
    B --> C[Cloudflare Pages Edge Network]
    
    subgraph Client-Side Architecture
        D[Anti-FOUC Theme & Lang Script] --> E[LocalStorage Engine]
        F[Google Sheets Headless CMS API] --> G[24h Local Cache]
        G --> H[Dynamic DOM Render]
        I[Static SSR Fallback Cards] -->|Fallback if No-JS| H
        J[FloatingLang Translation Engine] -->|data-i18n| H
    end
    
    C --> Client-Side Architecture
```

| Komponen | Teknologi | Deskripsi & Implementasi |
|---|---|---|
| **Core Framework** | **Astro v5.0** | Output `static`, format direktori kanonikal (`build.format: 'directory'`). |
| **Desain & Styling** | **Vanilla CSS Murni** | Terorganisasi di `src/styles/global.css` dengan CSS Custom Properties (Theme Variables), Glassmorphism (`.glass-card`), Typography `DM Sans` & `JetBrains Mono`, serta perataan fluida. |
| **Data Provider (CMS)** | **Google Sheets API (`gviz/tq`)** | Fetch data proyek & sertifikat secara langsung dari Google Spreadsheet (`1YMxR6-SlP-TT0B3y6NScT4L0YH0GXZEId_PY0Jgp8fQ`) dengan `localStorage` cache 24 jam. |
| **SSR Fallback HTML** | **Astro Static Elements** | Menyediakan 3 kartu statis di HTML awal untuk mengamankan perayapan bot (Googlebot, PerplexityBot, GPTBot) tanpa ketergantungan JavaScript. |
| **Internationalization (i18n)** | **Bilingual Engine (ID/EN)** | Kamus terpusat di `src/i18n/ui.ts` yang disinkronisasikan ke mesin penerjemah DOM di `src/components/FloatingLang.astro` tanpa *page reload*. |
| **Keamanan & Performa** | **Vanilla Anti-FOUC** | Script inline di `<head>` untuk mencegah *flash of unstyled content* saat memuat tema (`light`/`dark`) dan bahasa (`id`/`en`). |

---

## 📂 3. Struktur Berkas & Direktori Utama

```text
portfolio-new/
├── public/
│   ├── assets/              # Gambar, favicon, logo, & PDF CV ATS
│   ├── llms.txt             # Berkas konteks Markdown untuk AI Search Engines
│   ├── robots.txt           # Konfigurasi perayapan bot & tautan sitemap
│   └── sitemap.xml          # XML sitemap statis murni W3C Datetime (7 rute)
├── src/
│   ├── components/          # Komponen UI Astro
│   │   ├── AchievementHighlight.astro  # Card sorotan Juara 1 LKS 2026
│   │   ├── ExperienceShowcase.astro    # Timeline riwayat PKL/Magang
│   │   ├── FeaturedProjects.astro      # 3 Card proyek unggulan di Beranda
│   │   ├── FloatingLang.astro          # Tombol ganti bahasa + penerjemah DOM
│   │   ├── Footer.astro                # Footer & tagline resmi
│   │   ├── HomeTeasers.astro           # Navigasi cepat beranda ke Keahlian/Pengalaman
│   │   └── Navbar.astro                # Header, navigasi, & toggle mode malam
│   ├── content/             # Astro Content Collections (Storytelling Markdown)
│   │   └── projects/        # fatahilah-portfolio.id.md & fatahilah-portfolio.en.md
│   ├── content.config.ts    # Skema Zod untuk Content Collections
│   ├── i18n/
│   │   └── ui.ts            # Kamus terjemahan bilingual (ID & EN)
│   ├── layouts/
│   │   └── Layout.astro     # Main HTML wrapper, Schema.org JSON-LD, Fonts, & Meta
│   ├── pages/               # Rute Halaman Utama
│   │   ├── 404.astro        # Custom 404 page
│   │   ├── about.astro      # Halaman Profil, Filosofi, & Core Focus
│   │   ├── certificates.astro # Halaman Sertifikat, Piagam LKS, & Transkrip PKL
│   │   ├── contact.astro    # Halaman Kontak (WA, LinkedIn, GitHub, Email, CV)
│   │   ├── experience.astro # Halaman Riwayat Pengalaman & Pendidikan
│   │   ├── index.astro      # Halaman Utama (Beranda / Hero / Highlights)
│   │   ├── projects.astro   # Halaman Galeri Laboratorium & Filter CMS
│   │   └── skills.astro     # Halaman 6 Pilar Keahlian Teknis
│   └── styles/
│       └── global.css       # Design tokens, CSS variables, & pemusatan teks global
├── astro.config.mjs         # Konfigurasi Astro (output static, site URL)
├── CONTEXT.md               # Single Source of Truth dokumentasi proyek ini
├── GUIDE-PROJECT-AI.md      # Panduan standar dokumentasi storytelling proyek
├── package.json             # Dependensi (astro ^5.0.0, @astrojs/sitemap ^3.7.3)
└── vercel.json / Cloudflare # Konfigurasi deployment hosting
```

---

## 📑 4. Rincian Halaman & Komponen Utama

### A. Halaman Beranda (`src/pages/index.astro`)
* **Hero Section:** Tagline *"IT Network System Administration & Web Development"*, tombol CTA utama, dan animasi fade-in yang dioptimalkan untuk Googlebot (tanpa `animation-fill-mode: both` yang mengunci opacity ke 0).
* **`AchievementHighlight.astro`:** Kartu visual khusus menyoroti gelar **Juara 1 LKS IT Network System Administration Purworejo 2026**.
* **`FeaturedProjects.astro`:** Menampilkan 3 proyek terbaik dari Google Sheets CMS dengan `border-radius: 14px 14px 0 0` pada `.project-img-wrap` agar sudut kartu membulat sempurna.
* **`HomeTeasers.astro`:** Tautan cepat menuju rute Keahlian dan Pengalaman.

### B. Halaman Tentang Saya (`src/pages/about.astro`)
* Memuat latar belakang pendidikan (SMK Patriot Pituruh), filosofi teknis 3 pilar (Security & Reliability 99.9% Uptime, Efficient Automation, Continuous Learning), serta status profesional *Fresh Graduate TKJ 2026*.

### C. Halaman Pengalaman (`src/pages/experience.astro`)
* Timeline interaktif riwayat Praktik Kerja Lapangan (PKL) di **UPTD BLK Kebumen**, **Fazza Computer (FTTH & Serat Optik)**, dan **IMC Computer**, serta pendidikan TKJ.

### D. Halaman Keahlian Teknis (`src/pages/skills.astro`)
* Menampilkan **6 Pilar Keahlian Teknis**:
  1. *Hardware & Cabling* (Serat Optik, Fusion Splicer, OTDR, UTP Patch Cord).
  2. *Cisco Networking & Switching* (IOS, VLAN, Routing OSPF/BGP, Trunking, Port Security).
  3. *MikroTik & Wireless Infrastructure* (RouterOS, Bandwidth Management Queue, Hotspot Gateway, CAPsMAN).
  4. *Linux Server Administration* (Debian 12, Nginx, Apache, DNS Bind9, DHCP, SSH, Webmin).
  5. *Windows Server Administration* (Windows Server 2022, Active Directory Domain Services, Group Policy).
  6. *AI Prompt Engineering & Web Development* (Automated Diagnostics, Astro 5, Vanilla CSS, Headless CMS).

### E. Halaman Galeri Proyek (`src/pages/projects.astro`)
* Galeri eksperimen laboratorium interaktif dengan filter kategori (Semua, AI, Cisco, Linux, MikroTik, Windows Server, Website), fitur pencarian live, serta tautan repositori/topologi.

### F. Halaman Sertifikat (`src/pages/certificates.astro`)
* Menampilkan piagam LKS, sertifikat kompetensi, transkrip nilai PKL, serta tombol akses berkas Google Drive publik.

### G. Halaman Kontak (`src/pages/contact.astro`)
* Kartu kontak terpusat dengan aksen warna khusus per-tema:
  * **WhatsApp:** Hijau `#25D366` dengan layout tombol terpusat (`flex-direction: column; align-items: center;`).
  * **LinkedIn:** Biru `#0A66C2`.
  * **GitHub:** Monokrom / Dark Accent.
  * **Email:** Merah `#EA4335`.
  * **Resume CV ATS:** Berkas PDF resmi (`https://cdn.fatahmr.my.id/portfolio/assets/CV%20Fatahilah%20Miftahul%20Rahman.pdf`).

---

## 🌐 5. Infrastruktur SEO, AI SEO (AEO), & Metadata Entitas

1. **Google Search Console & XML Sitemap (`public/sitemap.xml`):**
   * Sitemap statis murni tanpa integrasi plugin yang bentrok dengan tag `hreflang`.
   * Berisi 7 rute kanonikal berformat W3C Datetime (`2026-08-02`): `/`, `/about/`, `/certificates/`, `/contact/`, `/experience/`, `/projects/`, `/skills/`.
2. **Robots.txt (`public/robots.txt`):**
   * Mengizinkan perayapan terbuka (`User-agent: * Allow: /`) dan mendaftarkan lokasi sitemap.
   * Memberikan akses penuh bagi bot pencari berbasis AI (`GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Bingbot`).
3. **Agent-Readable Context (`public/llms.txt`):**
   * Menyediakan berkas Markdown ringkas untuk AI Assistants dan *Autonomous Agents* yang mengekstrak informasi profil, spesialisasi, dan tautan halaman utama.
4. **Schema.org JSON-LD (`src/layouts/Layout.astro`):**
   * Metadata entitas `Person` terstruktur yang mencantumkan:
     * `name`: Fatahilah Miftahul Rahman
     * `jobTitle`: IT Network System Administration & Web Development Specialist
     * `award`: Juara 1 Lomba Kompetensi Siswa (LKS) IT Network System Administration Kabupaten Purworejo 2026
     * `knowsAbout`: Array 6 pilar keahlian teknis
     * `alumniOf`: SMK Patriot Pituruh
     * `sameAs`: Profil resmi GitHub (`fatahilah-mr`) & LinkedIn (`fatahilah-mr`)

---

## 📜 6. Rekapitulasi Percakapan & Evolusi Perbaikan (Fase 1 – 9)

Berikut adalah riwayat kronologis lengkap perbaikan dan penguatan fitur yang telah berhasil dilakukan pada codebase ini:

* **Fase 10 — Perbaikan Workflow Deployment GitHub Actions (`.github/workflows/deploy.yml`):**  
  Menyelaraskan skrip deployment FTPS ke cPanel menggunakan referensi `.github/deploy.yml` yang teruji, menambahkan perintah `rm -rf dist` sebelum build untuk menghapus sisa build lama di runner, mengaktifkan `dangerous-clean-slate: true` agar server cPanel dibersihkan secara total sebelum mengunggah ualng, serta mendaftarkan pemicu otomatis untuk branch `public` & `main`.
* **Fase 1 — Perbaikan Sitemap & Google Search Console:**  
  Mematikan integrasi `@astrojs/sitemap` yang berpotensi menghasilkan bentrok tag `hreflang` berulang. Menggantinya dengan berkas statis `public/sitemap.xml` berstandar W3C Datetime serta menyesuaikan `public/robots.txt`.
* **Fase 2 — Perbaikan Rendering Googlebot & SSR Fallback:**  
  Memperbaiki masalah laporan GSC *Halaman Tidak Ditemukan* yang disebabkan oleh animasi CSS `animation-fill-mode: both` dengan `opacity: 0`. Menambahkan *SSR Static Fallback Cards* di `FeaturedProjects.astro`, `projects.astro`, dan `certificates.astro` untuk memastikan bot mendapatkan HTML murni tanpa perlu mengeksekusi Client JS.
* **Fase 3 — Dokumentasi Proyek Storytelling AI:**  
  Membuat dokumentasi proyek portofolio sesuai panduan `GUIDE-PROJECT-AI.md` di `src/content/projects/fatahilah-portfolio.id.md` & `fatahilah-portfolio.en.md` beserta definisi skema Zod di `src/content.config.ts`.
* **Fase 4 — Optimasasi Halaman Kontak & Tombol WhatsApp:**  
  Memperbaiki konflik hover `translateY`, bayangan *glow* per-tema, serta menyusun tombol *"Kirim Pesan WhatsApp Sekarang"* dengan `flex-direction: column; align-items: center;` agar terpusat secara presisi di tengah.
* **Fase 5 — Sinkronisasi Tagline Header & Footer:**  
  Memperbarui tagline resmi di `Footer.astro` dan `FloatingLang.astro` menjadi *"IT Network System Administration & Web Development"*.
* **Fase 6 — Penyesuaian Sub-judul Keahlian:**  
  Memperbarui teks sub-judul dari 4 pilar menjadi 6 pilar keahlian pada `skills.astro` dan kamus dwibahasa `FloatingLang.astro` (ID/EN).
* **Fase 7 — Perataan Tengah Sub-judul Beranda (`global.css`):**  
  Menambahkan `margin-left: auto; margin-right: auto;` pada `.featured-subtitle` dan `.section-subtitle` di `src/styles/global.css` untuk memastikan paragraf sub-judul berukuran `max-width: 68ch` berada presisi di tengah layar secara horizontal.
* **Fase 8 — Implementasi AI SEO (`/ai-seo`) & Sitemap Audit (`/seo-sitemap`):**  
  Memperbarui `public/llms.txt` dengan tautan rute kanonikal bersih, memperkaya skema JSON-LD `Person`, serta memverifikasi kesesuaian sitemap XML.
* **Fase 9 — Perbaikan Sudut Bulat Kartu Proyek Beranda:**  
  Menambahkan `border-radius: 14px 14px 0 0` pada `.project-img-wrap` di `FeaturedProjects.astro` sehingga gambar thumbnail tidak menutupi sudut atas kartu, menghasilkan sudut membulat yang simetris dengan halaman proyek (`projects.astro`).

---

## ⚡ 7. Alur Kerja Perintah & Deployment

### Perintah Build Lokal (Termux / Linux)
```bash
node ./node_modules/astro/astro.js build
```

### Git Workflow Standard
```bash
git add .
git commit -m "jenis(cakupan): deskripsi perubahan singkat"
git push origin public
```

---
*Dokumen CONTEXT.md ini adalah berkas acuan resmi (Single Source of Truth) untuk arsitektur, histori perbaikan, dan standar teknis proyek portofolio Fatahilah Miftahul Rahman.*
