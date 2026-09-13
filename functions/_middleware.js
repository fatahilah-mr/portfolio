// functions/_middleware.js
// Cloudflare Pages Edge Middleware: Auto-detect Region + User Language Preference + Legacy 301 Redirects

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, '') || '/';

  // 1. Skip non-GET / non-HEAD requests
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return next();
  }

  // 2. Bypass API endpoints, admin portal, static assets, and files with extensions
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_astro') ||
    pathname.startsWith('/assets') ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return next();
  }

  // 3. Fast 301 Redirects for Legacy Indonesian Routes
  if (pathname === '/id') {
    return Response.redirect(new URL('/', request.url), 301);
  }
  if (pathname === '/projects/id') {
    return Response.redirect(new URL('/projects', request.url), 301);
  }
  if (pathname === '/certificates/id') {
    return Response.redirect(new URL('/certificates', request.url), 301);
  }

  // Parse Cookie Header for 'preferred_lang'
  const cookieHeader = request.headers.get('Cookie') || '';
  let preferredLang = null;
  if (cookieHeader) {
    const cookies = cookieHeader.split(';');
    for (const c of cookies) {
      const [k, ...v] = c.trim().split('=');
      if (k === 'preferred_lang') {
        preferredLang = v.join('=').trim().toLowerCase();
        break;
      }
    }
  }

  // 4. Root Path ('/') Logic: Language Preference Handling (Zero-Redirect on first load)
  if (pathname === '/') {
    // Only redirect if user previously explicitly selected English
    if (preferredLang === 'en') {
      const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
      const isBot = /googlebot|google-inspectiontool|chrome-lighthouse|lighthouse|pagespeed|bingbot|yandex|duckduckbot|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest\/0\.|slackbot|vkshare|w3c_validator|whatsapp|telegrambot/i.test(userAgent);
      if (!isBot) {
        return Response.redirect(new URL('/en/', request.url), 302);
      }
    }
    return next();
  }

  // 5. English Root ('/en') Handling: Record preference if user explicitly visits English version
  if (pathname === '/en' && !preferredLang) {
    const response = await next();
    const newResponse = new Response(response.body, response);
    newResponse.headers.append('Set-Cookie', 'preferred_lang=en; Path=/; Max-Age=31536000; SameSite=Lax');
    return newResponse;
  }

  return next();
}
