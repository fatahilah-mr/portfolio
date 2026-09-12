// functions/api/auth/dev-login.js
// Staging & Local testing login bypass strictly guarded against final production domain (fatahmr.my.id)

import { ALLOWED_ADMIN, createSessionToken, buildSessionCookie } from '../_auth.js';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // 1. Permanently disabled on production domain
  if (url.hostname === 'fatahmr.my.id' || url.hostname.endsWith('.fatahmr.my.id')) {
    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 2. Allowed on localhost, staging preview host, or when DEV_LOGIN_ENABLED is 'true'
  const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const isStagingHost = url.hostname.includes('preview.fmr.web.id') || url.hostname.includes('pages.dev');
  const isDevFlagActive = String(env.DEV_LOGIN_ENABLED || '').toLowerCase() === 'true';

  if (!isLocalhost && !isStagingHost && !isDevFlagActive) {
    return new Response(JSON.stringify({ error: 'Dev login is disabled on this environment.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Generate valid HMAC-SHA256 session for @fatahilah-mr
  const secret = env.AUTH_SECRET || 'fatahilah-staging-auth-secret-key-32chars-secure';
  const sessionToken = await createSessionToken(ALLOWED_ADMIN, secret);
  const cookieHeader = buildSessionCookie(sessionToken);

  return new Response(null, {
    status: 302,
    headers: {
      'Location': `${url.origin}/admin`,
      'Set-Cookie': cookieHeader
    }
  });
}
