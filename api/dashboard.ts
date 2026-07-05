import { getDb, getUserId, json } from './_helpers';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405);

  const userId = await getUserId(req);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const sql = getDb();

  const rows = await sql`
    SELECT
      uc.id           AS user_card_id,
      c.name          AS card_name,
      c.network       AS card_network,
      b.id            AS benefit_id,
      b.title,
      b.description,
      b.category,
      b.frequency,
      b.value_usd,
      b.currency,
      b.benefit_type,
      b.proof_url,
      COALESCE(
        json_agg(
          json_build_object('id', bu.id, 'period', bu.period)
        ) FILTER (WHERE bu.id IS NOT NULL),
        '[]'
      ) AS usages
    FROM user_cards uc
    JOIN cards    c  ON c.id       = uc.card_id
    JOIN benefits b  ON b.card_id  = uc.card_id
    LEFT JOIN benefit_usage bu
           ON bu.benefit_id   = b.id
          AND bu.user_card_id = uc.id
    WHERE uc.user_id = ${userId}
      AND b.frequency   IN ('monthly', 'annual', 'one-time', 'ongoing')
      AND b.benefit_type IN ('credit', 'perk')
    GROUP BY uc.id, c.name, c.network,
             b.id, b.title, b.description, b.category,
             b.frequency, b.value_usd, b.currency, b.benefit_type, b.proof_url
    ORDER BY c.name, b.value_usd DESC
  `;

  return json(rows);
}
