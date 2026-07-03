import { neon } from '@neondatabase/serverless';
import { verifyToken, getTokenFromRequest } from './_auth-utils';

export function getDb() {
  return neon(process.env.DATABASE_URL!);
}

export async function getUserId(request: Request): Promise<string | null> {
  const token   = getTokenFromRequest(request);
  if (!token)   return null;
  const payload = await verifyToken(token);
  return payload?.sub ?? null;
}

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
