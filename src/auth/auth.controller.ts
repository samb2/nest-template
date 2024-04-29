import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiOkResponseSuccess } from '../utils/ApiOkResponseSuccess.util';
import {
  ForgotPasswordDto,
  ForgotPasswordResDto,
  LoginDto,
  LoginResDto,
  LogoutResDto,
  RefreshResDto,
  RegisterDto,
  RegisterResDto,
  ResetPasswordDto,
  ResetPasswordResDto,
} from './dto';
import { AccessTokenGuard, RefreshTokenGuard } from '../utils/guard';

@ApiTags('auth service')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiOkResponseSuccess(RegisterResDto, 201)
  @ApiBadRequestResponse({ description: 'Bad Request!' })
  @ApiConflictResponse({ description: 'This user registered before!' })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponseSuccess(LoginResDto)
  @ApiBadRequestResponse({ description: 'Bad Request!' })
  @ApiUnauthorizedResponse({ description: 'username or password is wrong!' })
  @ApiForbiddenResponse({ description: 'Your account is not active!' })
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() loginDto: LoginDto): Promise<LoginResDto> {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @ApiOkResponseSuccess(ForgotPasswordResDto)
  @ApiBadRequestResponse({ description: 'Bad Request!' })
  @ApiUnauthorizedResponse({ description: 'username or password is wrong!' })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResDto> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOkResponseSuccess(ResetPasswordResDto)
  @ApiBadRequestResponse({ description: 'Bad Request!' })
  @ApiForbiddenResponse({ description: 'This Token Expired' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResDto> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiBearerAuth()
  @ApiOkResponseSuccess(RefreshResDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  refresh(@Req() req: any): RefreshResDto {
    return this.authService.refresh(req.user);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOkResponseSuccess(RefreshResDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async logout(@Req() req: any): Promise<LogoutResDto> {
    return this.authService.logout(req.user);
  }
}
