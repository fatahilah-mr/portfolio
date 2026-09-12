// functions/api/admin/sync.js
// Protected Admin API for On-Demand D1-to-Static Edge GitOps Sync

import { getAdminSession } from '../_auth.js';
import { sendNotification } from '../_notify.js';

const GITHUB_REPO = 'fatahilah-mr/portfolio';

function getTargetBranch(request, env) {
  if (env.GITHUB_BRANCH) return env.GITHUB_BRANCH;
  const url = new URL(request.url);
  return (url.hostname.includes('preview') || url.hostname.includes('dev')) ? 'dev' : 'public';
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

async function fetchD1Data(db) {
  const [projsRes, certsRes, cfgRes] = await Promise.all([
    db.prepare('SELECT * FROM port_projects ORDER BY sort_order ASC').all(),
    db.prepare('SELECT * FROM port_certificates ORDER BY sort_order ASC').all(),
    db.prepare('SELECT * FROM port_site_config WHERE id = "default"').all()
  ]);

  const projects = normalizeProjects(projsRes.results || []);
  const certificates = normalizeCertificates(certsRes.results || []);
  const config = normalizeConfig((cfgRes.results && cfgRes.results[0]) || {});

  return { projects, certificates, config };
}

export async function onRequest(context) {
  const { request, env } = context;

  const session = await getAdminSession(request, env);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized. Admin session required.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const targetBranch = getTargetBranch(request, env);

  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database binding DB is missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const githubToken = env.GITHUB_TOKEN;
  if (!githubToken) {
    return new Response(JSON.stringify({ error: 'GITHUB_TOKEN is not configured on Cloudflare environment' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const method = request.method;

  // GET /api/admin/sync - Check sync status
  if (method === 'GET') {
    try {
      const d1Data = await fetchD1Data(env.DB);
      return new Response(JSON.stringify({
        status: 'ready',
        database: 'connected',
        total_projects: d1Data.projects.length,
        total_certificates: d1Data.certificates.length,
        config_short_name: d1Data.config.short_name,
        target_repo: GITHUB_REPO,
        target_branch: targetBranch
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // POST /api/admin/sync - Trigger on-demand sync & edge build
  if (method === 'POST') {
    try {
      const d1Data = await fetchD1Data(env.DB);

      const projectsJson = JSON.stringify(d1Data.projects, null, 2) + '\n';
      const certsJson = JSON.stringify(d1Data.certificates, null, 2) + '\n';
      const configJson = JSON.stringify(d1Data.config, null, 2) + '\n';

      const ghHeaders = {
        'Authorization': `Bearer ${githubToken}`,
        'User-Agent': 'Cloudflare-Pages-Sync-Engine',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      };

      // 1. Get current branch ref
      const refRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/git/ref/heads/${targetBranch}`, {
        headers: ghHeaders
      });
      if (!refRes.ok) {
        const errText = await refRes.text();
        throw new Error(`Failed to get git ref: ${refRes.status} ${errText}`);
      }
      const refData = await refRes.json();
      const latestCommitSha = refData.object.sha;

      // 2. Get commit base tree
      const commitRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/git/commits/${latestCommitSha}`, {
        headers: ghHeaders
      });
      if (!commitRes.ok) {
        throw new Error(`Failed to get commit tree: ${commitRes.status}`);
      }
      const commitData = await commitRes.json();
      const baseTreeSha = commitData.tree.sha;

      // 3. Create tree with the 3 data files
      const newTreePayload = {
        base_tree: baseTreeSha,
        tree: [
          {
            path: 'src/data/projects.json',
            mode: '100644',
            type: 'blob',
            content: projectsJson
          },
          {
            path: 'src/data/certificates.json',
            mode: '100644',
            type: 'blob',
            content: certsJson
          },
          {
            path: 'src/data/config.json',
            mode: '100644',
            type: 'blob',
            content: configJson
          }
        ]
      };

      const treeRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/git/trees`, {
        method: 'POST',
        headers: ghHeaders,
        body: JSON.stringify(newTreePayload)
      });
      if (!treeRes.ok) {
        const errText = await treeRes.text();
        throw new Error(`Failed to create git tree: ${treeRes.status} ${errText}`);
      }
      const newTreeData = await treeRes.json();
      const newTreeSha = newTreeData.sha;

      // 4. Check if tree changed
      if (newTreeSha === baseTreeSha) {
        return new Response(JSON.stringify({
          success: true,
          changed: false,
          message: 'Data di Cloudflare D1 sudah identik dengan file statis Git. Tidak diperlukan build ulang.'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 5. Create new commit
      const newCommitPayload = {
        message: 'chore(sync): automated D1 to static JSON sync',
        tree: newTreeSha,
        parents: [latestCommitSha]
      };

      const newCommitRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/git/commits`, {
        method: 'POST',
        headers: ghHeaders,
        body: JSON.stringify(newCommitPayload)
      });
      if (!newCommitRes.ok) {
        const errText = await newCommitRes.text();
        throw new Error(`Failed to create commit: ${newCommitRes.status} ${errText}`);
      }
      const newCommitData = await newCommitRes.json();
      const newCommitSha = newCommitData.sha;

      // 6. Update branch ref
      const updateRefRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/git/refs/heads/${targetBranch}`, {
        method: 'PATCH',
        headers: ghHeaders,
        body: JSON.stringify({ sha: newCommitSha })
      });
      if (!updateRefRes.ok) {
        const errText = await updateRefRes.text();
        throw new Error(`Failed to update git ref: ${updateRefRes.status} ${errText}`);
      }

      // 7. Dispatch notifications
      await sendNotification(env, {
        title: '[Portfolio | Edge Sync] ✅ Sinkronisasi D1 Berhasil',
        message: `Data D1 berhasil disinkronkan ke repositori Git.\nCommit: ${newCommitSha.slice(0, 7)}\nCloudflare Pages sedang melakukan build di edge.`,
        priority: 'high',
        tags: ['package', 'white_check_mark']
      });

      return new Response(JSON.stringify({
        success: true,
        changed: true,
        commit_sha: newCommitSha,
        files_updated: ['src/data/projects.json', 'src/data/certificates.json', 'src/data/config.json'],
        message: 'Sinkronisasi berhasil! Commit baru dibuat di GitHub dan Cloudflare Pages sedang melakukan build otomatis di edge.'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.error('Error in on-demand sync:', err);
      await sendNotification(env, {
        title: '[Portfolio | Edge Sync] 🚨 Gagal Melakukan Sinkronisasi',
        message: `Terjadi kendala saat menyinkronkan D1 ke Git: ${err.message}`,
        priority: 'high',
        tags: ['warning', 'x']
      });

      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}
