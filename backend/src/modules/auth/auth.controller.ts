import { Controller, Post, Body } from '@nestjs/common';
import { AuthService, RegisterDto } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: Record<string, unknown>) {
    return this.authService.login(
      loginDto.email as string,
      loginDto.password as string,
    );
  }
}
