import { ConflictException, Injectable } from '@nestjs/common';
import { Database } from '../database/database.service';
import { Prisma } from '../generated/prisma/client';
import type { OrderInput } from './order.input';

type OrderOwner = { userId: number } | { guestKey: string; email: string };

const publicOrder = {
  id: true,
  status: true,
  totalKopecks: true,
  createdAt: true,
  items: {
    orderBy: { productId: 'asc' },
    select: {
      productId: true,
      productName: true,
      priceKopecks: true,
      quantity: true,
      product: { select: { slug: true } },
    },
  },
} satisfies Prisma.OrderSelect;

@Injectable()
export class OrdersService {
  constructor(private readonly database: Database) {}

  list(userId: number) {
    return this.database.order.findMany({
      where: { userId },
      select: publicOrder,
      orderBy: { createdAt: 'desc' },
    });
  }

  async place(owner: OrderOwner, input: OrderInput) {
    const { requestId } = input;
    const where = 'userId' in owner
      ? { userId_requestId: { userId: owner.userId, requestId } }
      : { guestKey_requestId: { guestKey: owner.guestKey, requestId } };
    const existing = await this.database.order.findUnique({ where, select: publicOrder });
    if (existing) {
      return existing;
    }

    try {
      return await this.database.$transaction((transaction) =>
        this.placeWithinTransaction(transaction, owner, input),
      );
    } catch (error) {
      // A concurrent retry may have placed this order while this transaction waited.
      if (error instanceof ConflictException ||
          (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')) {
        const retried = await this.database.order.findUnique({ where, select: publicOrder });
        if (retried) {
          return retried;
        }
      }
      throw error;
    }
  }

  private async placeWithinTransaction(
    transaction: Prisma.TransactionClient,
    owner: OrderOwner,
    input: OrderInput,
  ) {
    const products = await transaction.product.findMany({
      where: { slug: { in: [...input.items.keys()] } },
      orderBy: { id: 'asc' },
    });
    if (products.length !== input.items.size) {
      throw new ConflictException('STOCK_CHANGED');
    }

    const items = products.map((product) => {
      const quantity = input.items.get(product.slug);
      if (quantity === undefined || quantity > product.stock) {
        throw new ConflictException('STOCK_CHANGED');
      }
      return {
        productId: product.id,
        productName: product.name,
        priceKopecks: product.priceKopecks,
        quantity,
      };
    });
    const totalKopecks = items.reduce(
      (sum, item) => sum + item.priceKopecks * item.quantity,
      0,
    );
    if (totalKopecks > 2_147_483_647) {
      throw new ConflictException('ORDER_TOTAL_LIMIT');
    }

    const order = await transaction.order.create({
      data: {
        ...('userId' in owner
          ? { userId: owner.userId }
          : { guestKey: owner.guestKey, confirmation: { create: { email: owner.email } } }),
        requestId: input.requestId,
        customerName: input.customerName,
        phone: input.phone,
        totalKopecks,
        items: { create: items },
      },
      select: publicOrder,
    });

    for (const item of items) {
      const updated = await transaction.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (updated.count !== 1) {
        throw new ConflictException('STOCK_CHANGED');
      }
    }

    return order;
  }
}
