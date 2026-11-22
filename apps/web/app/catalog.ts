import { apiRequest } from '../shared/api';

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
  async function load<T>(path: string): Promise<T> {
    const response = await apiRequest(path);
    if (!response.ok) {
      throw new Error(`Catalog request failed: ${path} (${response.status})`);
    }
    return response.json();
  }

  const [categories, products] = await Promise.all([
    load<Category[]>('/categories'),
    load<Product[]>('/products'),
  ]);
  return { categories, products };
}
