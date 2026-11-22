'use client';

import { useSyncExternalStore } from 'react';
import type { Product } from '../catalog/model';

type Quantities = Record<string, number>;

const storageKey = 'microshop-cart';
const changeEvent = 'microshop-cart-change';
const emptyCart = '{}';
let memoryCart: string | undefined;

function subscribe(notify: () => void) {
  window.addEventListener(changeEvent, notify);
  window.addEventListener('storage', notify);
  return () => {
    window.removeEventListener(changeEvent, notify);
    window.removeEventListener('storage', notify);
  };
}

function readSnapshot() {
  if (memoryCart !== undefined) {
    return memoryCart;
  }
  try {
    return localStorage.getItem(storageKey) ?? emptyCart;
  } catch {
    return emptyCart;
  }
}

function serverSnapshot() {
  return emptyCart;
}

function save(quantities: Quantities) {
  const snapshot = JSON.stringify(quantities);
  try {
    localStorage.setItem(storageKey, snapshot);
  } catch {
    memoryCart = snapshot;
  }
  window.dispatchEvent(new Event(changeEvent));
}

function parse(snapshot: string, products: Product[]): Quantities {
  try {
    const saved = JSON.parse(snapshot);
    return Object.fromEntries(
      products.flatMap((product) => {
        const quantity = saved?.[product.slug];
        if (!Number.isSafeInteger(quantity) || quantity <= 0 || product.stock === 0) {
          return [];
        }
        return [[product.slug, Math.min(quantity, product.stock, 100)]];
      }),
    );
  } catch {
    return {};
  }
}

export function useCart(products: Product[]) {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, serverSnapshot);
  const quantities = parse(snapshot, products);
  const lines = products.flatMap((product) => {
    const quantity = quantities[product.slug];
    return quantity ? [{ product, quantity }] : [];
  });
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const totalKopecks = lines.reduce(
    (sum, { product, quantity }) => sum + quantity * product.priceKopecks, 0,
  );

  function changeQuantity(product: Product, amount: number) {
    const cart = parse(readSnapshot(), products);
    const quantity = Math.max(0, Math.min((cart[product.slug] ?? 0) + amount, product.stock, 100));
    if (quantity === 0) {
      delete cart[product.slug];
    } else {
      cart[product.slug] = quantity;
    }
    save(cart);
  }

  function removePurchased(items: { slug: string; quantity: number }[]) {
    const cart = parse(readSnapshot(), products);
    for (const { slug, quantity } of items) {
      if ((cart[slug] ?? 0) <= quantity) {
        delete cart[slug];
      } else {
        cart[slug] -= quantity;
      }
    }
    save(cart);
  }

  return { lines, quantities, count, totalKopecks, changeQuantity, removePurchased };
}

export type Cart = ReturnType<typeof useCart>;
