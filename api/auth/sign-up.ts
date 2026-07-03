import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_helpers';
import { hashPassword, createToken, authCookieHeader } from '../_auth-utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, password } = req.body as { name: string; email: string; password: string };

  if (!name || !email || !password || password.length < 8) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const sql = getDb();

  const existing = await sql`SELECT id FROM "user" WHERE email = ${email} LIMIT 1`;
  if (existing.length > 0) return res.status(409).json({ error: 'Email already in use' });

  const hashed = await hashPassword(password);
  const id     = crypto.randomUUID();

  await sql`
    INSERT INTO "user" (id, name, email, password, "createdAt", "updatedAt")
    VALUES (${id}, ${name}, ${email}, ${hashed}, NOW(), NOW())
  `;

  const token = await createToken({ sub: id, name, email });

  res.setHeader('Set-Cookie', authCookieHeader(token));
  return res.status(201).json({ user: { id, name, email } });
}
