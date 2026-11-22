'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Category, Product } from './catalog';

type Cart = Record<string, number>;

const storageKey = 'microshop-cart';
const rubles = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 0,
});

function formatPrice(kopecks: number) {
  return rubles.format(kopecks / 100);
}

function readCart(products: Product[]): Cart {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
    return Object.fromEntries(
      products.flatMap((product) => {
        const quantity = saved?.[product.slug];
        if (!Number.isSafeInteger(quantity) || quantity <= 0 || product.stock === 0) {
          return [];
        }
        return [[product.slug, Math.min(quantity, product.stock)]];
      }),
    );
  } catch {
    return {};
  }
}

export function Storefront({ categories, products }: {
  categories: Category[];
  products: Product[];
}) {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<Cart>({});
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setCart(readCart(products));
  }, [products]);

  function changeQuantity(product: Product, amount: number) {
    const quantity = Math.max(0, Math.min((cart[product.slug] ?? 0) + amount, product.stock));
    const updatedCart = { ...cart };
    if (quantity === 0) {
      delete updatedCart[product.slug];
    } else {
      updatedCart[product.slug] = quantity;
    }
    setCart(updatedCart);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedCart));
    } catch {
      // The cart remains usable for the current page when storage is unavailable.
    }
  }

  const query = search.trim().toLowerCase();
  const categoryNames = new Map(categories.map((item) => [item.slug, item.name]));
  const visibleProducts = products.filter((product) =>
    (!category || product.category === category) &&
    `${product.name} ${product.description}`.toLowerCase().includes(query),
  );
  const cartProducts = products.filter((product) => cart[product.slug] > 0);
  const cartCount = cartProducts.reduce((sum, product) => sum + cart[product.slug], 0);
  const total = cartProducts.reduce(
    (sum, product) => sum + cart[product.slug] * product.priceKopecks, 0,
  );

  return (
    <>
      <header className="topbar">
        <div className="shell topbar-content">
          <a className="wordmark" href="/" aria-label="MicroShop, главная">
            <span className="brand-mark" aria-hidden="true">µ</span> MicroShop
          </a>
          <nav className="header-actions" aria-label="Магазин">
            <Link className="text-link" href="/account">Аккаунт</Link>
            <button
              className="cart-toggle"
              aria-controls="cart"
              aria-expanded={cartOpen}
              onClick={() => setCartOpen(!cartOpen)}
            >
              Корзина <span>{cartCount}</span>
            </button>
          </nav>
        </div>
      </header>
      <main className="shell">
        <section className="hero">
          <h1>Компоненты<br />для электроники</h1>
          <p>Микроконтроллеры, датчики и модули для ваших проектов.</p>
        </section>

        <section id="cart" className="cart-panel" hidden={!cartOpen} aria-labelledby="cart-title">
          <h2 id="cart-title">Корзина</h2>
          {cartProducts.length === 0 ? (
            <p>Корзина пока пуста.</p>
          ) : (
            <>
              <ul className="cart-list">
                {cartProducts.map((product) => (
                  <li key={product.slug}>
                    <span>{product.name}</span>
                    <div className="quantity">
                      <button onClick={() => changeQuantity(product, -1)}
                        aria-label={`Убрать одну единицу ${product.name}`}>−</button>
                      <span>{cart[product.slug]}</span>
                      <button onClick={() => changeQuantity(product, 1)}
                        disabled={cart[product.slug] >= product.stock}
                        aria-label={`Добавить одну единицу ${product.name}`}>+</button>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="total">Итого <strong>{formatPrice(total)}</strong></p>
            </>
          )}
        </section>

        <section className="catalog" aria-labelledby="catalog-title">
          <div className="catalog-heading">
            <h2 id="catalog-title">Каталог</h2>
            <input type="search" aria-label="Поиск по каталогу" placeholder="Поиск по каталогу"
              value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <div className="filters" role="group" aria-label="Категории">
            <button aria-pressed={!category} onClick={() => setCategory('')}>Все товары</button>
            {categories.map((item) => (
              <button key={item.slug} aria-pressed={category === item.slug}
                onClick={() => setCategory(item.slug)}>{item.name}</button>
            ))}
          </div>
          {visibleProducts.length === 0 && <p role="status">Товары не найдены.</p>}
          <div className="product-grid">
            {visibleProducts.map((product) => (
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
                  <button className="primary" onClick={() => changeQuantity(product, 1)}
                    disabled={(cart[product.slug] ?? 0) >= product.stock}
                    aria-label={`Добавить ${product.name} в корзину`}>
                    {product.stock > 0 && cart[product.slug] === product.stock ? 'В корзине' : 'В корзину'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
