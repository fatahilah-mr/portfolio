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

  // 4. Root Path ('/') Logic: Region Auto-Detection + Language Preference
  if (pathname === '/') {
    // If user explicitly chose English in previous sessions
    if (preferredLang === 'en') {
      return Response.redirect(new URL('/en', request.url), 302);
    }

    // If user explicitly chose Indonesian, stay on root
    if (preferredLang === 'id') {
      return next();
    }

    // Check User-Agent to avoid redirecting search engine bots and social scrapers
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
    const isBot = /googlebot|bingbot|yandex|duckduckbot|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest\/0\.|slackbot|vkshare|w3c_validator|whatsapp|telegrambot/i.test(userAgent);
    
    if (isBot) {
      return next();
    }

    // Cloudflare Edge Country Detection
    // request.cf.country provides ISO 3166-1 alpha-2 country code (e.g. ID, US, SG, GB)
    const country = (request.cf?.country || request.headers.get('cf-ipcountry') || '').toUpperCase().trim();

    // If accessing from OUTSIDE Indonesia (and not unknown/tor codes like XX, T1)
    if (country && country !== 'ID' && country !== 'XX' && country !== 'T1') {
      const redirectUrl = new URL('/en', request.url);
      return new Response(null, {
        status: 302,
        headers: {
          'Location': redirectUrl.toString(),
          'Set-Cookie': 'preferred_lang=en; Path=/; Max-Age=31536000; SameSite=Lax',
        },
      });
    }

    // If accessing from Indonesia without prior preference, stamp Indonesian preference
    if (country === 'ID') {
      const response = await next();
      // Clone response to attach Set-Cookie header if not already set
      const newResponse = new Response(response.body, response);
      newResponse.headers.append('Set-Cookie', 'preferred_lang=id; Path=/; Max-Age=31536000; SameSite=Lax');
      return newResponse;
    }
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
