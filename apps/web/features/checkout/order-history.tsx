import { formatPrice } from '../../shared/money';
import type { Order } from './orders';

const formatDate = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' });

export function OrderHistory({ orders }: { orders: Order[] }) {
  return (
    <section className="detail-card">
      <h2>Заказы</h2>
      {orders.length === 0 ? <p>Здесь появятся оформленные заказы.</p> : (
        <ul className="order-history">
          {orders.map((order) => (
            <li key={order.id}>
              <h3>Заказ от {formatDate.format(new Date(order.createdAt))}</h3>
              <p className="order-id">{order.id}</p>
              <p>Принят · Самовывоз · Оплата при получении</p>
              <ul className="cart-list">
                {order.items.map((item) => (
                  <li key={item.productId}>
                    <span>{item.productName} × {item.quantity}</span>
                    <span>{formatPrice(item.priceKopecks * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <p><strong>Итого {formatPrice(order.totalKopecks)}</strong></p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
