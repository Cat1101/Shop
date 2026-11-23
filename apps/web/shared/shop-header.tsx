import { Cpu, MapPin, ShoppingBag, UserRound } from 'lucide-react';
import Link from 'next/link';

interface CartControl {
  count: number;
  open: boolean;
  onOpen: () => void;
}

export function ShopHeader({ cart, currentPage }: { cart?: CartControl; currentPage?: 'pickup' }) {
  return (
    <header className="shop-header">
      <div className="shell flex min-h-16 items-center justify-between gap-2 sm:min-h-20">
        <Link href="/" aria-label="MicroShop, главная" className="brand">
          <Cpu className="brand-mark" size={33} strokeWidth={1.9} aria-hidden="true" />
          MicroShop
        </Link>
        <nav className="shop-nav" aria-label="Магазин">
          <Link href="/#catalog" className="hidden sm:inline-flex">Каталог</Link>
          <Link href="/pickup" aria-label="Самовывоз" aria-current={currentPage === 'pickup' ? 'page' : undefined}>
            <MapPin size={18} /><span className="hidden sm:inline">Самовывоз</span>
          </Link>
          <Link href="/account" aria-label="Аккаунт">
            <UserRound size={18} /><span className="hidden sm:inline">Аккаунт</span>
          </Link>
          {cart && (
            <button type="button" className="nav-cart" aria-label={`Корзина, товаров: ${cart.count}`}
              aria-haspopup="dialog" aria-controls="cart" aria-expanded={cart.open} onClick={cart.onOpen}>
              <ShoppingBag size={17} /><span className="hidden sm:inline">Корзина</span>
              <span key={cart.count} className="nav-count">{cart.count}</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
