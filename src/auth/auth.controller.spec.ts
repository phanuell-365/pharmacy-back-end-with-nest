import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { userProviders } from '../users/users.provider';
import { AuthDto } from './dto';

describe('AuthController', () => {
  let controller: AuthController;
  const loginResult = {
    access_token: 'accessToken',
    role: 'admin',
    expires_in: 'expiresIn',
  };

  const mockAuthService = {
    login: jest.fn((user: AuthDto) => {
      return loginResult;
    }),
  };
  // const mockJwtService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, JwtService, ...userProviders],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return an object carrying an access_token', async function () {
    const loginDto: AuthDto = {
      username: 'username',
      password: 'password',
    };

    expect(await controller.login(loginDto)).toEqual(loginResult);

    expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
  });
});
