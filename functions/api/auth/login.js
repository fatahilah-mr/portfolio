// functions/api/auth/login.js
// Initiates GitHub OAuth flow for CMS Admin

export async function onRequestGet(context) {
  const { request, env } = context;
  const clientId = env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response(
      JSON.stringify({ error: 'GITHUB_CLIENT_ID environment variable is not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/auth/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user`;

  return Response.redirect(githubAuthUrl, 302);
}
