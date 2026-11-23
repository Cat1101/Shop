import type { Metadata } from 'next';
import { connection } from 'next/server';
import { PickupLocations } from '../../features/pickup/pickup-locations';
import { pickupPoints } from '../../features/pickup/points';
import { ShopHeader } from '../../shared/shop-header';

export const metadata: Metadata = {
  title: 'Пункты самовывоза — MicroShop',
  description: 'Адреса и часы работы пунктов самовывоза MicroShop.',
};

export default async function PickupPage() {
  await connection();
  const mapKey = process.env.YANDEX_MAPS_API_KEY?.trim();

  return (
    <>
      <ShopHeader currentPage="pickup" />
      <main className="shell py-7 sm:py-10">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-[-0.05em] sm:text-4xl">
            Пункты самовывоза
          </h1>
          <p className="mt-2 text-muted">Выберите пункт на карте или в списке.</p>
        </header>
        <PickupLocations points={pickupPoints} mapKey={mapKey} />
      </main>
    </>
  );
}
