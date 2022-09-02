import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { CreateUserDto, UpdateUserDto } from '../src/users/dto';
import { Role } from '../src/users/enums';
import { AuthDto } from '../src/auth/dto';
import { CreatePatientDto, UpdatePatientDto } from '../src/patients/dto';
import { CreateDrugDto, UpdateDrugDto } from '../src/drugs/dto';
import { DoseForms } from '../src/drugs/enums';

describe('Pharmacy App e2e', function () {
  let app: INestApplication;

  jest.setTimeout(15000);

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    await app.listen(process.env.TEST_PORT);
    pactum.request.setBaseUrl(`http://localhost:${process.env.TEST_PORT}`);
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

  describe('Patients', function () {
    const newPatient: CreatePatientDto = {
      name: 'John Doe',
      phone: '0712345678',
      email: 'johndoe@localhost.com',
    };

    describe('Create Patient', function () {
      it('should create and return the new patient', function () {
        return pactum
          .spec()
          .post('/patients')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...newPatient })
          .expectStatus(201)
          .expectBodyContains(newPatient.name)
          .stores('patientId', 'id');
      });
    });

    describe('Get all patients', function () {
      it('should return all patients', function () {
        return pactum
          .spec()
          .get('/patients')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });
    });

    describe('Get a patient by id', function () {
      it('should return a patient', function () {
        return pactum
          .spec()
          .get('/patients/{id}')
          .withPathParams('id', '$S{patientId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .expectBodyContains(newPatient.name);
      });
    });

    describe('Update a patient', function () {
      const updatePatient: UpdatePatientDto = {
        name: 'Jane Doe',
        phone: '0700000000',
        email: 'janedoe@localhost.com',
      };

      it("should update the patient's name", function () {
        return pactum
          .spec()
          .patch('/patients/{id}')
          .withPathParams('id', '$S{patientId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ name: updatePatient.name })
          .expectStatus(200)
          .expectBodyContains(updatePatient.name);
      });

      it("should update the patient's email", function () {
        return pactum
          .spec()
          .patch('/patients/{id}')
          .withPathParams('id', '$S{patientId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ email: updatePatient.email })
          .expectStatus(200)
          .expectBodyContains(updatePatient.email);
      });

      it("should update the patient's phone", function () {
        return pactum
          .spec()
          .patch('/patients/{id}')
          .withPathParams('id', '$S{patientId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ phone: updatePatient.phone })
          .expectStatus(200)
          .expectBodyContains(updatePatient.phone);
      });
    });

    describe('Delete a patient', function () {
      it('should delete a patient', function () {
        return pactum
          .spec()
          .delete('/patients/{id}')
          .withPathParams('id', '$S{patientId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(204);
      });

      it('should return a 403 if the patient does not exist', function () {
        return pactum
          .spec()
          .delete('/patients/{id}')
          .withPathParams('id', '$S{patientId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(403);
      });
    });
  });

  describe('Drugs', function () {
    describe('Create a drug', function () {
      const drugDto: CreateDrugDto = {
        name: 'lidocaine',
        doseForm: DoseForms.INJECTION,
        strength: '0.25%; 0.5% (hydrochloride) in vial',
        levelOfUse: 3,
        therapeuticClass: 'Local anaesthetics',
      };

      it('should create a drug', function () {
        return pactum
          .spec()
          .post('/drugs')
          .withBody({ ...drugDto })
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(201)
          .expectBodyContains(drugDto.therapeuticClass);
      });

      it('should fail and return 409 status', function () {
        return pactum
          .spec()
          .post('/drugs')
          .withBody({ ...drugDto })
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(409);
      });

      it('should fail also with a status 409', function () {
        return pactum
          .spec()
          .post('/drugs')
          .withBody({
            name: drugDto.name,
            doseForm: drugDto.doseForm,
            strength: drugDto.strength,
            levelOfUse: drugDto.levelOfUse + 1,
            therapeuticClass: drugDto.therapeuticClass,
          })
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(409);
      });
    });

    describe('Update a drug', function () {
      const updateDrugDto: UpdateDrugDto = {
        name: 'lidocaine',
        doseForm: DoseForms.INJECTION,
        strength: '0.25%; 0.5% (hydrochloride) in vial',
        levelOfUse: 3,
        therapeuticClass: 'Local anaesthetics',
      };

      const newDrugDto: CreateDrugDto = {
        name: 'ketamine',
        doseForm: DoseForms.ORAL_LIQUID,
        strength: '50 mg (as hydrochloride)/ml in 10‐ml vial.',
        levelOfUse: 1,
        therapeuticClass: 'Injectable medicines',
      };

      it('should successfully create a new drug', function () {
        return pactum
          .spec()
          .post('/drugs')
          .withBody({ ...newDrugDto })
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(201)
          .stores('drugId', 'id')
          .expectBodyContains(newDrugDto.therapeuticClass);
      });

      it('should successfully update a drug', function () {
        return pactum
          .spec()
          .patch('/drugs/{id}')
          .withPathParams('id', '$S{drugId}')
          .withBody({ doseForm: DoseForms.INJECTION })
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .expectBodyContains(newDrugDto.therapeuticClass)
          .inspect();
      });

      it('should fail to update the drug', function () {
        return pactum
          .spec()
          .patch('/drugs/{id}')
          .withPathParams('id', '$S{drugId}')
          .withBody({ ...updateDrugDto })
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(409)
          .inspect();
      });

      it('should fail to update the drug', function () {
        return pactum
          .spec()
          .patch('/drugs/{id}')
          .withPathParams('id', '$S{drugId}')
          .withBody({ name: updateDrugDto.name })
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(409)
          .inspect();
      });

      it('should fail to update the drug', function () {
        return pactum
          .spec()
          .patch('/drugs/{id}')
          .withPathParams('id', '$S{drugId}')
          .withBody({
            name: updateDrugDto.name,
            doseForm: updateDrugDto.doseForm,
          })
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(409)
          .inspect();
      });

      it('should fail to update the drug', function () {
        return pactum
          .spec()
          .patch('/drugs/{id}')
          .withPathParams('id', '$S{drugId}')
          .withBody({
            doseForm: updateDrugDto.doseForm,
            strength: updateDrugDto.strength,
          })
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .inspect();
      });

      it('should fail to update the drug', function () {
        return pactum
          .spec()
          .patch('/drugs/{id}')
          .withPathParams('id', '$S{drugId}')
          .withBody({
            doseForm: updateDrugDto.doseForm,
            levelOfUse: updateDrugDto.levelOfUse,
          })
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .inspect();
      });
    });
  });
});
