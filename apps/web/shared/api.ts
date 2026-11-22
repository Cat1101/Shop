export function apiRequest(path: string, options: RequestInit = {}) {
  const url = process.env.API_URL ?? 'http://localhost:3001/api';
  return fetch(`${url}${path}`, {
    ...options,
    cache: 'no-store',
    signal: AbortSignal.timeout(12_000),
  });
}

export function jsonRequest(body: unknown, token?: string): RequestInit {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authorization(token),
    },
    body: JSON.stringify(body),
  };
}

export function authorization(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}
