import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health.controller';

@Module({
  imports: [CatalogModule, DatabaseModule, AuthModule],
  controllers: [HealthController],
})
export class AppModule {}
