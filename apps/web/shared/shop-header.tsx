import { CircuitBoard, ShoppingBag, UserRound } from 'lucide-react';
import Link from 'next/link';

interface CartControl {
  count: number;
  open: boolean;
  onOpen: () => void;
}

export function ShopHeader({ cart }: { cart?: CartControl }) {
  return (
    <header className="border-b border-line bg-white">
      <div className="shell flex min-h-[4.5rem] items-center justify-between gap-2 sm:gap-5">
        <Link
          href="/"
          aria-label="MicroShop, главная"
          className="flex shrink-0 items-center gap-2 rounded-md text-[1.15rem] font-extrabold tracking-[-0.06em] sm:text-[1.35rem]"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-hero text-white sm:size-9">
            <CircuitBoard size={19} strokeWidth={1.7} aria-hidden="true" />
          </span>
          MicroShop
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Магазин">
          <Link href="/#catalog" className="text-link mr-3 hidden text-sm text-ink sm:inline-flex">
            Каталог
          </Link>
          <Link href="/account" className="control control-secondary px-2.5 sm:px-3.5" aria-label="Аккаунт">
            <UserRound size={17} aria-hidden="true" />
            <span className="hidden sm:inline">Аккаунт</span>
          </Link>
          {cart && (
            <button
              type="button"
              className="control control-primary px-2.5 sm:px-3.5"
              aria-label={`Корзина, товаров: ${cart.count}`}
              aria-haspopup="dialog"
              aria-controls="cart"
              aria-expanded={cart.open}
              onClick={cart.onOpen}
            >
              <ShoppingBag size={17} aria-hidden="true" />
              <span className="hidden sm:inline">Корзина</span>
              <span className="min-w-5 rounded-sm bg-white/20 px-1 text-center text-xs tabular-nums">
                {cart.count}
              </span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
