'use client';

import { CircuitBoard, Cpu, Layers3, Radar, Search, SearchX, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { ShopHeader } from '../../shared/shop-header';
import { CartPanel } from '../cart/cart-panel';
import { useCart } from '../cart/use-cart';
import { CatalogHero } from './catalog-hero';
import type { Category, Product } from './model';
import { ProductCard } from './product-card';

const categoryIcons = {
  controllers: Cpu,
  sensors: Radar,
  modules: CircuitBoard,
};

const productCount = new Intl.PluralRules('ru');

function productCountLabel(count: number) {
  switch (productCount.select(count)) {
    case 'one': return `${count} товар`;
    case 'few': return `${count} товара`;
    default: return `${count} товаров`;
  }
}

export function Storefront({ categories, products }: {
  categories: Category[];
  products: Product[];
}) {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const searchField = useRef<HTMLInputElement>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const cart = useCart(products);
  const categoryNames = new Map(categories.map((item) => [item.slug, item.name]));
  const filters = [{ slug: '', name: 'Все товары' }, ...categories];
  const query = search.trim().toLocaleLowerCase('ru-RU');
  const visibleProducts = products.filter((product) => {
    const name = categoryNames.get(product.category) ?? '';
    const searchable = `${product.name} ${product.description} ${name}`.toLocaleLowerCase('ru-RU');
    return (!category || product.category === category) && searchable.includes(query);
  });

  function addProduct(product: Product) {
    cart.changeQuantity(product, 1);
    setAnnouncement(`${product.name} добавлен в корзину`);
  }

  return (
    <>
      <ShopHeader cart={{ count: cart.count, open: cartOpen, onOpen: () => setCartOpen(true) }} />
      <main className="shell pt-5 pb-16 sm:pt-8">
        <CatalogHero />
        <CartPanel open={cartOpen} cart={cart} onClose={() => setCartOpen(false)} />
        <div className="sr-only" role="status">{announcement}</div>

        <section id="catalog" className="mt-9 scroll-mt-6 sm:mt-12" aria-labelledby="catalog-title">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="catalog-title" className="text-4xl font-extrabold tracking-[-0.055em] sm:text-[2.85rem]">
                Каталог
              </h2>
              <p className="mt-1 text-sm font-bold text-muted" aria-live="polite">
                {productCountLabel(visibleProducts.length)}
              </p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search size={19} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                className="field pr-12 pl-11 [&::-webkit-search-cancel-button]:appearance-none"
                ref={searchField}
                type="search"
                aria-label="Поиск по каталогу"
                placeholder="Поиск по каталогу"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="absolute top-1/2 right-1 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-muted transition-colors hover:bg-tint hover:text-cobalt active:bg-indigo-200"
                  aria-label="Очистить поиск"
                  onClick={() => {
                    setSearch('');
                    searchField.current?.focus();
                  }}
                >
                  <X size={18} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
          <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Категории">
            {filters.map((item) => {
              const Icon = categoryIcons[item.slug as keyof typeof categoryIcons] ?? Layers3;
              const selected = category === item.slug;
              return (
                <button
                  key={item.slug}
                  type="button"
                  className={`control ${selected ? 'control-selected' : 'control-secondary'}`}
                  aria-pressed={selected}
                  onClick={() => setCategory(item.slug)}
                >
                  <Icon size={17} aria-hidden="true" />
                  {item.name}
                </button>
              );
            })}
          </div>
          {visibleProducts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
              <SearchX className="mx-auto mb-3 text-cobalt" size={29} aria-hidden="true" />
              <p className="text-lg font-extrabold">Товары не найдены</p>
              {(query || category) && (
                <button
                  type="button"
                  className="control control-secondary mt-4"
                  onClick={() => {
                    setSearch('');
                    setCategory('');
                  }}
                >
                  Сбросить поиск и фильтры
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  category={categoryNames.get(product.category)}
                  quantity={cart.quantities[product.slug] ?? 0}
                  onAdd={() => addProduct(product)}
                  onOpenCart={() => setCartOpen(true)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
