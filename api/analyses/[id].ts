import { getDb, getUserId, json } from '../_helpers';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  const userId = await getUserId(req);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  if (!id) return json({ error: 'Missing id' }, 400);

  const sql = getDb();

  if (req.method === 'GET') {
    const [row] = await sql`
      SELECT id, name, period, card_name, transactions, created_at
      FROM statement_analyses
      WHERE id = ${id} AND user_id = ${userId}
    `;
    if (!row) return json({ error: 'Not found' }, 404);
    return json(row);
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM statement_analyses WHERE id = ${id} AND user_id = ${userId}`;
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
}
