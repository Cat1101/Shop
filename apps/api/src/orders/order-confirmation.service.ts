import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MailService } from '../auth/mail.service';
import { Database } from '../database/database.service';

const maxAttempts = 5;
const pollInterval = 2_000;
const leaseDuration = 60_000;
const priceFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

@Injectable()
export class OrderConfirmationService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderConfirmationService.name);
  private timer?: NodeJS.Timeout;
  private active?: Promise<void>;

  constructor(
    private readonly database: Database,
    private readonly mail: MailService,
  ) {}

  onModuleInit() {
    this.timer = setInterval(() => {
      if (!this.active) {
        this.active = this.deliverNext()
          .catch(() => this.logger.error('Could not process order confirmations'))
          .finally(() => { this.active = undefined; });
      }
    }, pollInterval);
    this.timer.unref();
  }

  async onModuleDestroy() {
    clearInterval(this.timer);
    await this.active;
  }

  private async deliverNext() {
    const now = new Date();
    const due = { sentAt: null, nextAttemptAt: { lte: now }, attempts: { lt: maxAttempts } };
    const job = await this.database.orderConfirmation.findFirst({
      where: due,
      orderBy: { nextAttemptAt: 'asc' },
      include: { order: { include: { items: { orderBy: { productId: 'asc' } } } } },
    });
    if (!job) {
      return;
    }

    const claim = await this.database.orderConfirmation.updateMany({
      where: { ...due, orderId: job.orderId },
      data: { attempts: { increment: 1 }, nextAttemptAt: new Date(now.getTime() + leaseDuration) },
    });
    if (claim.count === 0) {
      return;
    }

    const { order, orderId, email } = job;
    const attempt = job.attempts + 1;
    const lines = order.items.map((item) =>
      `${item.productName} × ${item.quantity} — ${priceFormat.format(item.priceKopecks * item.quantity / 100)}`,
    );
    const message = [
      `Заказ ${orderId} принят.`,
      '',
      ...lines,
      '',
      `К оплате при получении: ${priceFormat.format(order.totalKopecks / 100)}.`,
      'Способ получения — самовывоз.',
    ].join('\n');
    const where = { orderId, attempts: attempt, sentAt: null };

    try {
      await this.mail.sendOrderConfirmation(email, orderId, message);
    } catch {
      const delay = 5_000 * 2 ** (attempt - 1);
      await this.database.orderConfirmation.updateMany({
        where,
        data: { nextAttemptAt: new Date(Date.now() + delay) },
      });
      this.logger.warn(`Order confirmation attempt ${attempt} failed`);
      return;
    }

    await this.database.orderConfirmation.updateMany({ where, data: { sentAt: new Date() } });
  }
}
