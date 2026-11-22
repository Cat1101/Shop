import Link from 'next/link';
import type { ReactNode } from 'react';
import { ShopHeader } from './shop-header';

export function DetailLayout({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <>
      <ShopHeader />
      <main className={`shell py-7 sm:py-12 ${wide ? 'max-w-6xl' : 'max-w-3xl'}`}>
        <Link className="text-link mb-4 text-sm" href="/#catalog">К каталогу</Link>
        {children}
      </main>
    </>
  );
}
