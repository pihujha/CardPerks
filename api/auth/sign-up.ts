import { getDb, json } from '../_helpers';
import { hashPassword, createToken, authCookieHeader } from '../_auth-utils';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const body = await req.json() as { name?: string; email?: string; password?: string };
    const { name, email, password } = body;

    if (!name || !email || !password || password.length < 8) {
      return json({ error: 'Invalid input — name, email, and a password of at least 8 characters are required.' }, 400);
    }

    const sql = getDb();

    const existing = await sql`SELECT id FROM "user" WHERE email = ${email} LIMIT 1`;
    if (existing.length > 0) return json({ error: 'Email already in use' }, 409);

    const hashed = await hashPassword(password);
    const id     = crypto.randomUUID();

    await sql`
      INSERT INTO "user" (id, name, email, password, "createdAt", "updatedAt")
      VALUES (${id}, ${name}, ${email}, ${hashed}, NOW(), NOW())
    `;

    const token = await createToken({ sub: id, name, email });

    return new Response(JSON.stringify({ user: { id, name, email } }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', 'Set-Cookie': authCookieHeader(token) },
    });
  } catch (err) {
    console.error('[sign-up]', err);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
}
