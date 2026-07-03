import { createContext, useContext, useEffect, useState } from 'react';

interface User    { id: string; name: string; email: string }
interface Session { user: User }

interface AuthCtx {
  session:    Session | null;
  isPending:  boolean;
  setSession: (s: Session | null) => void;
}

const Ctx = createContext<AuthCtx>({ session: null, isPending: true, setSession: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session,   setSession]  = useState<Session | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setSession(d.user ? { user: d.user } : null); setIsPending(false); })
      .catch(() => setIsPending(false));
  }, []);

  return <Ctx.Provider value={{ session, isPending, setSession }}>{children}</Ctx.Provider>;
}

export function useSession() {
  const { session, isPending } = useContext(Ctx);
  return { data: session, isPending };
}

export function useSetSession() {
  return useContext(Ctx).setSession;
}

// ─── Auth API helpers called from Sign-in / Sign-up pages ────

export async function signUp(name: string, email: string, password: string) {
  const res = await fetch('/api/auth/sign-up', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Sign up failed');
  return data as { user: User };
}

export async function signIn(email: string, password: string) {
  const res = await fetch('/api/auth/sign-in', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Sign in failed');
  return data as { user: User };
}

export async function signOut() {
  await fetch('/api/auth/sign-out', { method: 'POST', credentials: 'include' });
}
