const fs = require('fs');
const path = require('path');

const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');

const projects = [];
const certificates = [];

// Parse INSERT statements
const projectRegex = /INSERT OR REPLACE INTO port_projects \([^)]+\) VALUES \('([^']+)', '([^']+)', '([^']+)', '([^']+)', '((?:[^'\\]|\\.)*)', '((?:[^'\\]|\\.)*)', '([^']+)', '([^']+)', '([^']*)', (\d+), (\d+)\);/g;

let match;
while ((match = projectRegex.exec(seedSql)) !== null) {
  projects.push({
    id: match[1],
    judul: match[2],
    english_title: match[3],
    kategori: match[4],
    deskripsi: match[5].replace(/\\'/g, "'"),
    english_desc: match[6].replace(/\\'/g, "'"),
    link_dokumentasi: match[7],
    link_gambar: match[8],
    tags: JSON.parse(match[9] || '[]'),
    is_featured: parseInt(match[10], 10),
    sort_order: parseInt(match[11], 10)
  });
}

const certRegex = /INSERT OR REPLACE INTO port_certificates \([^)]+\) VALUES \('([^']+)', '([^']+)', '([^']+)', '([^']+)', '([^']+)', (NULL|'[^']*'), '([^']+)', (NULL|'[^']*'), (\d+), (\d+)\);/g;

while ((match = certRegex.exec(seedSql)) !== null) {
  certificates.push({
    id: match[1],
    nama_sertifikat: match[2],
    penerbit: match[3],
    tahun: match[4],
    tipe: match[5],
    tombol_transkrip: match[6] === 'NULL' ? '' : match[6].replace(/^'|'$/g, ''),
    url_gambar_depan: match[7],
    url_gambar_belakang: match[8] === 'NULL' ? '' : match[8].replace(/^'|'$/g, ''),
    is_featured: parseInt(match[9], 10),
    sort_order: parseInt(match[10], 10)
  });
}

const config = {
  id: 'default',
  name: 'Fatahilah Miftahul Rahman',
  short_name: 'Fatahilah',
  title_id: 'Juara 1 LKS IT Network System Administration Purworejo 2026',
  title_en: '1st Place Winner LKS IT Network System Administration Purworejo 2026',
  bio_id: 'Siswa SMK bidang IT Network System Administration dan pengembang web modern. Terbiasa mengelola infrastruktur jaringan enterprise, server Linux, serta otomatisasi cerdas.',
  bio_en: 'Vocational high school student in IT Network System Administration and modern web development. Experienced with enterprise network infrastructure, Linux servers, and AI workflows.',
  email: 'fatahilah.f10@gmail.com',
  github_url: 'https://github.com/fatahilah-mr',
  linkedin_url: 'https://www.linkedin.com/in/fatahilah-miftahul-rahman',
  cv_url: '/assets/CV_Fatahilah_Miftahul_Rahman.pdf'
};

const dataDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, 'projects.json'), JSON.stringify(projects, null, 2));
fs.writeFileSync(path.join(dataDir, 'certificates.json'), JSON.stringify(certificates, null, 2));
fs.writeFileSync(path.join(dataDir, 'config.json'), JSON.stringify(config, null, 2));

console.log(`Successfully generated:\n- ${projects.length} projects\n- ${certificates.length} certificates\n- config.json`);
