-- Migration: 0001_portfolio_schema.sql
-- Description: Inisialisasi skema tabel ekosistem D1 untuk portofolio (prefix port_*)

-- 1. Daftarkan aplikasi ke _ecosystem_registry
INSERT OR REPLACE INTO _ecosystem_registry (
    app_id, app_name, table_prefix, domain, description, status, updated_at
) VALUES (
    'portfolio',
    'Fatahilah Portfolio',
    'port_',
    'fatahmr.my.id',
    'Personal portfolio, lab projects & verified certificates',
    'active',
    CURRENT_TIMESTAMP
);

-- 2. Tabel Konfigurasi Situs & Pengaturan Notifikasi
CREATE TABLE IF NOT EXISTS port_site_config (
    id TEXT PRIMARY KEY DEFAULT 'default',
    name TEXT NOT NULL DEFAULT 'Fatahilah Miftahul Rahman',
    short_name TEXT NOT NULL DEFAULT 'Fatahilah',
    title_id TEXT NOT NULL DEFAULT 'Juara 1 LKS IT Network System Administration Purworejo 2026',
    title_en TEXT NOT NULL DEFAULT '1st Place Winner LKS IT Network System Administration Purworejo 2026',
    bio_id TEXT NOT NULL DEFAULT 'Siswa SMK bidang IT Network System Administration dan pengembang web modern. Terbiasa mengelola infrastruktur jaringan enterprise, server Linux, serta otomatisasi cerdas.',
    bio_en TEXT NOT NULL DEFAULT 'Vocational high school student in IT Network System Administration and modern web development. Experienced with enterprise network infrastructure, Linux servers, and AI workflows.',
    email TEXT NOT NULL DEFAULT 'fatahilah@protonmail.com',
    github_url TEXT NOT NULL DEFAULT 'https://github.com/fatahilah-mr',
    linkedin_url TEXT NOT NULL DEFAULT 'https://www.linkedin.com/in/fatahilah-miftahul-rahman',
    cv_url TEXT NOT NULL DEFAULT '/assets/CV_Fatahilah_Miftahul_Rahman.pdf',
    tele_bot_token TEXT DEFAULT '',
    tele_chat_id TEXT DEFAULT '',
    ntfy_server TEXT DEFAULT 'https://ntfy.fmr.web.id',
    ntfy_topic TEXT DEFAULT 'agent',
    ntfy_token TEXT DEFAULT '',
    tele_enabled INTEGER DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Proyek (Portofolio & Lab Showcase)
CREATE TABLE IF NOT EXISTS port_projects (
    id TEXT PRIMARY KEY,
    judul TEXT NOT NULL,
    english_title TEXT,
    kategori TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    english_desc TEXT,
    link_dokumentasi TEXT,
    link_gambar TEXT,
    tags TEXT DEFAULT '[]',
    is_featured INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Sertifikat & Transkrip Nilai
CREATE TABLE IF NOT EXISTS port_certificates (
    id TEXT PRIMARY KEY,
    nama_sertifikat TEXT NOT NULL,
    penerbit TEXT NOT NULL,
    tahun TEXT NOT NULL,
    tipe TEXT NOT NULL DEFAULT 'horizontal',
    tombol_transkrip TEXT DEFAULT '',
    url_gambar_depan TEXT NOT NULL,
    url_gambar_belakang TEXT DEFAULT '',
    is_featured INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Indexes untuk Performa Kueri & Caching
CREATE INDEX IF NOT EXISTS idx_port_projects_sort ON port_projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_port_projects_feat ON port_projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_port_projects_kat ON port_projects(kategori);
CREATE INDEX IF NOT EXISTS idx_port_certs_sort ON port_certificates(sort_order);
CREATE INDEX IF NOT EXISTS idx_port_certs_feat ON port_certificates(is_featured);
