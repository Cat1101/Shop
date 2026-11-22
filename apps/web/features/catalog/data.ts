import { apiRequest } from '../../shared/api';
import type { Category, Product } from './model';

async function load<T>(path: string): Promise<T> {
  const response = await apiRequest(path);
  if (!response.ok) {
    throw new Error(`Catalog request failed: ${path} (${response.status})`);
  }
  return response.json();
}

export function fetchProducts() {
  return load<Product[]>('/products');
}

export async function fetchCatalog() {
  const [categories, products] = await Promise.all([
    load<Category[]>('/categories'),
    fetchProducts(),
  ]);
  return { categories, products };
}
