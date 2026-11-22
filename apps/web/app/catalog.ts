export interface Category {
  slug: string;
  name: string;
}

export interface Product {
  slug: string;
  name: string;
  description: string;
  category: string;
  priceKopecks: number;
  stock: number;
}

export async function fetchCatalog() {
  const apiUrl = process.env.API_URL ?? 'http://localhost:3001/api';

  async function load<T>(path: string): Promise<T> {
    const response = await fetch(`${apiUrl}/${path}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) {
      throw new Error(`Catalog request failed: ${path} (${response.status})`);
    }
    return (await response.json()) as T;
  }

  const [categories, products] = await Promise.all([
    load<Category[]>('categories'),
    load<Product[]>('products'),
  ]);
  return { categories, products };
}
