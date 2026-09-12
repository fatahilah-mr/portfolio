// functions/api/auth/callback.js
// Handles GitHub OAuth Callback, validates @fatahilah-mr, and issues session cookie

import { ALLOWED_ADMIN, createSessionToken, buildSessionCookie } from '../_auth.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error || !code) {
    return Response.redirect(`${url.origin}/admin?error=${encodeURIComponent(error || 'missing_code')}`, 302);
  }

  const clientId = env.GITHUB_CLIENT_ID || 'Ov23li8lMPzjcj7LU5yZ';
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return Response.redirect(`${url.origin}/admin?error=oauth_unconfigured`, 302);
  }

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error('GitHub token exchange failed:', tokenData);
      return Response.redirect(`${url.origin}/admin?error=token_exchange_failed`, 302);
    }

    // 2. Fetch authenticated GitHub user
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'User-Agent': 'Fatahilah-Portfolio-CMS',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const userData = await userRes.json();
    if (!userData || !userData.login) {
      return Response.redirect(`${url.origin}/admin?error=user_fetch_failed`, 302);
    }

    // 3. STRICT CHECK: Only @fatahilah-mr is permitted
    if (userData.login.toLowerCase() !== ALLOWED_ADMIN.toLowerCase()) {
      return new Response(
        `<html><body style="font-family:sans-serif;padding:40px;text-align:center;">
          <h2 style="color:#e11d48;">403 - Akses Ditolak</h2>
          <p>Login GitHub <strong>@${userData.login}</strong> tidak memiliki otorisasi mengelola portofolio ini.</p>
          <p>Akses dibatasi khusus untuk <strong>@${ALLOWED_ADMIN}</strong>.</p>
          <a href="/admin" style="display:inline-block;margin-top:20px;color:#2563eb;">Kembali</a>
        </body></html>`,
        { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    // 4. Issue HMAC-SHA256 session token
    const sessionToken = await createSessionToken(ALLOWED_ADMIN, env.AUTH_SECRET);
    const cookieHeader = buildSessionCookie(sessionToken);

    return new Response(null, {
      status: 302,
      headers: {
        'Location': `${url.origin}/admin`,
        'Set-Cookie': cookieHeader
      }
    });
  } catch (err) {
    console.error('OAuth callback error:', err);
    return Response.redirect(`${url.origin}/admin?error=${encodeURIComponent(err.message)}`, 302);
  }
}
