import { AuthService } from './auth.service';
import { LoginDto, LogoutDto } from './auth.dto';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  async logIn(@Query() query: LoginDto): Promise<any> {
    return this.authService.Login(query.email, query.password);
  }

  @Get('logout')
  async logOut(@Query() query: LogoutDto): Promise<boolean> {
    return this.authService.Logout(query.token);
  }
}
