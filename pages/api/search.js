// Scriba — live web search via SerpApi (env-gated).
// Used for the API World "SerpApi – Best AI Use Case" sponsor challenge.
// If SERPAPI_API_KEY is not set, returns { enabled: false } so the UI degrades gracefully.

export const runtime = 'nodejs';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const key = process.env.SERPAPI_API_KEY;
  if (!key) {
    response.status(200).json({ enabled: false, results: [], note: 'SerpApi not configured' });
    return;
  }

  try {
    const { query } = request.body || {};
    if (!query) {
      response.status(400).json({ error: 'Missing query' });
      return;
    }

    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(
      query,
    )}&num=5&api_key=${key}`;

    const r = await fetch(url);
    const data = await r.json();

    if (!r.ok) {
      response.status(502).json({ error: data.error || `SerpApi HTTP ${r.status}` });
      return;
    }

    const organic = Array.isArray(data.organic_results) ? data.organic_results : [];
    const results = organic.slice(0, 5).map((o) => ({
      title: o.title,
      snippet: o.snippet,
      link: o.link,
    }));

    response.status(200).json({ enabled: true, results });
  } catch (e) {
    response.status(500).json({ error: `Search failed: ${e.message}` });
  }
}
