// functions/api/auth/callback.js
// Handles GitHub OAuth Callback, validates CSRF state, authenticates @fatahilah-mr, and issues session cookie

import { ALLOWED_ADMIN, createSessionToken, buildSessionCookie, buildClearOAuthStateCookie } from '../_auth.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  // Parse cookies
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );
  const storedOAuthState = cookies['oauth_state'];

  if (error || !code) {
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `${url.origin}/admin?error=${encodeURIComponent(error || 'missing_code')}`,
        'Set-Cookie': buildClearOAuthStateCookie()
      }
    });
  }

  // 1. Strict CSRF State Validation (RFC 6749 Section 10.12)
  if (!state || !storedOAuthState || state !== storedOAuthState) {
    console.error('OAuth state mismatch. Expected:', storedOAuthState, 'Received:', state);
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `${url.origin}/admin?error=csrf_state_mismatch`,
        'Set-Cookie': buildClearOAuthStateCookie()
      }
    });
  }

  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('OAuth configuration missing: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET not set.');
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `${url.origin}/admin?error=oauth_unconfigured`,
        'Set-Cookie': buildClearOAuthStateCookie()
      }
    });
  }

  try {
    // 2. Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Fatahilah-Portfolio-CMS'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${url.origin}${url.pathname}`
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error('GitHub token exchange failed:', tokenData);
      const errorMsg = tokenData.error_description || tokenData.error || 'token_exchange_failed';
      return new Response(null, {
        status: 302,
        headers: {
          'Location': `${url.origin}/admin?error=${encodeURIComponent(errorMsg)}`,
          'Set-Cookie': buildClearOAuthStateCookie()
        }
      });
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

    const headers = new Headers();
    headers.set('Location', `${url.origin}/admin`);
    headers.append('Set-Cookie', cookieHeader);
    headers.append('Set-Cookie', buildClearOAuthStateCookie());

    return new Response(null, {
      status: 302,
      headers
    });
  } catch (err) {
    console.error('OAuth callback error:', err);
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `${url.origin}/admin?error=${encodeURIComponent(err.message)}`,
        'Set-Cookie': buildClearOAuthStateCookie()
      }
    });
  }
}
