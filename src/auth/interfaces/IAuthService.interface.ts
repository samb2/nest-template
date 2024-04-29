import {
  ForgotPasswordDto,
  ForgotPasswordResDto,
  LoginDto,
  LoginResDto,
  RefreshResDto,
  RegisterDto,
  RegisterResDto,
  ResetPasswordDto,
  ResetPasswordResDto,
} from '../dto';
import { User } from '../entities';

export interface IAuthServiceInterface {
  register(registerDto: RegisterDto): Promise<RegisterResDto>;

  login(loginDto: LoginDto): Promise<LoginResDto>;

  forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResDto>;

  resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResDto>;

  refresh(email: string): RefreshResDto;

  logout(user: User): Promise<object>;
}
