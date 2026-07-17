import { getDb, getUserId, json } from './_helpers';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  const userId = await getUserId(req);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS statement_analyses (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id      UUID NOT NULL,
      name         TEXT NOT NULL,
      period       TEXT NOT NULL,
      card_name    TEXT,
      transactions JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  if (req.method === 'GET') {
    const rows = await sql`
      SELECT
        id, name, period, card_name, created_at,
        jsonb_array_length(transactions) AS transaction_count,
        (
          SELECT COALESCE(SUM((t->>'amount')::numeric), 0)
          FROM jsonb_array_elements(transactions) t
        ) AS total_spend,
        (
          SELECT COALESCE(jsonb_object_agg(category, cat_total), '{}'::jsonb)
          FROM (
            SELECT t->>'category' AS category,
                   SUM((t->>'amount')::numeric) AS cat_total
            FROM jsonb_array_elements(transactions) t
            GROUP BY t->>'category'
          ) cats
        ) AS spend_by_category
      FROM statement_analyses
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    return json(rows);
  }

  if (req.method === 'POST') {
    const body = (await req.json()) as {
      name: string;
      period: string;
      card_name?: string;
      transactions: Array<{ description: string; amount: number; category: string }>;
    };

    const [row] = await sql`
      INSERT INTO statement_analyses (user_id, name, period, card_name, transactions)
      VALUES (
        ${userId},
        ${body.name},
        ${body.period},
        ${body.card_name ?? null},
        ${JSON.stringify(body.transactions)}::jsonb
      )
      RETURNING id, name, period, card_name, created_at
    `;
    return json(row, 201);
  }

  return json({ error: 'Method not allowed' }, 405);
}
