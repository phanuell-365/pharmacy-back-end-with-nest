import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { CreateUserDto } from '../src/users/dto';
import { Role } from '../src/users/enums';
import { AuthDto } from '../src/auth/dto';
import { CreateDrugDto } from '../src/drugs/dto';
import { DoseForms } from '../src/drugs/enums';

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

  describe('Auth', function () {
    const authDto: AuthDto = {
      username: 'Administrator',
      password: 'password_admin',
    };

    describe('Login', function () {
      it('should return an object having an access_token', function () {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ ...authDto })
          .expectStatus(201)
          .stores('accessToken', 'access_token')
          .inspect();
      });
    });
  });

  describe('User', function () {
    const newUser: CreateUserDto = {
      username: 'Jane Smith',
      email: 'janesmith@localhost.com',
      password: 'password_jane',
      phone: '0712345676',
      role: Role.PHARMACIST,
    };

    describe('Create', function () {
      it('should return a new user', function () {
        return pactum
          .spec()
          .post('/users')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...newUser })
          .expectStatus(201);
      });
    });

    describe('Get all users', function () {
      it('should return all users', function () {
        return pactum
          .spec()
          .get('/users')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });
    });
  });

  describe('Drugs', function () {
    const newDrug: CreateDrugDto = {
      name: 'Paracetamol',
      doseForm: DoseForms.TABLET,
      strength: '500mg',
      levelOfUse: 7,
      therapeuticClass: 'Analgesic',
    };

    describe('Create', function () {
      it('should create a new drug and return it', function () {
        return pactum
          .spec()
          .post('/drugs')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...newDrug })
          .expectStatus(201)
          .expectBodyContains(newDrug.name);
      });
    });

    describe('Get all drugs', function () {
      it('should return all the drugs', function () {
        return pactum
          .spec()
          .get('/drugs')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .inspect();
      });
    });
  });
});
