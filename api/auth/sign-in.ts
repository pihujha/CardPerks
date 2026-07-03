import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_helpers';
import { verifyPassword, createToken, authCookieHeader } from '../_auth-utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body as { email: string; password: string };

  const sql  = getDb();
  const rows = await sql`
    SELECT id, name, email, password FROM "user" WHERE email = ${email} LIMIT 1
  `;

  if (rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

  const user  = rows[0];
  const valid = await verifyPassword(password, user.password as string);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

  const token = await createToken({
    sub:   user.id    as string,
    name:  user.name  as string,
    email: user.email as string,
  });

  res.setHeader('Set-Cookie', authCookieHeader(token));
  return res.status(200).json({ user: { id: user.id, name: user.name, email: user.email } });
}
