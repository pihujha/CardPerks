import { getDb, getUserId, json } from './_helpers';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405);

  const userId = await getUserId(req);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const sql = getDb();

  // Return each benefit with annualised value so client can group by category
  const rows = await sql`
    SELECT
      c.id            AS card_id,
      c.name          AS card_name,
      c.network       AS card_network,
      b.id            AS benefit_id,
      b.title,
      b.category,
      b.frequency,
      b.benefit_type,
      b.value_usd,
      b.currency,
      b.proof_url,
      CASE b.frequency
        WHEN 'monthly'   THEN b.value_usd * 12
        WHEN 'quarterly' THEN b.value_usd * 4
        WHEN 'annual'    THEN b.value_usd
        ELSE                  b.value_usd
      END AS annual_value
    FROM user_cards uc
    JOIN cards    c ON c.id      = uc.card_id
    JOIN benefits b ON b.card_id = uc.card_id
    WHERE uc.user_id      = ${userId}
      AND b.benefit_type != 'reward_rate'
      AND b.value_usd    > 0
    ORDER BY c.name, b.category, b.value_usd DESC
  `;

  return json(rows);
}
