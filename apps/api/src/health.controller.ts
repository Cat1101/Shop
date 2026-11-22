import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { Database } from './database/database.service';

@Controller('health')
export class HealthController {
  constructor(private readonly database: Database) {}

  @Get()
  async check() {
    try {
      await this.database.category.findFirst({ select: { id: true } });
    } catch {
      throw new ServiceUnavailableException('PostgreSQL is unavailable');
    }
    return { status: 'ok' };
  }
}
