// functions/api/auth/login.js
// Initiates GitHub OAuth flow with RFC 6749 Section 10.12 CSRF State Protection

import { buildOAuthStateCookie } from '../_auth.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  const clientId = env.GITHUB_CLIENT_ID;
  const url = new URL(request.url);

  if (!clientId) {
    console.error('GITHUB_CLIENT_ID is not configured on Cloudflare environment.');
    return Response.redirect(`${url.origin}/admin?error=oauth_unconfigured`, 302);
  }

  // Generate cryptographically secure CSRF state token
  const state = crypto.randomUUID();
  const redirectUri = `${url.origin}/api/auth/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user&state=${encodeURIComponent(state)}`;

  return new Response(null, {
    status: 302,
    headers: {
      'Location': githubAuthUrl,
      'Set-Cookie': buildOAuthStateCookie(state)
    }
  });
}
