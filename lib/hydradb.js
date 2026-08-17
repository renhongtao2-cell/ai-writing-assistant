// lib/hydradb.js
// Minimal HydraDB REST client for the Hack Hydra 2026 "Memory and Context Retrieval" track.
//
// Verified endpoints (base https://api.hydradb.com, api_version 2.0.1):
//   POST /databases         -> ensure database (tenant) exists
//   POST /context/ingest    -> write memory  (multipart form, type=memory, memories=JSON string)
//   POST /query             -> retrieve      (JSON, type=memory)
//
// Design: every function degrades gracefully. If HYDRA_DB_API_KEY is missing or any
// request fails, it returns null/[] and the caller keeps working (memory is an
// enhancement, never a hard dependency of the writing flow).

const HYDRADB_BASE = process.env.HYDRADB_BASE_URL || 'https://api.hydradb.com';
const API_KEY = process.env.HYDRA_DB_API_KEY;
// The HydraDB free plan provisions a single tenant. The account's pre-provisioned
// tenant is "default-tenant"; creating a new one returns "accepted" but is not
// immediately ready for ingest. Default to the ready tenant.
const DATABASE = process.env.HYDRADB_DATABASE || 'default-tenant';
const COLLECTION = process.env.HYDRADB_COLLECTION || 'scriba-memory';

function authHeaders() {
  return { Authorization: `Bearer ${API_KEY}` };
}

export function hydraEnabled() {
  return Boolean(API_KEY);
}

let dbEnsured = false;

export async function ensureDatabase(db = DATABASE) {
  if (!API_KEY) return false;
  if (dbEnsured) return true;
  try {
    const res = await fetch(`${HYDRADB_BASE}/databases`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ database: db }),
    });
    // 200/202 = created/accepted; conflicts ("already exists") are fine.
    dbEnsured = true;
    if (!res.ok) {
      const t = await res.text();
      console.warn('[HYDRADB] ensureDatabase status', res.status, t.slice(0, 200));
    }
    return true;
  } catch (e) {
    console.error('[HYDRADB] ensureDatabase failed:', e.message);
    return false;
  }
}

// Store one memory string. `infer: true` lets HydraDB extract structured facts.
export async function addMemory({
  text,
  userName = 'scriba-user',
  db = DATABASE,
  collection = COLLECTION,
  infer = true,
  upsert = true,
}) {
  if (!API_KEY) return null;
  try {
    await ensureDatabase(db);
    const memories = JSON.stringify([{ text, infer, user_name: userName }]);
    const form = new FormData();
    form.append('database', db);
    form.append('type', 'memory');
    form.append('collection', collection);
    form.append('memories', memories);
    form.append('upsert', String(upsert));

    const res = await fetch(`${HYDRADB_BASE}/context/ingest`, {
      method: 'POST',
      headers: authHeaders(),
      body: form,
    });
    if (!res.ok) {
      const t = await res.text();
      console.error('[HYDRADB] ingest error', res.status, t.slice(0, 300));
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error('[HYDRADB] addMemory failed:', e.message);
    return null;
  }
}

// Retrieve relevant past memories for a query. Returns array of text strings.
export async function retrieveMemories({
  query,
  maxResults = 5,
  db = DATABASE,
  collection = COLLECTION,
}) {
  if (!API_KEY) return [];
  try {
    const res = await fetch(`${HYDRADB_BASE}/query`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        database: db,
        collection,
        type: 'memory',
        max_results: maxResults,
        graph_context: false,
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error('[HYDRADB] query error', res.status, t.slice(0, 300));
      return [];
    }
    const data = await res.json();
    const chunks = data?.data?.chunks || [];
    return chunks
      .map((c) => c.chunk_content || c.text || c.content || c.snippet || '')
      .filter(Boolean);
  } catch (e) {
    console.error('[HYDRADB] retrieveMemories failed:', e.message);
    return [];
  }
}
