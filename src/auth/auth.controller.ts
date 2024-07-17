import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { JWTPayload } from './jwt-payload.type';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() createUserDTO: CreateUserDTO) {
    return await this.authService.signUp(createUserDTO);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authCredentialsDTO: AuthCredentialsDTO) {
    return await this.authService.login(authCredentialsDTO);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refreshToken(@CurrentUser() user: JWTPayload) {
    return await this.authService.refreshToken(user.id);
  }
}
