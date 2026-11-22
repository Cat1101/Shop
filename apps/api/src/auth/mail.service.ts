import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'localhost',
    port: Number(process.env.SMTP_PORT ?? 1025),
    connectionTimeout: 5_000,
    greetingTimeout: 5_000,
    socketTimeout: 8_000,
  });

  async sendVerification(email: string, token: string) {
    const link = new URL('/verify-email', process.env.WEB_ORIGIN ?? 'http://localhost:3000');
    link.searchParams.set('token', token);

    try {
      await this.transport.sendMail({
        from: process.env.MAIL_FROM ?? 'MicroShop <no-reply@microshop.test>',
        to: email,
        subject: 'Подтвердите электронную почту в MicroShop',
        text: `Откройте ссылку в течение 30 минут и подтвердите адрес:\n\n${link}`,
      });
    } catch {
      this.logger.error('Could not send a verification email');
      throw new ServiceUnavailableException('EMAIL_UNAVAILABLE');
    }
  }
}
