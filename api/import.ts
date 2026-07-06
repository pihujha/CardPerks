import { getUserId, json } from './_helpers';

export const config = { runtime: 'edge' };

function buildPrompt(cardName: string, text: string): string {
  return `You are a credit card benefits data extraction assistant. Parse the following bank page text and extract all credit card benefits.

Return a JSON array where each object has these exact fields:
- "title": concise benefit name (e.g. "Uber Cash", "Airport Lounge Access", "5x on Travel")
- "description": 1-2 sentence explanation including any conditions or caps
- "category": exactly one of: travel, dining, shopping, entertainment, wellness, fuel, insurance, other
- "frequency": exactly one of: monthly, quarterly, annual, one-time, ongoing
- "value_usd": numeric value per period in the card's currency (0 for rates/multipliers with no fixed credit amount)
- "benefit_type": exactly one of: credit, reward_rate, perk, insurance
- "currency": "USD" for US cards, "INR" for Indian cards

Rules:
- Use "ongoing" for passive benefits that apply automatically (fuel surcharge waiver, base earn rates)
- Use "one-time" for welcome bonuses or lifetime benefits
- Use "monthly" only if the benefit resets every calendar month
- If a benefit says "$120 annual paid as $10/month", use value_usd=10 and frequency="monthly"
- For Indian cards, store the INR amount in value_usd and set currency="INR"
- Include earn rates (e.g. "3x on dining") as benefit_type="reward_rate" with value_usd=0
- Include insurance/coverage as benefit_type="insurance", category="insurance"
- Do NOT include terms and conditions, eligibility requirements, or marketing copy as benefits

Card name: ${cardName}

Bank page text:
${text}

Return ONLY a valid JSON array. No markdown, no explanation, no code fences.`;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const userId = await getUserId(req);
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  const body = await req.json() as { card_name?: string; text?: string };
  const { card_name, text } = body;
  if (!card_name || !text?.trim()) return json({ error: 'Missing card_name or text' }, 400);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json({ error: 'GEMINI_API_KEY not configured' }, 500);

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(card_name, text.slice(0, 15000)) }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!geminiRes.ok) {
    const err = await geminiRes.text();
    return json({ error: `Gemini API error: ${err}` }, 502);
  }

  const data = await geminiRes.json() as {
    candidates?: Array<{ content: { parts: Array<{ text: string }> } }>;
    error?: { message: string };
  };

  if (data.error) return json({ error: `Gemini error: ${data.error.message}` }, 502);

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) return json({ error: 'Empty response from Gemini' }, 502);

  let benefits: unknown[];
  try {
    benefits = JSON.parse(raw);
    if (!Array.isArray(benefits)) throw new Error('Response was not an array');
  } catch {
    return json({ error: 'Could not parse Gemini response as JSON', raw }, 502);
  }

  return json({ benefits });
}
