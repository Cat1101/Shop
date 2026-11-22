'use server';

import { redirect } from 'next/navigation';
import { readSession } from '../account/session';
import { apiRequest, jsonRequest } from '../../shared/api';
import type { Order } from './orders';

type PurchasedItem = { slug: string; quantity: number };

export interface CheckoutState {
  error?: string;
  order?: Order;
  purchased?: PurchasedItem[];
}

export async function placeOrder(
  _state: CheckoutState,
  form: FormData,
): Promise<CheckoutState> {
  const token = await readSession();
  if (!token) {
    redirect('/account?next=checkout');
  }

  let items: PurchasedItem[];
  try {
    items = JSON.parse(String(form.get('items')));
  } catch {
    return { error: 'Проверьте содержимое корзины.' };
  }

  const response = await apiRequest('/orders', jsonRequest({
    requestId: form.get('requestId'),
    name: form.get('name'),
    phone: form.get('phone'),
    items,
  }, token)).catch(() => null);

  if (response?.status === 401) {
    redirect('/account?next=checkout');
  }
  if (response?.status === 400) {
    return { error: 'Проверьте имя, телефон и содержимое корзины.' };
  }
  if (response?.status === 409) {
    const error: { message: string } = await response.json();
    return {
      error: error.message === 'STOCK_CHANGED'
        ? 'Остатки изменились. Вернитесь в каталог и проверьте корзину.'
        : 'Сумма заказа превышает лимит. Уменьшите количество товаров.',
    };
  }
  if (!response?.ok) {
    return { error: 'Заказ пока не удалось оформить. Повторите попытку.' };
  }

  const order: Order = await response.json();
  return { order, purchased: items };
}
