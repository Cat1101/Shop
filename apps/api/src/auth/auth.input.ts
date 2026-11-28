import { BadRequestException } from '@nestjs/common';

export function normalizeEmail(value: unknown): string | null {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : '';
  const valid = email.length <= 254 && /^[^\s@<>(),;:"]+@[^\s@<>(),;:"]+\.[^\s@<>(),;:"]+$/.test(email);
  return valid ? email : null;
}

export function readCredentials(body: unknown) {
  if (typeof body !== 'object' || body === null) {
    throw new BadRequestException('INVALID_CREDENTIALS');
  }

  const { email, password } = body as Record<string, unknown>;
  const normalizedEmail = normalizeEmail(email);
  if (
    normalizedEmail === null ||
    typeof password !== 'string' ||
    password.length < 8 ||
    password.length > 128
  ) {
    throw new BadRequestException('INVALID_CREDENTIALS');
  }

  return { email: normalizedEmail, password };
}

export function isToken(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{43}$/.test(value);
}
