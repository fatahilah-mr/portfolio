// functions/api/config.js
// Public API to retrieve non-sensitive site configuration (strictly excludes tokens & credentials)

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
      `SELECT id, name, short_name, title_id, title_en, bio_id, bio_en, 
              email, github_url, linkedin_url, cv_url, updated_at 
       FROM port_site_config 
       WHERE id = 'default'`
    ).all();

    if (!results || results.length === 0) {
      return new Response(JSON.stringify({ error: 'Config not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(results[0]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (err) {
    console.error('Error fetching site config:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
