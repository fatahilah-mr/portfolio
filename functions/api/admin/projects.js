// functions/api/admin/projects.js
// Protected CMS CRUD endpoints for Projects

import { getAdminSession } from '../_auth.js';
import { sendNotification } from '../_notify.js';

export async function onRequest(context) {
  const { request, env } = context;

  // 1. Session check
  const session = await getAdminSession(request, env);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized. Admin session required.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database binding DB is missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const method = request.method;

  // GET /api/admin/projects
  if (method === 'GET') {
    try {
      const { results } = await env.DB.prepare('SELECT * FROM port_projects ORDER BY sort_order ASC').all();
      return new Response(JSON.stringify(results.map(p => ({
        ...p,
        tags: typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : (p.tags || []),
        is_featured: Boolean(p.is_featured)
      }))), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // POST /api/admin/projects (Create)
  if (method === 'POST') {
    try {
      const body = await request.json();
      const id = body.id || String(Date.now());
      const tags = JSON.stringify(body.tags || []);
      const isFeatured = body.is_featured ? 1 : 0;
      const sortOrder = parseInt(body.sort_order || 99, 10);

      await env.DB.prepare(`
        INSERT INTO port_projects (id, judul, english_title, kategori, deskripsi, english_desc, link_dokumentasi, link_gambar, tags, is_featured, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        id,
        body.judul || '',
        body.english_title || '',
        body.kategori || 'Website',
        body.deskripsi || '',
        body.english_desc || '',
        body.link_dokumentasi || '',
        body.link_gambar || '',
        tags,
        isFeatured,
        sortOrder
      ).run();

      // Dispatch alert
      context.waitUntil(sendNotification(env, {
        title: 'CMS: Proyek Baru Ditambahkan',
        message: `Proyek "${body.judul}" (${body.kategori}) telah berhasil disimpan ke database.`,
        tags: ['white_check_mark', 'briefcase']
      }));

      return new Response(JSON.stringify({ success: true, id }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // PUT /api/admin/projects (Update)
  if (method === 'PUT') {
    try {
      const body = await request.json();
      if (!body.id) {
        return new Response(JSON.stringify({ error: 'Project ID is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      const existing = await env.DB.prepare('SELECT * FROM port_projects WHERE id = ?').bind(body.id).first();
      if (!existing) {
        return new Response(JSON.stringify({ error: 'Project not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }

      const judul = body.judul !== undefined ? body.judul : existing.judul;
      const englishTitle = body.english_title !== undefined ? body.english_title : existing.english_title;
      const kategori = body.kategori !== undefined ? body.kategori : existing.kategori;
      const deskripsi = body.deskripsi !== undefined ? body.deskripsi : existing.deskripsi;
      const englishDesc = body.english_desc !== undefined ? body.english_desc : existing.english_desc;
      const linkDok = body.link_dokumentasi !== undefined ? body.link_dokumentasi : existing.link_dokumentasi;
      const linkGambar = body.link_gambar !== undefined ? body.link_gambar : existing.link_gambar;
      const tags = body.tags !== undefined ? (typeof body.tags === 'string' ? body.tags : JSON.stringify(body.tags)) : existing.tags;
      const isFeatured = body.is_featured !== undefined ? (body.is_featured ? 1 : 0) : existing.is_featured;
      const sortOrder = body.sort_order !== undefined ? parseInt(body.sort_order, 10) : existing.sort_order;

      await env.DB.prepare(`
        UPDATE port_projects SET
          judul = ?,
          english_title = ?,
          kategori = ?,
          deskripsi = ?,
          english_desc = ?,
          link_dokumentasi = ?,
          link_gambar = ?,
          tags = ?,
          is_featured = ?,
          sort_order = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        judul,
        englishTitle,
        kategori,
        deskripsi,
        englishDesc,
        linkDok,
        linkGambar,
        tags,
        isFeatured,
        sortOrder,
        body.id
      ).run();

      context.waitUntil(sendNotification(env, {
        title: 'CMS: Proyek Diperbarui',
        message: `Proyek "${judul}" (ID: ${body.id}) telah diperbarui.`,
        tags: ['pencil2', 'briefcase']
      }));

      return new Response(JSON.stringify({ success: true, id: body.id }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // DELETE /api/admin/projects
  if (method === 'DELETE') {
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(JSON.stringify({ error: 'Project ID is required in query params' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      await env.DB.prepare('DELETE FROM port_projects WHERE id = ?').bind(id).run();

      context.waitUntil(sendNotification(env, {
        title: 'CMS: Proyek Dihapus',
        message: `Proyek ID: ${id} telah dihapus dari database.`,
        tags: ['wastebasket', 'briefcase']
      }));

      return new Response(JSON.stringify({ success: true, id }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  return new Response(JSON.stringify({ error: `Method ${method} Not Allowed` }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}
