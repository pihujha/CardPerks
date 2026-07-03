import { SignJWT, jwtVerify } from 'jose';

const COOKIE = 'cardperks-auth';
const ALG    = 'HS256';
const TTL    = 60 * 60 * 24 * 7; // 7 days in seconds

function secret() {
  const key = process.env.JWT_SECRET || 'qwertyuioplkjhgfdsazxcvbnmlkjhgfdsaqwertyuioplkjhgfdsazxcvbnm';
  return new TextEncoder().encode(key);
}

// ─── Password (Web Crypto PBKDF2 — no npm package needed) ───

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key  = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100_000 }, key, 256
  );
  return btoa(JSON.stringify({
    h: Array.from(new Uint8Array(bits)),
    s: Array.from(salt),
  }));
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const { h, s } = JSON.parse(atob(stored));
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
    );
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt: new Uint8Array(s), iterations: 100_000 }, key, 256
    );
    const hash = Array.from(new Uint8Array(bits));
    return hash.length === h.length && hash.every((b, i) => b === h[i]);
  } catch { return false; }
}

// ─── JWT ─────────────────────────────────────────────────────

export interface JWTPayload {
  sub: string;
  name: string;
  email: string;
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ name: payload.name, email: payload.email })
    .setProtectedHeader({ alg: ALG })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${TTL}s`)
    .sign(secret());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      sub:   payload.sub as string,
      name:  payload['name'] as string,
      email: payload['email'] as string,
    };
  } catch { return null; }
}

// ─── Cookie helpers ───────────────────────────────────────────

export function authCookieHeader(token: string) {
  return `${COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${TTL}`;
}

export function clearCookieHeader() {
  return `${COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

export function getTokenFromRequest(req: Request | any): string | null {
  let raw: string;
  if (typeof req.headers?.get === 'function') {
    raw = req.headers.get('cookie') ?? '';
  } else {
    const h = req.headers?.cookie;
    raw = Array.isArray(h) ? h[0] : (h ?? '');
  }
  const match = raw.match(new RegExp(`${COOKIE}=([^;]+)`));
  return match?.[1] ?? null;
}
