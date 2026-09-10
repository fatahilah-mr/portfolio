// functions/api/admin/notify-test.js
// Protected test endpoint to verify Telegram & ntfy notifications from CMS

import { getAdminSession } from '../_auth.js';
import { sendNotification } from '../_notify.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  const session = await getAdminSession(request, env);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized. Admin session required.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    let customMsg = 'Uji coba pengiriman notifikasi dari CMS Portofolio Fatahilah berhasil terhubung!';
    try {
      const body = await request.json();
      if (body.message) customMsg = body.message;
    } catch (_) {}

    const result = await sendNotification(env, {
      title: '🧪 Uji Coba Notifikasi CMS Portofolio',
      message: `${customMsg}\n\nWaktu: ${new Date().toISOString()}`,
      priority: 'high',
      tags: ['test_tube', 'white_check_mark']
    });

    return new Response(JSON.stringify({
      success: result.telegram.success || result.ntfy.success,
      details: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
