import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ResetPassword, User, UsersRoles } from './entities';
import { TokenService } from '../token/token.service';
import { ConfigService } from '@nestjs/config';
import { RedisAuthService } from '../redis';
import { MicroserviceService } from '../microservice/microservice.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DataSource, Repository } from 'typeorm';
import { RegisterDto } from './dto';
import { bcryptPassword } from '../utils/password.util';
import { Role } from '../role/entities';
import { RoleEnum } from '../role/enum/role.enum';
import {
  MicroResInterface,
  PatternEnum,
  ServiceNameEnum,
} from '@samb2/nest-microservice';

jest.mock('../utils/create-transaction.util');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let usersRolesRepository: Repository<UsersRoles>;
  let resetPasswordRepository: Repository<ResetPassword>;
  let tokenService: TokenService;
  let configService: ConfigService;
  let redisAuthService: RedisAuthService;
  let microserviceService: MicroserviceService;
  let eventEmitter: EventEmitter2;
  let dataSource: DataSource;

  beforeEach(async () => {
    const connectionMock = {
      connect: jest.fn(),
    };

    const queryRunnerMock = {
      manager: {
        getRepository: jest.fn(),
      },
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      connect: jest.fn(),
    };

    const dataSourceMock = {
      createQueryRunner: jest.fn().mockResolvedValue(queryRunnerMock),
      transaction: jest.fn(),
    };

    const userRepositoryMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const roleRepositoryMock = {
      findOne: jest.fn(),
    };

    const usersRolesRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: roleRepositoryMock,
        },
        {
          provide: getRepositoryToken(UsersRoles),
          useValue: usersRolesRepositoryMock,
        },
        {
          provide: getRepositoryToken(ResetPassword),
          useValue: {},
        },
        {
          provide: TokenService,
          useValue: {
            generateToken: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: RedisAuthService,
          useValue: {
            set: jest.fn(),
          },
        },
        {
          provide: MicroserviceService,
          useValue: {
            sendToUserService: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    usersRolesRepository = module.get<Repository<UsersRoles>>(
      getRepositoryToken(UsersRoles),
    );
    resetPasswordRepository = module.get<Repository<ResetPassword>>(
      getRepositoryToken(ResetPassword),
    );
    tokenService = module.get<TokenService>(TokenService);
    configService = module.get<ConfigService>(ConfigService);
    redisAuthService = module.get<RedisAuthService>(RedisAuthService);
    microserviceService = module.get<MicroserviceService>(MicroserviceService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    dataSource = module.get<DataSource>(DataSource);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = new User();
      user.id = '1';
      user.email = registerDto.email;
      user.password = await bcryptPassword(registerDto.password);

      const role = new Role();
      role.id = 1;
      role.name = RoleEnum.USER;

      const usersRoles = new UsersRoles();
      usersRoles.user = user;
      usersRoles.role = role;

      const payload = {
        authId: user.id,
        email: user.email,
      };

      const microserviceResponse: MicroResInterface = {
        from: ServiceNameEnum.AUTH,
        to: ServiceNameEnum.USER,
        error: false,
        reason: null,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockReturnValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(role);
      jest.spyOn(usersRolesRepository, 'create').mockReturnValue(usersRoles);
      jest.spyOn(usersRolesRepository, 'save').mockResolvedValue(usersRoles);
      jest
        .spyOn(microserviceService, 'sendToUserService')
        .mockResolvedValue(microserviceResponse);

      const result = await service.register(registerDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(userRepository.create).toHaveBeenCalledWith({
        email: registerDto.email,
        password: expect.any(String),
      });
      expect(userRepository.save).toHaveBeenCalledWith(user);
      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { name: RoleEnum.USER },
        select: { id: true },
      });
      expect(usersRolesRepository.create).toHaveBeenCalledWith({
        user,
        role,
      });
      expect(usersRolesRepository.save).toHaveBeenCalledWith(usersRoles);
      expect(microserviceService.sendToUserService).toHaveBeenCalledWith(
        PatternEnum.USER_REGISTERED,
        payload,
        '10s',
      );
      expect(result).toEqual({ message: 'Register Successfully' });
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      // Implement the test case for the login method
    });
  });

  describe('forgotPassword', () => {
    it('should handle forgot password', async () => {
      // Implement the test case for the forgotPassword method
    });
  });

  describe('resetPassword', () => {
    it('should reset a user password', async () => {
      // Implement the test case for the resetPassword method
    });
  });

  describe('refresh', () => {
    it('should refresh the access token', () => {
      // Implement the test case for the refresh method
    });
  });

  describe('logout', () => {
    it('should logout a user', async () => {
      // Implement the test case for the logout method
    });
  });
});
