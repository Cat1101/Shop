import { cookies } from 'next/headers';
import { apiRequest, authorization } from '../../shared/api';

const cookieName = 'microshop-session';

export async function readSession() {
  return (await cookies()).get(cookieName)?.value;
}

export async function writeSession(token: string, expiresAt: string) {
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.AUTH_COOKIE_SECURE !== 'false',
    expires: new Date(expiresAt),
    path: '/',
  });
}

export async function removeSession() {
  (await cookies()).delete(cookieName);
}

export async function getViewer(): Promise<{ email: string } | null> {
  const token = await readSession();
  if (!token) {
    return null;
  }

  const response = await apiRequest('/auth/me', { headers: authorization(token) });
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Account service is unavailable');
  }
  return response.json();
}
