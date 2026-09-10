// functions/api/admin/certificates.js
// Protected CMS CRUD endpoints for Certificates

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

  // GET /api/admin/certificates
  if (method === 'GET') {
    try {
      const { results } = await env.DB.prepare('SELECT * FROM port_certificates ORDER BY sort_order ASC').all();
      return new Response(JSON.stringify(results.map(c => ({
        ...c,
        is_featured: Boolean(c.is_featured)
      }))), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // POST /api/admin/certificates (Create)
  if (method === 'POST') {
    try {
      const body = await request.json();
      const id = body.id || String(Date.now());
      const isFeatured = body.is_featured ? 1 : 0;
      const sortOrder = parseInt(body.sort_order || 99, 10);

      await env.DB.prepare(`
        INSERT INTO port_certificates (id, nama_sertifikat, penerbit, tahun, tipe, tombol_transkrip, url_gambar_depan, url_gambar_belakang, is_featured, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        id,
        body.nama_sertifikat || '',
        body.penerbit || '',
        body.tahun || '',
        body.tipe || 'horizontal',
        body.tombol_transkrip || '',
        body.url_gambar_depan || '',
        body.url_gambar_belakang || '',
        isFeatured,
        sortOrder
      ).run();

      context.waitUntil(sendNotification(env, {
        title: 'CMS: Sertifikat Baru Ditambahkan',
        message: `Sertifikat "${body.nama_sertifikat}" (${body.penerbit}) telah ditambahkan.`,
        tags: ['trophy', 'page_facing_up']
      }));

      return new Response(JSON.stringify({ success: true, id }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // PUT /api/admin/certificates (Update)
  if (method === 'PUT') {
    try {
      const body = await request.json();
      if (!body.id) {
        return new Response(JSON.stringify({ error: 'Certificate ID is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      const existing = await env.DB.prepare('SELECT * FROM port_certificates WHERE id = ?').bind(body.id).first();
      if (!existing) {
        return new Response(JSON.stringify({ error: 'Certificate not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }

      const namaSertifikat = body.nama_sertifikat !== undefined ? body.nama_sertifikat : existing.nama_sertifikat;
      const penerbit = body.penerbit !== undefined ? body.penerbit : existing.penerbit;
      const tahun = body.tahun !== undefined ? body.tahun : existing.tahun;
      const tipe = body.tipe !== undefined ? body.tipe : existing.tipe;
      const tombolTranskrip = body.tombol_transkrip !== undefined ? body.tombol_transkrip : existing.tombol_transkrip;
      const urlGambarDepan = body.url_gambar_depan !== undefined ? body.url_gambar_depan : existing.url_gambar_depan;
      const urlGambarBelakang = body.url_gambar_belakang !== undefined ? body.url_gambar_belakang : existing.url_gambar_belakang;
      const isFeatured = body.is_featured !== undefined ? (body.is_featured ? 1 : 0) : existing.is_featured;
      const sortOrder = body.sort_order !== undefined ? parseInt(body.sort_order, 10) : existing.sort_order;

      await env.DB.prepare(`
        UPDATE port_certificates SET
          nama_sertifikat = ?,
          penerbit = ?,
          tahun = ?,
          tipe = ?,
          tombol_transkrip = ?,
          url_gambar_depan = ?,
          url_gambar_belakang = ?,
          is_featured = ?,
          sort_order = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        namaSertifikat,
        penerbit,
        tahun,
        tipe,
        tombolTranskrip,
        urlGambarDepan,
        urlGambarBelakang,
        isFeatured,
        sortOrder,
        body.id
      ).run();

      context.waitUntil(sendNotification(env, {
        title: 'CMS: Sertifikat Diperbarui',
        message: `Sertifikat "${namaSertifikat}" (ID: ${body.id}) telah diperbarui.`,
        tags: ['pencil2', 'trophy']
      }));

      return new Response(JSON.stringify({ success: true, id: body.id }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // DELETE /api/admin/certificates
  if (method === 'DELETE') {
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(JSON.stringify({ error: 'Certificate ID is required in query params' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      await env.DB.prepare('DELETE FROM port_certificates WHERE id = ?').bind(id).run();

      context.waitUntil(sendNotification(env, {
        title: 'CMS: Sertifikat Dihapus',
        message: `Sertifikat ID: ${id} telah dihapus dari database.`,
        tags: ['wastebasket', 'trophy']
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
