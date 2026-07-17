// Node.js runtime — pdf-parse requires Node, not edge
import type { VercelRequest, VercelResponse } from '@vercel/node';
import pdfParse from 'pdf-parse';

const LLM_URL = process.env.LLM_URL || 'http://localhost:8000';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { pdf } = req.body as { pdf: string };
    if (!pdf) return res.status(400).json({ error: 'No PDF data' });

    const buffer = Buffer.from(pdf, 'base64');
    const data   = await pdfParse(buffer);
    const text   = data.text;

    // Try LLM parser first (robust, format-agnostic)
    try {
      const llmRes = await fetch(`${LLM_URL}/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(60_000),
      });

      if (llmRes.ok) {
        const { transactions } = await llmRes.json() as {
          transactions: { description: string; amount: number }[];
        };
        if (transactions.length > 0) {
          return res.status(200).json({ transactions, source: 'llm' });
        }
      }
    } catch {
      // LLM parser not running or timed out — fall through to regex
    }

    // Regex fallback — handles two formats:
    //   1. Multi-line: "Card Purchase" trigger → next line is merchant → next is $amt$balance
    //   2. Single-line: date + merchant + $amt on one line
    const rows: { description: string; amount: number }[] = [];
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      if (/zelle payment|beginning balance|^date\s*desc/i.test(line) || line.includes('-$') || line.includes('$-')) {
        i++; continue;
      }

      if (/card purchase|recurring card purchase/i.test(line) && !line.includes('$')) {
        const descLine = lines[i + 1] ?? '';
        const amtLine  = lines[i + 2] ?? '';
        const desc = descLine
          .replace(/^\d{1,2}\/\d{1,2}\s+/, '')
          .replace(/\s+card\s+\d+\s*$/i, '')
          .trim();
        const m = amtLine.match(/\$([\d,]+\.\d{2})/);
        if (m && desc.length > 1) {
          const amount = parseFloat(m[1].replace(',', ''));
          if (amount >= 0.01) rows.push({ description: desc, amount });
        }
        i += 3; continue;
      }

      const m = line.match(/\$([\d,]+\.\d{2})/);
      if (m) {
        const amount = parseFloat(m[1].replace(',', ''));
        if (amount >= 0.01) {
          const desc = line
            .replace(/\d{1,2}\/\d{1,2}(\/\d{2,4})?/g, '')
            .replace(/\$[\d,]+\.\d{2}/g, '')
            .replace(/card purchase\s*/gi, '')
            .replace(/recurring card purchase\s*/gi, '')
            .trim();
          if (desc.length >= 2) rows.push({ description: desc, amount });
        }
      }
      i++;
    }

    res.status(200).json({ transactions: rows, source: 'regex' });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[parse-pdf]', e);
    res.status(500).json({ error: `Failed to parse PDF: ${msg}` });
  }
}
