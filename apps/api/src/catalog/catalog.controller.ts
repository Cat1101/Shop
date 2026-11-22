import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller()
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('categories')
  categories() {
    return this.catalog.listCategories();
  }

  @Get('products')
  products(@Query('category') category?: string) {
    if (
      category !== undefined &&
      (typeof category !== 'string' || !/^[a-z0-9-]{1,80}$/.test(category))
    ) {
      throw new BadRequestException('Invalid category');
    }
    return this.catalog.listProducts(category);
  }
}
