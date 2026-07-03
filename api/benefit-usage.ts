import { getDb, getUserId, json } from './_helpers';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  const userId = await getUserId(req);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const sql = getDb();

  if (req.method === 'POST') {
    const { benefit_id, user_card_id, period } = (await req.json()) as {
      benefit_id: string; user_card_id: string; period: string;
    };

    // Verify user owns this user_card
    const [uc] = await sql`
      SELECT id FROM user_cards WHERE id = ${user_card_id} AND user_id = ${userId} LIMIT 1
    `;
    if (!uc) return json({ error: 'Not found' }, 404);

    const [row] = await sql`
      INSERT INTO benefit_usage (user_card_id, benefit_id, period)
      VALUES (${user_card_id}, ${benefit_id}, ${period})
      ON CONFLICT (user_card_id, benefit_id, period) DO NOTHING
      RETURNING id, period
    `;
    return json(row ?? {}, row ? 201 : 409);
  }

  if (req.method === 'DELETE') {
    const url    = new URL(req.url);
    const usageId = url.searchParams.get('usage_id');
    if (!usageId) return json({ error: 'usage_id required' }, 400);

    await sql`
      DELETE FROM benefit_usage bu
      USING user_cards uc
      WHERE bu.id            = ${usageId}
        AND bu.user_card_id  = uc.id
        AND uc.user_id       = ${userId}
    `;
    return json({ success: true });
  }

  return json({ error: 'Method not allowed' }, 405);
}
