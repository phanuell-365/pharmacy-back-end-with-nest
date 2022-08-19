import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { CreateUserDto } from '../src/users/dto';
import { Role } from '../src/users/enums';

describe('Pharmacy App e2e', function () {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    await app.listen(process.env.PORT);
    pactum.request.setBaseUrl(`http://localhost:${process.env.PORT}`);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('User', function () {
    const newUser: CreateUserDto = {
      username: 'Jane Smith',
      email: 'janesmith@localhost.com',
      password: 'password_jane',
      phone: '0712345678',
      role: Role.PHARMACIST,
    };

    describe('Create', function () {
      it('should return a new user', function () {
        return pactum
          .spec()
          .post('/users')
          .withBody({ ...newUser })
          .expectStatus(201)
          .inspect();
      });
    });
  });
  it.todo('should do something');
});
