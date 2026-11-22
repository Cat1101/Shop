'use client';

import Link from 'next/link';
import { useState } from 'react';
import { formatPrice } from '../../shared/money';
import { CartPanel } from '../cart/cart-panel';
import { useCart } from '../cart/use-cart';
import type { Category, Product } from './model';

export function Storefront({ categories, products }: {
  categories: Category[];
  products: Product[];
}) {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useCart(products);

  const query = search.trim().toLowerCase();
  const categoryNames = new Map(categories.map((item) => [item.slug, item.name]));
  const visibleProducts = products.filter((product) =>
    (!category || product.category === category) &&
    `${product.name} ${product.description}`.toLowerCase().includes(query),
  );

  return (
    <>
      <header className="topbar">
        <div className="shell topbar-content">
          <Link className="wordmark" href="/" aria-label="MicroShop, главная">
            <span className="brand-mark" aria-hidden="true">µ</span> MicroShop
          </Link>
          <nav className="header-actions" aria-label="Магазин">
            <Link className="text-link" href="/account">Аккаунт</Link>
            <button
              className="cart-toggle"
              aria-controls="cart"
              aria-expanded={cartOpen}
              onClick={() => setCartOpen(!cartOpen)}
            >
              Корзина <span>{cart.count}</span>
            </button>
          </nav>
        </div>
      </header>
      <main className="shell">
        <section className="hero">
          <h1>Компоненты<br />для электроники</h1>
          <p>Микроконтроллеры, датчики и модули для ваших проектов.</p>
        </section>

        <CartPanel open={cartOpen} cart={cart} />

        <section className="catalog" aria-labelledby="catalog-title">
          <div className="catalog-heading">
            <h2 id="catalog-title">Каталог</h2>
            <input
              type="search"
              aria-label="Поиск по каталогу"
              placeholder="Поиск по каталогу"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="filters" role="group" aria-label="Категории">
            <button aria-pressed={!category} onClick={() => setCategory('')}>Все товары</button>
            {categories.map((item) => (
              <button
                key={item.slug}
                aria-pressed={category === item.slug}
                onClick={() => setCategory(item.slug)}
              >
                {item.name}
              </button>
            ))}
          </div>
          {visibleProducts.length === 0 && <p role="status">Товары не найдены.</p>}
          <div className="product-grid">
            {visibleProducts.map((product) => {
              const quantity = cart.quantities[product.slug] ?? 0;
              const atLimit = quantity >= Math.min(product.stock, 100);
              return (
                <article className="product" key={product.slug}>
                  <p className="category">{categoryNames.get(product.category)}</p>
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  <div className="product-footer">
                    <div>
                      <strong>{formatPrice(product.priceKopecks)}</strong>
                      <p className="stock">
                        {product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Нет в наличии'}
                      </p>
                    </div>
                    <button
                      className="primary"
                      onClick={() => cart.changeQuantity(product, 1)}
                      disabled={atLimit}
                      aria-label={`Добавить ${product.name} в корзину`}
                    >
                      {product.stock > 0 && atLimit ? 'В корзине' : 'В корзину'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
