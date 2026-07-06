import { getDb, getUserId, json } from './_helpers';

export const config = { runtime: 'edge' };

type Benefit = {
  title: string;
  description: string;
  category: string;
  frequency: string;
  value_usd: number;
  benefit_type: string;
  currency: string;
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const userId = await getUserId(req);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const body = await req.json() as { card_id?: string; benefits?: Benefit[] };
  const { card_id, benefits } = body;

  if (!card_id || !Array.isArray(benefits) || benefits.length === 0) {
    return json({ error: 'Missing card_id or benefits' }, 400);
  }

  const sql = getDb();

  // Replace all existing benefits for this card
  await sql`DELETE FROM benefits WHERE card_id = ${card_id}`;

  for (const b of benefits) {
    await sql`
      INSERT INTO benefits (card_id, title, description, category, frequency, value_usd, benefit_type, currency, proof_url)
      VALUES (
        ${card_id},
        ${String(b.title ?? '').slice(0, 200)},
        ${String(b.description ?? '').slice(0, 500)},
        ${['travel','dining','shopping','entertainment','wellness','fuel','insurance','other'].includes(b.category) ? b.category : 'other'},
        ${['monthly','quarterly','annual','one-time','ongoing'].includes(b.frequency) ? b.frequency : 'annual'},
        ${Number(b.value_usd) || 0},
        ${['credit','reward_rate','perk','insurance'].includes(b.benefit_type) ? b.benefit_type : 'perk'},
        ${b.currency === 'INR' ? 'INR' : 'USD'},
        ${null}
      )
    `;
  }

  return json({ success: true, count: benefits.length });
}
