import { getDb, getUserId, json } from '../_helpers';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'DELETE') return json({ error: 'Method not allowed' }, 405);

  const userId = await getUserId(req);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  // In Vercel edge runtime, path params aren't injected via second argument — extract from URL
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  if (!id) return json({ error: 'Missing id' }, 400);

  const sql = getDb();
  await sql`
    DELETE FROM user_cards
    WHERE id = ${id} AND user_id = ${userId}
  `;

  return json({ success: true });
}
