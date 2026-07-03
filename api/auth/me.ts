import { json } from '../_helpers';
import { verifyToken, getTokenFromRequest } from '../_auth-utils';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return json({ user: null });

    const payload = await verifyToken(token);
    if (!payload) return json({ user: null });

    return json({ user: { id: payload.sub, name: payload.name, email: payload.email } });
  } catch {
    return json({ user: null });
  }
}
