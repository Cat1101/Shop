import Link from 'next/link';
import { formatPrice } from '../../shared/money';
import type { Cart } from './use-cart';

export function CartPanel({ open, cart }: { open: boolean; cart: Cart }) {
  return (
    <section id="cart" className="cart-panel" hidden={!open} aria-labelledby="cart-title">
      <h2 id="cart-title">Корзина</h2>
      {cart.lines.length === 0 ? (
        <p>Корзина пока пуста.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.lines.map(({ product, quantity }) => (
              <li key={product.slug}>
                <span>{product.name}</span>
                <div className="quantity">
                  <button
                    onClick={() => cart.changeQuantity(product, -1)}
                    aria-label={`Убрать одну единицу ${product.name}`}
                  >−</button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => cart.changeQuantity(product, 1)}
                    disabled={quantity >= Math.min(product.stock, 100)}
                    aria-label={`Добавить одну единицу ${product.name}`}
                  >+</button>
                </div>
              </li>
            ))}
          </ul>
          <p className="total">
            <strong>Итого {formatPrice(cart.totalKopecks)}</strong>
            <Link className="primary" href="/checkout">Оформить заказ</Link>
          </p>
        </>
      )}
    </section>
  );
}
