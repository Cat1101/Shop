import { Injectable } from '@nestjs/common';
import { Database } from '../database/database.service';

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
      select: {
        slug: true,
        name: true,
        description: true,
        priceKopecks: true,
        stock: true,
        category: { select: { slug: true } },
      },
      orderBy: { id: 'asc' },
    });

    return products.map(({ category, ...product }) => ({
      ...product,
      category: category.slug,
    }));
  }
}
