import { getDb, json } from './_helpers';

export const config = { runtime: 'edge' };

export default async function handler(): Promise<Response> {
  const sql = getDb();
  const cards = await sql`
    SELECT id, name, bank, network, tier
    FROM cards
    ORDER BY
      CASE tier WHEN 'premium' THEN 1 WHEN 'mid' THEN 2 ELSE 3 END,
      bank, name
  `;
  return json(cards);
}
