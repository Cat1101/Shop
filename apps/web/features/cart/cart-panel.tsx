'use client';

import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { formatPrice } from '../../shared/money';
import { ProductArt } from '../catalog/product-art';
import type { Cart } from './use-cart';

export function CartPanel({ open, cart, onClose }: { open: boolean; cart: Cart; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (open && !element?.open) {
      element?.showModal();
    } else if (!open && element?.open) {
      element.close();
    }
  }, [open]);

  return (
    <dialog
      id="cart"
      ref={dialog}
      className="cart-dialog fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-md bg-white text-ink shadow-2xl backdrop:bg-hero/45"
      aria-labelledby="cart-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
          <h2 id="cart-title" className="text-3xl font-medium tracking-tight">Корзина</h2>
          <button type="button" className="control control-secondary w-11 px-0" aria-label="Закрыть корзину" onClick={onClose}>
            <X size={19} aria-hidden="true" />
          </button>
        </header>

        {cart.lines.length === 0 ? (
          <div className="grid flex-1 place-content-center justify-items-center gap-4 p-6 text-center">
            <span className="grid size-14 place-items-center rounded-xl bg-tint text-accent">
              <ShoppingBag size={25} aria-hidden="true" />
            </span>
            <p className="text-lg font-extrabold">Корзина пока пуста</p>
            <button type="button" className="control control-primary" onClick={onClose}>
              Продолжить покупки
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto overscroll-contain px-5 sm:px-7">
              {cart.lines.map(({ product, quantity }) => (
                <li key={product.slug} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="cart-thumb"><ProductArt slug={product.slug} /></div>
                    <div>
                      <p className="font-mono font-medium">{product.name}</p>
                      <p className="mt-1 text-sm font-bold text-muted tabular-nums">
                        {formatPrice(product.priceKopecks * quantity)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="control control-secondary w-11 px-0"
                      onClick={() => cart.changeQuantity(product, -1)}
                      aria-label={`Убрать одну единицу ${product.name}`}
                    >
                      <Minus size={16} aria-hidden="true" />
                    </button>
                    <span className="min-w-6 text-center text-sm font-extrabold tabular-nums" aria-live="polite">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="control control-secondary w-11 px-0"
                      onClick={() => cart.changeQuantity(product, 1)}
                      disabled={quantity >= Math.min(product.stock, 100)}
                      aria-label={`Добавить одну единицу ${product.name}`}
                    >
                      <Plus size={16} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="bg-ink px-5 pt-6 pb-8 text-white sm:px-7">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <span className="font-bold">Итого</span>
                <strong className="text-2xl font-extrabold tabular-nums" aria-live="polite">
                  {formatPrice(cart.totalKopecks)}
                </strong>
              </div>
              <Link className="control control-primary w-full" href="/checkout" onClick={onClose}>
                Оформить заказ
              </Link>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
