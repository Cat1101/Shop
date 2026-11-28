import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { OrderConfirmationService } from './order-confirmation.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrderConfirmationService],
})
export class OrdersModule {}
