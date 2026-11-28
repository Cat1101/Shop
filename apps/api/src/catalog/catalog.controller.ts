import { BadRequestException, Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

const slugPattern = /^[a-z0-9-]{1,80}$/;

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
      (typeof category !== 'string' || !slugPattern.test(category))
    ) {
      throw new BadRequestException('Invalid category');
    }
    return this.catalog.listProducts(category);
  }

  @Get('products/:slug')
  async product(@Param('slug') slug: string) {
    const product = slugPattern.test(slug) ? await this.catalog.findProduct(slug) : null;
    if (!product) {
      throw new NotFoundException('PRODUCT_NOT_FOUND');
    }
    return product;
  }
}
