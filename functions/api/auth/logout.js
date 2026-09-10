// functions/api/auth/logout.js
// Clears admin session cookie and redirects to home or admin

import { buildClearCookie } from '../_auth.js';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  return new Response(null, {
    status: 302,
    headers: {
      'Location': `${url.origin}/admin`,
      'Set-Cookie': buildClearCookie()
    }
  });
}
