#!/usr/bin/env node
// scripts/sync-d1-to-static.mjs
// Deterministic Sync Engine: Synchronizes Cloudflare D1 data to static JSON files
// Prevents infinite build loops via SHA-256 hash comparison.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'src', 'data');

const API_BASE = process.env.API_BASE_URL || 'https://preview.fmr.web.id';

function sha256(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function normalizeProjects(rawProjects) {
  return rawProjects.map(p => {
    let tags = [];
    if (Array.isArray(p.tags)) {
      tags = p.tags;
    } else if (typeof p.tags === 'string') {
      try {
        tags = JSON.parse(p.tags);
      } catch {
        tags = [];
      }
    }
    return {
      id: String(p.id),
      judul: String(p.judul || ''),
      english_title: String(p.english_title || ''),
      kategori: String(p.kategori || ''),
      deskripsi: String(p.deskripsi || ''),
      english_desc: String(p.english_desc || ''),
      link_dokumentasi: String(p.link_dokumentasi || ''),
      link_gambar: String(p.link_gambar || ''),
      tags,
      is_featured: Number(p.is_featured) ? 1 : 0,
      sort_order: Number(p.sort_order) || 0
    };
  }).sort((a, b) => a.sort_order - b.sort_order);
}

function normalizeCertificates(rawCerts) {
  return rawCerts.map(c => ({
    id: String(c.id),
    nama_sertifikat: String(c.nama_sertifikat || ''),
    penerbit: String(c.penerbit || ''),
    tahun: String(c.tahun || ''),
    tipe: String(c.tipe || 'horizontal'),
    tombol_transkrip: c.tombol_transkrip === 'ada' ? 'ada' : '',
    url_gambar_depan: String(c.url_gambar_depan || ''),
    url_gambar_belakang: c.url_gambar_belakang ? String(c.url_gambar_belakang) : '',
    is_featured: Number(c.is_featured) ? 1 : 0,
    sort_order: Number(c.sort_order) || 0
  })).sort((a, b) => a.sort_order - b.sort_order);
}

function normalizeConfig(rawConfig) {
  return {
    id: 'default',
    name: String(rawConfig.name || 'Fatahilah Miftahul Rahman'),
    short_name: String(rawConfig.short_name || 'Fatah'),
    title_id: String(rawConfig.title_id || 'Juara 1 LKS IT Network System Administration Purworejo 2026'),
    title_en: String(rawConfig.title_en || '1st Place Winner LKS IT Network System Administration Purworejo 2026'),
    bio_id: String(rawConfig.bio_id || ''),
    bio_en: String(rawConfig.bio_en || ''),
    email: String(rawConfig.email || 'fatahilah@protonmail.com'),
    github_url: String(rawConfig.github_url || 'https://github.com/fatahilah-mr'),
    linkedin_url: String(rawConfig.linkedin_url || 'https://www.linkedin.com/in/fatahilah-miftahul-rahman'),
    cv_url: String(rawConfig.cv_url || '/assets/CV_Fatahilah_Miftahul_Rahman.pdf')
  };
}

async function fetchFromEndpoints() {
  console.log(`[Sync Engine] Fetching fresh data from: ${API_BASE}...`);
  const [projRes, certRes, cfgRes] = await Promise.all([
    fetch(`${API_BASE}/api/projects`),
    fetch(`${API_BASE}/api/certificates`),
    fetch(`${API_BASE}/api/config`)
  ]);

  if (!projRes.ok) throw new Error(`Failed to fetch /api/projects: ${projRes.status}`);
  if (!certRes.ok) throw new Error(`Failed to fetch /api/certificates: ${certRes.status}`);
  if (!cfgRes.ok) throw new Error(`Failed to fetch /api/config: ${cfgRes.status}`);

  const rawProjects = await projRes.json();
  const rawCerts = await certRes.json();
  const rawConfig = await cfgRes.json();

  return {
    projects: normalizeProjects(rawProjects),
    certificates: normalizeCertificates(rawCerts),
    config: normalizeConfig(rawConfig)
  };
}

async function main() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const { projects, certificates, config } = await fetchFromEndpoints();

    const targets = [
      {
        file: 'projects.json',
        data: projects,
        filePath: path.join(dataDir, 'projects.json')
      },
      {
        file: 'certificates.json',
        data: certificates,
        filePath: path.join(dataDir, 'certificates.json')
      },
      {
        file: 'config.json',
        data: config,
        filePath: path.join(dataDir, 'config.json')
      }
    ];

    let totalChanges = 0;
    const changeSummary = [];

    for (const target of targets) {
      const newJsonString = JSON.stringify(target.data, null, 2) + '\n';
      const newHash = sha256(newJsonString);

      let oldHash = null;
      if (fs.existsSync(target.filePath)) {
        const oldContent = fs.readFileSync(target.filePath, 'utf8');
        oldHash = sha256(oldContent);
      }

      if (newHash !== oldHash) {
        totalChanges++;
        changeSummary.push(`- ${target.file}: updated (hash ${oldHash?.slice(0, 8) || 'none'} -> ${newHash.slice(0, 8)})`);
        fs.writeFileSync(target.filePath, newJsonString, 'utf8');
      } else {
        console.log(`[Sync Engine] ✓ ${target.file} is identical (${newHash.slice(0, 8)}), skipping.`);
      }
    }

    if (totalChanges > 0) {
      console.log(`\n[Sync Engine] 🚀 ${totalChanges} file(s) updated successfully:`);
      console.log(changeSummary.join('\n'));
      process.exitCode = 0;
      return { hasChanges: true, changeSummary };
    } else {
      console.log('\n[Sync Engine] ✨ All static files match D1 data perfectly. No changes required.');
      process.exitCode = 0;
      return { hasChanges: false, changeSummary: [] };
    }
  } catch (err) {
    console.error(`\n[Sync Engine] ❌ Error during synchronization:`, err.message);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { normalizeProjects, normalizeCertificates, normalizeConfig };
