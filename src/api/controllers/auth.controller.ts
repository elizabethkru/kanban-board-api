import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { LoginDto, LoginResponseDto, RegisterDto, RegisterResponseDto } from './dto/auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан', type: RegisterResponseDto })
  @ApiResponse({ status: 409, description: 'Email уже существует' })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Логин пользователя' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Успешный логин', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}