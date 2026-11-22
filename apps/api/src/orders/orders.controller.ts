import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { readOrder } from './order.input';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly auth: AuthService,
    private readonly orders: OrdersService,
  ) {}

  @Get()
  async list(@Headers('authorization') authorization?: string) {
    const user = await this.auth.getUser(authorization);
    return this.orders.list(user.id);
  }

  @Post()
  async place(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: unknown,
  ) {
    const user = await this.auth.getUser(authorization);
    return this.orders.place(user.id, readOrder(body));
  }
}
