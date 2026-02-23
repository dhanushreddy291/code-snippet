import { cookies } from 'next/headers';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

const SESSION_COOKIE_NAME = 'session_id';
const SESSION_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export async function setSessionCookie(userId: string): Promise<string> {
  const sessionId = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('hex');
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: '/',
  });

  return sessionId;
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }

  // In a real app, you'd store session data in a sessions table
  // For now, we'll parse the session from the client request
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, sessionId.substring(0, 36)), // This is simplified
    });
    return user || null;
  } catch {
    return null;
  }
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
