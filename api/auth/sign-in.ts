import { getDb, json } from '../_helpers';
import { verifyPassword, createToken, authCookieHeader } from '../_auth-utils';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const body  = await req.json() as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) return json({ error: 'Email and password are required.' }, 400);

    const sql  = getDb();
    const rows = await sql`
      SELECT id, name, email, password FROM "user" WHERE email = ${email} LIMIT 1
    `;

    if (rows.length === 0) return json({ error: 'Invalid email or password' }, 401);

    const user  = rows[0];
    const valid = await verifyPassword(password, user.password as string);
    if (!valid) return json({ error: 'Invalid email or password' }, 401);

    const token = await createToken({
      sub:   user.id    as string,
      name:  user.name  as string,
      email: user.email as string,
    });

    return new Response(JSON.stringify({ user: { id: user.id, name: user.name, email: user.email } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Set-Cookie': authCookieHeader(token) },
    });
  } catch (err) {
    console.error('[sign-in]', err);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
}
