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
