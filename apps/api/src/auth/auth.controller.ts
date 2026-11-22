import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { isToken, readCredentials } from './auth.input';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @HttpCode(202)
  @UseGuards(ThrottlerGuard)
  async register(@Body() body: unknown) {
    const { email, password } = readCredentials(body);
    await this.auth.register(email, password);
    return { status: 'accepted' };
  }

  @Post('verify-email')
  @HttpCode(204)
  @UseGuards(ThrottlerGuard)
  async verifyEmail(@Body('token') token: unknown) {
    if (!isToken(token)) {
      throw new BadRequestException('INVALID_VERIFICATION');
    }
    await this.auth.verifyEmail(token);
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  login(@Body() body: unknown) {
    const { email, password } = readCredentials(body);
    return this.auth.login(email, password);
  }

  @Get('me')
  async me(@Headers('authorization') authorization?: string) {
    const { email } = await this.auth.getUser(authorization);
    return { email };
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Headers('authorization') authorization?: string) {
    await this.auth.logout(authorization);
  }
}
