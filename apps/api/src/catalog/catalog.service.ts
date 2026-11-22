import { Injectable } from '@nestjs/common';
import { CatalogRepository } from './catalog.repository';

@Injectable()
export class CatalogService {
  constructor(private readonly repository: CatalogRepository) {}

  async listCategories() {
    return this.repository.listCategories();
  }

  async listProducts(category?: string) {
    return this.repository.listProducts(category);
  }
}
