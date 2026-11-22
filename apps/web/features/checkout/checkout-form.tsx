'use client';

import { CircleCheck, MapPin, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useRef, useState } from 'react';
import { formatPrice } from '../../shared/money';
import { SubmitButton } from '../../shared/submit-button';
import { useCart } from '../cart/use-cart';
import type { Product } from '../catalog/model';
import { placeOrder } from './actions';

export function CheckoutForm({ products, requestId }: {
  products: Product[];
  requestId: string;
}) {
  const { lines, totalKopecks, removePurchased } = useCart(products);
  const [state, action] = useActionState(placeOrder, {});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const completedOrder = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (state.order && state.purchased && completedOrder.current !== state.order.id) {
      completedOrder.current = state.order.id;
      removePurchased(state.purchased);
    }
  }, [state, removePurchased]);

  if (state.order) {
    return (
      <section className="detail-card max-w-2xl border-t-4 border-t-cobalt">
        <CircleCheck size={32} className="mb-4 text-cobalt" aria-hidden="true" />
        <div role="status">
          <h1 className="text-3xl font-extrabold tracking-tight">Заказ принят</h1>
        </div>
        <p className="mt-3 text-sm break-all text-muted">Номер заказа: {state.order.id}</p>
        <p className="mt-2">К оплате при самовывозе: <strong>{formatPrice(state.order.totalKopecks)}</strong></p>
        <Link className="control control-primary mt-6" href="/account">История заказов</Link>
      </section>
    );
  }
  if (lines.length === 0) {
    return (
      <section className="detail-card max-w-2xl">
        <ShoppingBag size={28} className="mb-4 text-cobalt" aria-hidden="true" />
        <h1 className="text-3xl font-extrabold tracking-tight">Оформление заказа</h1>
        <p className="mt-3 text-muted">Корзина пока пуста.</p>
        <Link className="control control-primary mt-6" href="/#catalog">Выбрать товары</Link>
      </section>
    );
  }

  const items = lines.map(({ product, quantity }) => ({ slug: product.slug, quantity }));
  return (
    <>
      <h1 className="mb-5 text-3xl font-extrabold tracking-[-0.05em] sm:text-4xl">Оформление заказа</h1>
      <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:gap-5">
        <section className="detail-card">
          <h2 className="mb-5 text-xl font-extrabold">Контактные данные</h2>
          <form className="grid gap-4" action={action}>
            <input type="hidden" name="requestId" value={requestId} />
            <input type="hidden" name="items" value={JSON.stringify(items)} />
            <label className="grid gap-1.5 text-sm font-extrabold">
              Имя
              <input
                className="field font-medium"
                name="name"
                autoComplete="name"
                minLength={2}
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5 text-sm font-extrabold">
              Телефон
              <input
                className="field font-medium"
                type="tel"
                name="phone"
                autoComplete="tel"
                maxLength={32}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </label>
            <SubmitButton pendingText="Оформляем заказ…" fullWidth>Подтвердить заказ</SubmitButton>
            {state.error && <p className="form-error" role="alert">{state.error}</p>}
          </form>
        </section>
        <section className="detail-card">
          <h2 className="text-xl font-extrabold">Ваш заказ</h2>
          <ul className="my-3 divide-y divide-line">
            {lines.map(({ product, quantity }) => (
              <li key={product.slug} className="flex justify-between gap-3 py-3 text-sm">
                <span>{product.name} × {quantity}</span>
                <strong className="shrink-0 tabular-nums">{formatPrice(product.priceKopecks * quantity)}</strong>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
            <span className="font-bold">Итого</span>
            <strong className="text-2xl font-extrabold tabular-nums">{formatPrice(totalKopecks)}</strong>
          </div>
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-tint p-3 text-sm font-bold">
            <MapPin className="shrink-0 text-cobalt" size={19} aria-hidden="true" />
            Самовывоз и оплата при получении
          </p>
        </section>
      </div>
    </>
  );
}
