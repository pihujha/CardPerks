import { getDb, getUserId, json } from './_helpers';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  const userId = await getUserId(req);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const sql = getDb();

  if (req.method === 'GET') {
    const rows = await sql`
      SELECT
        uc.id,
        uc.card_id,
        uc.nickname,
        uc.added_at,
        c.name,
        c.bank,
        c.network,
        c.tier,
        COALESCE(
          json_agg(
            json_build_object(
              'id',           b.id,
              'title',        b.title,
              'description',  b.description,
              'category',     b.category,
              'frequency',    b.frequency,
              'value_usd',    b.value_usd,
              'currency',     b.currency,
              'benefit_type', b.benefit_type,
              'proof_url',    b.proof_url
            ) ORDER BY b.value_usd DESC
          ) FILTER (WHERE b.id IS NOT NULL),
          '[]'
        ) AS benefits
      FROM user_cards uc
      JOIN cards c ON c.id = uc.card_id
      LEFT JOIN benefits b ON b.card_id = uc.card_id
      WHERE uc.user_id = ${userId}
      GROUP BY uc.id, uc.card_id, uc.nickname, uc.added_at,
               c.name, c.bank, c.network, c.tier
      ORDER BY uc.added_at DESC
    `;
    return json(rows);
  }

  if (req.method === 'POST') {
    const body = (await req.json()) as { card_id: string; nickname?: string };
    const [row] = await sql`
      INSERT INTO user_cards (user_id, card_id, nickname)
      VALUES (${userId}, ${body.card_id}, ${body.nickname ?? null})
      ON CONFLICT (user_id, card_id) DO NOTHING
      RETURNING id
    `;
    return json(row ?? { error: 'Card already added' }, row ? 201 : 409);
  }

  return json({ error: 'Method not allowed' }, 405);
}
