// functions/api/certificates.js
// Public API to retrieve all certificates with Cloudflare Edge Caching

export async function onRequestGet(context) {
  const { env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database binding DB is missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM port_certificates ORDER BY sort_order ASC'
    ).all();

    const formatted = results.map(c => ({
      ...c,
      is_featured: Boolean(c.is_featured)
    }));

    return new Response(JSON.stringify(formatted), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (err) {
    console.error('Error fetching certificates:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
