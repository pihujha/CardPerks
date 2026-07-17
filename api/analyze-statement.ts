import { json } from './_helpers';

export const config = { runtime: 'edge' };

const LLM_URL = (typeof process !== 'undefined' && process.env.LLM_URL) || 'http://localhost:8000';

async function categorize(description: string): Promise<string> {
  try {
    const res = await fetch(`${LLM_URL}/categorize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    });
    if (!res.ok) return 'other';
    const data = await res.json() as { category: string };
    return data.category;
  } catch {
    return 'other';
  }
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body: { descriptions: string[] };
  try {
    body = await request.json() as { descriptions: string[] };
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { descriptions } = body;
  if (!Array.isArray(descriptions) || descriptions.length === 0) {
    return json({ error: 'descriptions must be a non-empty array' }, 400);
  }

  // Categorize in batches of 4 to avoid overwhelming the LLM server
  const categories: string[] = [];
  const BATCH = 4;
  for (let i = 0; i < descriptions.length; i += BATCH) {
    const batch = descriptions.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(categorize));
    categories.push(...results);
  }

  return json({ categories });
}
