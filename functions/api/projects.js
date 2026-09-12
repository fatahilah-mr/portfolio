// functions/api/projects.js
// Public API to retrieve all projects with Cloudflare Edge Caching

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
      'SELECT * FROM port_projects ORDER BY sort_order ASC'
    ).all();

    const formatted = results.map(p => ({
      ...p,
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : (p.tags || []),
      is_featured: Boolean(p.is_featured)
    }));

    return new Response(JSON.stringify(formatted), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (err) {
    console.error('Error fetching projects:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
