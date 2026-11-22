import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { Database } from '../database/database.service';
import { isToken } from './auth.input';
import { MailService } from './mail.service';
import { hashPassword, verifyPassword } from './password';

const verificationLifetime = 30 * 60 * 1_000;
const sessionLifetime = 7 * 24 * 60 * 60 * 1_000;

function digest(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function newToken() {
  const token = randomBytes(32).toString('base64url');
  return { token, tokenHash: digest(token) };
}

function bearerToken(authorization: string | undefined) {
  const token = authorization?.match(/^Bearer (.+)$/i)?.[1];
  if (!isToken(token)) {
    throw new UnauthorizedException('UNAUTHENTICATED');
  }
  return token;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly database: Database,
    private readonly mail: MailService,
  ) {}

  async register(email: string, password: string) {
    const passwordHash = await hashPassword(password);
    // Only the password tied to a verified email link becomes an account credential.
    await this.database.user.createMany({
      data: [{ email, passwordHash }],
      skipDuplicates: true,
    });
    const user = await this.database.user.findUniqueOrThrow({
      where: { email },
      select: { id: true, verifiedAt: true },
    });

    if (user.verifiedAt) {
      return;
    }

    const { token, tokenHash } = newToken();
    const now = new Date();
    await this.database.$transaction([
      this.database.emailVerification.deleteMany({
        where: { userId: user.id, expiresAt: { lte: now } },
      }),
      this.database.emailVerification.create({
        data: {
          userId: user.id,
          tokenHash,
          passwordHash,
          expiresAt: new Date(now.getTime() + verificationLifetime),
        },
      }),
    ]);

    await this.mail.sendVerification(email, token);
  }

  async verifyEmail(token: string) {
    const tokenHash = digest(token);
    const now = new Date();
    await this.database.$transaction(async (transaction) => {
      const pending = await transaction.emailVerification.findUnique({
        where: { tokenHash, expiresAt: { gt: now } },
      });
      if (!pending) {
        throw new ConflictException('INVALID_VERIFICATION');
      }

      const verified = await transaction.user.updateMany({
        where: { id: pending.userId, verifiedAt: null },
        data: { verifiedAt: now, passwordHash: pending.passwordHash },
      });
      if (verified.count === 0) {
        throw new ConflictException('INVALID_VERIFICATION');
      }

      await transaction.emailVerification.deleteMany({ where: { userId: pending.userId } });
    });
  }

  async login(email: string, password: string) {
    const user = await this.database.user.findUnique({ where: { email } });
    const validPassword = await verifyPassword(password, user?.passwordHash);
    if (user === null || !validPassword) {
      throw new UnauthorizedException('INVALID_LOGIN');
    }
    if (!user.verifiedAt) {
      throw new ForbiddenException('EMAIL_UNVERIFIED');
    }

    const { token, tokenHash } = newToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + sessionLifetime);
    await this.database.$transaction([
      this.database.session.deleteMany({ where: { userId: user.id, expiresAt: { lte: now } } }),
      this.database.session.create({ data: { userId: user.id, tokenHash, expiresAt } }),
    ]);
    return { token, expiresAt };
  }

  async getUser(authorization: string | undefined) {
    const tokenHash = digest(bearerToken(authorization));
    const session = await this.database.session.findUnique({
      where: { tokenHash, expiresAt: { gt: new Date() } },
      select: { user: { select: { id: true, email: true } } },
    });
    if (!session) {
      throw new UnauthorizedException('UNAUTHENTICATED');
    }
    return session.user;
  }

  async logout(authorization: string | undefined) {
    const tokenHash = digest(bearerToken(authorization));
    await this.database.session.deleteMany({ where: { tokenHash } });
  }
}
