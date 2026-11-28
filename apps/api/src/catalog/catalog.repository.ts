import { Injectable } from '@nestjs/common';
import { Database } from '../database/database.service';
import { Prisma } from '../generated/prisma/client';

const catalogProduct = {
  slug: true,
  name: true,
  description: true,
  priceKopecks: true,
  stock: true,
  category: { select: { slug: true } },
} satisfies Prisma.ProductSelect;

function toProduct({ category, ...product }: Prisma.ProductGetPayload<{ select: typeof catalogProduct }>) {
  return { ...product, category: category.slug };
}

@Injectable()
export class CatalogRepository {
  constructor(private readonly database: Database) {}

  listCategories() {
    return this.database.category.findMany({
      select: { slug: true, name: true },
      orderBy: { id: 'asc' },
    });
  }

  async listProducts(category?: string) {
    const products = await this.database.product.findMany({
      where: category === undefined ? undefined : { category: { slug: category } },
      select: catalogProduct,
      orderBy: { id: 'asc' },
    });

    return products.map(toProduct);
  }

  async findProduct(slug: string) {
    const product = await this.database.product.findUnique({
      where: { slug },
      select: catalogProduct,
    });
    return product ? toProduct(product) : null;
  }
}
