'use client';

import Link from 'next/link';
import { useActionState, useEffect, useRef, useState } from 'react';
import { formatPrice } from '../../shared/money';
import { useCart } from '../cart/use-cart';
import type { Product } from '../catalog/model';
import { placeOrder } from './actions';

export function CheckoutForm({ products, requestId }: {
  products: Product[];
  requestId: string;
}) {
  const { lines, totalKopecks, removePurchased } = useCart(products);
  const [state, action, pending] = useActionState(placeOrder, {});
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
      <>
        <h1>Заказ принят</h1>
        <p className="order-id">Номер заказа: {state.order.id}</p>
        <p>К оплате при самовывозе: <strong>{formatPrice(state.order.totalKopecks)}</strong></p>
        <Link className="text-link" href="/account">История заказов</Link>
      </>
    );
  }
  if (lines.length === 0) {
    return <><h1>Оформление заказа</h1><p>Корзина пока пуста.</p></>;
  }

  const items = lines.map(({ product, quantity }) => ({ slug: product.slug, quantity }));
  return (
    <>
      <h1>Оформление заказа</h1>
      <p>Самовывоз и оплата при получении.</p>
      <ul className="cart-list">
        {lines.map(({ product, quantity }) => (
          <li key={product.slug}>
            <span>{product.name} × {quantity}</span>
            <span>{formatPrice(product.priceKopecks * quantity)}</span>
          </li>
        ))}
      </ul>
      <p>Итого: <strong>{formatPrice(totalKopecks)}</strong></p>
      <form className="details-form" action={action}>
        <input type="hidden" name="requestId" value={requestId} />
        <input type="hidden" name="items" value={JSON.stringify(items)} />
        <label>
          Имя
          <input
            name="name"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        <label>
          Телефон
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            maxLength={32}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </label>
        <button className="primary" disabled={pending}>Подтвердить заказ</button>
        {state.error && <p className="form-error" role="alert">{state.error}</p>}
      </form>
    </>
  );
}
