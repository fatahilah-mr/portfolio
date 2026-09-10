// functions/api/auth/dev-login.js
// Staging & Local testing login bypass strictly guarded against final production domain (fatahmr.my.id)

import { ALLOWED_ADMIN, createSessionToken, buildSessionCookie } from '../_auth.js';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const isStagingHost = url.hostname.includes('preview.fmr.web.id') || url.hostname.includes('pages.dev');
  const isDevFlagActive = String(env.DEV_LOGIN_ENABLED || '').toLowerCase() === 'true';

  // Strictly block if accessed from final production domain (fatahmr.my.id) without explicit dev flag
  const isAllowed = isLocalhost || (isStagingHost && url.hostname !== 'fatahmr.my.id') || isDevFlagActive;

  if (!isAllowed) {
    return new Response(JSON.stringify({ error: 'Dev login is strictly disabled on production domain (fatahmr.my.id)' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Generate valid HMAC-SHA256 session for @fatahilah-mr
  const sessionToken = await createSessionToken(ALLOWED_ADMIN, env.AUTH_SECRET);
  const cookieHeader = buildSessionCookie(sessionToken);

  return new Response(null, {
    status: 302,
    headers: {
      'Location': `${url.origin}/admin`,
      'Set-Cookie': cookieHeader
    }
  });
}
