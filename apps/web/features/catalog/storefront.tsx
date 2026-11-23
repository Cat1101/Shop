'use client';

import { ChevronDown, SearchX } from 'lucide-react';
import { useState } from 'react';
import { ShopHeader } from '../../shared/shop-header';
import { CartPanel } from '../cart/cart-panel';
import { useCart } from '../cart/use-cart';
import { CatalogHero } from './catalog-hero';
import type { Category, Product } from './model';
import { ProductCard } from './product-card';

const productCount = new Intl.PluralRules('ru');

function productCountLabel(count: number) {
  const forms: Record<string, string> = { one: 'товар', few: 'товара' };
  return `${count} ${forms[productCount.select(count)] ?? 'товаров'}`;
}

export function Storefront({ categories, products }: { categories: Category[]; products: Product[] }) {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const cart = useCart(products);
  const categoryNames = new Map(categories.map((item) => [item.slug, item.name]));
  const query = search.trim().toLocaleLowerCase('ru-RU');
  const visibleProducts = products.filter((product) => {
    const name = categoryNames.get(product.category) ?? '';
    const searchable = `${product.name} ${product.description} ${name}`.toLocaleLowerCase('ru-RU');
    return (!category || product.category === category) && searchable.includes(query);
  });

  function browseCategory(slug: string) {
    setSearch('');
    setCategory(slug);
  }

  function addProduct(product: Product) {
    cart.changeQuantity(product, 1);
    setAnnouncement(`${product.name} добавлен в корзину`);
  }

  return (
    <>
      <ShopHeader cart={{ count: cart.count, open: cartOpen, onOpen: () => setCartOpen(true) }} />
      <main className="shell pb-16">
        <CatalogHero categories={categories} activeCategory={category} search={search}
          onSearch={setSearch} onCategory={browseCategory} />
        <CartPanel open={cartOpen} cart={cart} onClose={() => setCartOpen(false)} />
        <div className="sr-only" role="status">{announcement}</div>
        <section id="catalog" className="scroll-mt-4" aria-labelledby="catalog-title">
          <div className="catalog-toolbar">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h2 id="catalog-title" tabIndex={-1}>Каталог</h2>
              <span className="font-mono text-sm text-muted" aria-live="polite">{productCountLabel(visibleProducts.length)}</span>
            </div>
            <label className="category-select">
              <span className="sr-only">Категория</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="">Все категории</option>
                {categories.map(({ slug, name }) => <option key={slug} value={slug}>{name}</option>)}
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </label>
          </div>
          {visibleProducts.length === 0 ? (
            <div className="border border-line bg-white px-5 py-10 text-center">
              <SearchX className="mx-auto mb-3 text-muted" size={29} aria-hidden="true" />
              <p className="text-lg font-medium">Товары не найдены</p>
              <button type="button" className="control control-secondary mt-4" onClick={() => browseCategory('')}>
                Сбросить поиск и фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard key={product.slug} product={product} category={categoryNames.get(product.category)}
                  quantity={cart.quantities[product.slug] ?? 0} onAdd={() => addProduct(product)}
                  onOpenCart={() => setCartOpen(true)} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
