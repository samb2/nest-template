import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            forgotPassword: jest.fn(),
            resetPassword: jest.fn(),
            refresh: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should call authService.register with registerDto', async () => {
      const registerDto = { email: 'test@example.com', password: 'password' };
      await controller.register(registerDto);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should call authService.login with loginDto', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      await controller.login(loginDto);
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('forgotPassword', () => {
    it('should call authService.forgotPassword with forgotPasswordDto', async () => {
      const forgotPasswordDto = { email: 'test@example.com' };
      await controller.forgotPassword(forgotPasswordDto);
      expect(service.forgotPassword).toHaveBeenCalledWith(forgotPasswordDto);
    });
  });

  describe('resetPassword', () => {
    it('should call authService.resetPassword with resetPasswordDto', async () => {
      const resetPasswordDto = { password: 'newPassword', token: 'resetToken' };
      await controller.resetPassword(resetPasswordDto);
      expect(service.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
    });
  });

  describe('refresh', () => {
    it('should call authService.refresh with req.user', async () => {
      const req = { user: 'authId' };
      await controller.refresh(req);
      expect(service.refresh).toHaveBeenCalledWith(req.user);
    });
  });

  describe('logout', () => {
    it('should call authService.logout with req.user', async () => {
      const req = { user: 'authId' };
      await controller.logout(req);
      expect(service.logout).toHaveBeenCalledWith(req.user);
    });
  });
});
