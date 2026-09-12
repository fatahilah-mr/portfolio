// functions/api/admin/config.js
// Protected endpoint to retrieve and update site configuration and notification settings

import { getAdminSession } from '../_auth.js';
import { sendNotification } from '../_notify.js';

export async function onRequest(context) {
  const { request, env } = context;

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

  // GET /api/admin/config
  if (method === 'GET') {
    try {
      const { results } = await env.DB.prepare('SELECT * FROM port_site_config WHERE id = "default"').all();
      if (!results || results.length === 0) {
        return new Response(JSON.stringify({ error: 'Config not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const cfg = results[0];
      return new Response(JSON.stringify({
        ...cfg,
        tele_enabled: Boolean(cfg.tele_enabled)
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // PUT /api/admin/config
  if (method === 'PUT') {
    try {
      const body = await request.json();

      // Retrieve existing config first
      const { results: existingRows } = await env.DB.prepare('SELECT * FROM port_site_config WHERE id = "default"').all();
      const existing = existingRows[0] || {};

      const name = body.name !== undefined ? body.name : existing.name;
      const short_name = body.short_name !== undefined ? body.short_name : existing.short_name;
      const title_id = body.title_id !== undefined ? body.title_id : existing.title_id;
      const title_en = body.title_en !== undefined ? body.title_en : existing.title_en;
      const bio_id = body.bio_id !== undefined ? body.bio_id : existing.bio_id;
      const bio_en = body.bio_en !== undefined ? body.bio_en : existing.bio_en;
      const email = body.email !== undefined ? body.email : existing.email;
      const github_url = body.github_url !== undefined ? body.github_url : existing.github_url;
      const linkedin_url = body.linkedin_url !== undefined ? body.linkedin_url : existing.linkedin_url;
      const cv_url = body.cv_url !== undefined ? body.cv_url : existing.cv_url;

      // Notification settings
      const tele_bot_token = body.tele_bot_token !== undefined ? body.tele_bot_token : existing.tele_bot_token;
      const tele_chat_id = body.tele_chat_id !== undefined ? body.tele_chat_id : existing.tele_chat_id;
      const tele_enabled = body.tele_enabled !== undefined ? (body.tele_enabled ? 1 : 0) : existing.tele_enabled;
      const ntfy_server = body.ntfy_server !== undefined ? body.ntfy_server : existing.ntfy_server;
      const ntfy_topic = body.ntfy_topic !== undefined ? body.ntfy_topic : existing.ntfy_topic;
      const ntfy_token = body.ntfy_token !== undefined ? body.ntfy_token : existing.ntfy_token;
      const ntfy_username = body.ntfy_username !== undefined ? body.ntfy_username : existing.ntfy_username;
      const ntfy_password = body.ntfy_password !== undefined ? body.ntfy_password : existing.ntfy_password;

      await env.DB.prepare(`
        UPDATE port_site_config SET
          name = ?,
          short_name = ?,
          title_id = ?,
          title_en = ?,
          bio_id = ?,
          bio_en = ?,
          email = ?,
          github_url = ?,
          linkedin_url = ?,
          cv_url = ?,
          tele_bot_token = ?,
          tele_chat_id = ?,
          tele_enabled = ?,
          ntfy_server = ?,
          ntfy_topic = ?,
          ntfy_token = ?,
          ntfy_username = ?,
          ntfy_password = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 'default'
      `).bind(
        name,
        short_name,
        title_id,
        title_en,
        bio_id,
        bio_en,
        email,
        github_url,
        linkedin_url,
        cv_url,
        tele_bot_token,
        tele_chat_id,
        tele_enabled,
        ntfy_server,
        ntfy_topic,
        ntfy_token,
        ntfy_username,
        ntfy_password
      ).run();

      context.waitUntil(sendNotification(env, {
        title: 'CMS: Konfigurasi Situs Diperbarui',
        message: 'Pengaturan profil dan/atau parameter notifikasi berhasil diperbarui melalui CMS.',
        tags: ['gear', 'white_check_mark']
      }));

      return new Response(JSON.stringify({ success: true }), {
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
