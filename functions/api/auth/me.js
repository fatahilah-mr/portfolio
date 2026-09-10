// functions/api/auth/me.js
// Validates current admin session

import { getAdminSession } from '../_auth.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  const session = await getAdminSession(request, env);

  if (!session) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  }

  return new Response(JSON.stringify({
    authenticated: true,
    user: session.username,
    expiresAt: session.expiry
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}
