// functions/api/auth/login.js
// Initiates GitHub OAuth flow for CMS Admin

export async function onRequestGet(context) {
  const { request, env } = context;
  const clientId = env.GITHUB_CLIENT_ID || 'Ov23li8lMPzjcj7LU5yZ';

  const url = new URL(request.url);

  if (!clientId) {
    return Response.redirect(`${url.origin}/admin?error=oauth_unconfigured`, 302);
  }
  const redirectUri = `${url.origin}/api/auth/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user`;

  return Response.redirect(githubAuthUrl, 302);
}
