import { Package } from 'lucide-react';
import { formatPrice } from '../../shared/money';
import type { Order } from './orders';

const formatDate = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' });

export function OrderHistory({ orders }: { orders: Order[] }) {
  return (
    <section className="detail-card mt-4">
      <h2 className="text-xl font-extrabold">Заказы</h2>
      {orders.length === 0 ? (
        <p className="mt-3 flex items-center gap-2 text-muted">
          <Package size={18} aria-hidden="true" />
          Здесь появятся оформленные заказы.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-line">
          {orders.map((order) => (
            <li key={order.id} className="py-4 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-extrabold">Заказ от {formatDate.format(new Date(order.createdAt))}</h3>
                <p className="rounded-md bg-tint px-2.5 py-1 text-xs font-extrabold text-accent-pressed">Принят</p>
              </div>
              <p className="mt-1 font-mono text-xs break-all text-muted">{order.id}</p>
              <p className="mt-2 text-sm text-muted">Самовывоз · Оплата при получении</p>
              <ul className="mt-3 divide-y divide-line rounded-lg border border-line bg-paper px-3">
                {order.items.map((item) => (
                  <li key={item.productId} className="flex justify-between gap-3 py-2.5 text-sm">
                    <span>{item.productName} × {item.quantity}</span>
                    <span className="shrink-0 font-bold tabular-nums">
                      {formatPrice(item.priceKopecks * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-right font-extrabold">Итого {formatPrice(order.totalKopecks)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
