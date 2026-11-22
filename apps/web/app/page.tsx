import { fetchCatalog } from './catalog';
import { Storefront } from './storefront';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { categories, products } = await fetchCatalog();
  return <Storefront categories={categories} products={products} />;
}
