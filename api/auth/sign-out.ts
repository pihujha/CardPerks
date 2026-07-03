import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearCookieHeader } from '../_auth-utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Set-Cookie', clearCookieHeader());
  return res.status(200).json({ success: true });
}
