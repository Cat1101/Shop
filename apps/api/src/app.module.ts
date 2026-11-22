import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health.controller';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [CatalogModule, DatabaseModule, AuthModule, OrdersModule],
  controllers: [HealthController],
})
export class AppModule {}
