import type { Session } from '@/types/session';

const SESSION_KEY = 'cms_session';

export function setSession(expiresAt: string): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ expiresAt }));
}

export function getSession(): Session | null {
  const item = localStorage.getItem(SESSION_KEY);
  if (!item) return null;

  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
}

export function isSessionValid(): boolean {
  const session = getSession();
  if (!session) return false;

  return new Date(session.expiresAt) > new Date();
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
