import { BadRequestException } from '@nestjs/common';

const slugPattern = /^[a-z0-9-]{1,80}$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseItems(value: unknown) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 50) {
    throw new BadRequestException('INVALID_ORDER_ITEMS');
  }
  const items = new Map<string, number>();

  for (const item of value) {
    if (typeof item !== 'object' || item === null) {
      throw new BadRequestException('INVALID_ORDER_ITEMS');
    }
    const { slug, quantity } = item as Record<string, unknown>;
    if (
      typeof slug !== 'string' || !slugPattern.test(slug) || items.has(slug) ||
      typeof quantity !== 'number' || !Number.isInteger(quantity) ||
      quantity < 1 || quantity > 100
    ) {
      throw new BadRequestException('INVALID_ORDER_ITEMS');
    }
    items.set(slug, quantity);
  }
  return items;
}

export function readOrder(body: unknown) {
  if (typeof body !== 'object' || body === null) {
    throw new BadRequestException('INVALID_ORDER');
  }

  const { requestId, name, phone, items } = body as Record<string, unknown>;
  const customerName = typeof name === 'string' ? name.trim() : '';
  const contactPhone = typeof phone === 'string' ? phone.trim() : '';
  const digits = contactPhone.replace(/\D/g, '');

  if (
    typeof requestId !== 'string' || !uuidPattern.test(requestId) ||
    customerName.length < 2 || customerName.length > 100 ||
    !/^\+?[\d ().-]+$/.test(contactPhone) || contactPhone.length > 32 ||
    digits.length < 7 || digits.length > 15
  ) {
    throw new BadRequestException('INVALID_ORDER');
  }

  return { requestId, customerName, phone: contactPhone, items: parseItems(items) };
}

export type OrderInput = ReturnType<typeof readOrder>;
