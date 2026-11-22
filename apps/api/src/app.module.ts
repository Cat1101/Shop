import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health.controller';

@Module({
  imports: [CatalogModule, DatabaseModule],
  controllers: [HealthController],
})
export class AppModule {}
