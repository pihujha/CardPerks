import { getDb, getUserId, json } from '../_helpers';

export const config = { runtime: 'edge' };

export default async function handler(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  if (req.method !== 'DELETE') return json({ error: 'Method not allowed' }, 405);

  const userId = await getUserId(req);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const sql = getDb();
  await sql`
    DELETE FROM user_cards
    WHERE id = ${params.id} AND user_id = ${userId}
  `;

  return json({ success: true });
}
