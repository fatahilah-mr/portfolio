// functions/api/auth/dev-login.js
// Local development / testing login bypass strictly guarded against production misuse

import { ALLOWED_ADMIN, createSessionToken, buildSessionCookie } from '../_auth.js';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const isDevEnabled = env.DEV_LOGIN_ENABLED === 'true';

  if (!isLocalhost && !isDevEnabled) {
    return new Response(JSON.stringify({ error: 'Dev login is strictly disabled in production' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Generate session for @fatahilah-mr
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
