import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken, getTokenFromRequest } from '../_auth-utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(200).json({ user: null });

    const payload = await verifyToken(token);
    if (!payload) return res.status(200).json({ user: null });

    return res.status(200).json({ user: { id: payload.sub, name: payload.name, email: payload.email } });
  } catch (err) {
    console.error('[me]', err);
    return res.status(200).json({ user: null });
  }
}
