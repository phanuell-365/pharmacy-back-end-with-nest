import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { USER_REPOSITORY } from './constants';
import { CreateUserDto } from './dto';
import { Role } from './enums';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserRepository = {};

  const mockUsersService = {
    create: jest.fn().mockImplementation((user: CreateUserDto) => {
      return {
        id: new Date().getDay().toString(),
        ...user,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the newly created user', function () {
    const newUser: CreateUserDto = {
      username: 'John Doe',
      email: 'johndoe@localhost.com',
      password: 'password',
      phone: '0712345678',
      role: Role.ADMIN,
    };

    const createUserResult = {
      id: new Date().getDay().toString(),
      ...newUser,
    };

    expect(controller.create(newUser)).toEqual(createUserResult);

    expect(mockUsersService.create).toHaveBeenCalledWith(newUser);
  });
});
