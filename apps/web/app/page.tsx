import { fetchCatalog } from '../features/catalog/data';
import { Storefront } from '../features/catalog/storefront';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { categories, products } = await fetchCatalog();
  return <Storefront categories={categories} products={products} />;
}
