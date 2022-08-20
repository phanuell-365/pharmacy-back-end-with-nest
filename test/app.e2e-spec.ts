import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { CreateUserDto, UpdateUserDto } from '../src/users/dto';
import { Role } from '../src/users/enums';
import { AuthDto } from '../src/auth/dto';
import { CreateDrugDto, UpdateDrugDto } from '../src/drugs/dto';
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
          .stores('accessToken', 'access_token');
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
          .stores('userId', 'id')
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

    describe('Get a user', function () {
      it('should return a user', function () {
        return pactum
          .spec()
          .get('/users/{id}')
          .withPathParams('id', '$S{userId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .expectBodyContains(newUser.username);
      });
    });

    describe('Update a user', function () {
      const updateUser: UpdateUserDto = {
        username: 'Jane Miller',
        email: 'janemiller@localhost.com',
      };
      it('should return the updated user', function () {
        return pactum
          .spec()
          .patch('/users/{id}')
          .withPathParams('id', '$S{userId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...updateUser })
          .expectStatus(200)
          .expectBodyContains(updateUser.username);
      });
    });
    describe('Delete a user', function () {
      it('should delete a user', function () {
        return pactum
          .spec()
          .delete('/users/{id}')
          .withPathParams('id', '$S{userId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(204);
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
          .expectBodyContains(newDrug.name)
          .stores('drugId', 'id');
      });
    });

    describe('Get a drug', function () {
      it('should return a drug', function () {
        return pactum
          .spec()
          .get('/drugs/{id}')
          .withPathParams('id', '$S{drugId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
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
          .expectStatus(200);
      });
    });

    describe('Update a drug', function () {
      const updateDrug: UpdateDrugDto = {
        name: 'Amoxicillin',
        strength: '1000mg',
        doseForm: DoseForms.CAPSULE,
      };

      it('should update a drug and return it', function () {
        return pactum
          .spec()
          .patch('/drugs/{id}')
          .withPathParams('id', '$S{drugId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ name: updateDrug.name })
          .expectStatus(200)
          .expectBodyContains(updateDrug.name);
      });

      it('should update the drug strength', function () {
        return pactum
          .spec()
          .patch('/drugs/{id}')
          .withPathParams('id', '$S{drugId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ strength: updateDrug.strength })
          .expectStatus(200)
          .expectBodyContains(updateDrug.strength);
      });

      it('should update the drug dose form', function () {
        return pactum
          .spec()
          .patch('/drugs/{id}')
          .withPathParams('id', '$S{drugId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ doseForm: updateDrug.doseForm })
          .expectStatus(200)
          .expectBodyContains(updateDrug.doseForm);
      });
    });

    describe('Delete a drug', function () {
      it('should delete a drug', function () {
        return pactum
          .spec()
          .delete('/drugs/{id}')
          .withPathParams('id', '$S{drugId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(204);
      });

      it('should get all drugs', function () {
        return pactum
          .spec()
          .get('/drugs')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });
    });
  });
});
