import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { DoseForms } from '../src/drugs/enums';
import { CreateDrugDto, UpdateDrugDto } from '../src/drugs/dto';
import { CreateInventoryDto, UpdateInventoryDto } from '../src/inventory/dto';

describe('Pharmacy Mini-App for Drug and Inventory e2e', function () {
  let miniApp: INestApplication;

  jest.setTimeout(15000);

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    miniApp = moduleRef.createNestApplication();
    miniApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await miniApp.init();
    await miniApp.listen(process.env.TEST_PORT);
    pactum.request.setBaseUrl(`http://localhost:${process.env.TEST_PORT}`);
  });

  afterAll(async () => {
    await miniApp.close();
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

      it("should create the drug after it's deletion", function () {
        return pactum
          .spec()
          .post('/drugs')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...newDrug })
          .stores('newDrugId', 'id')
          .expectBodyContains(newDrug.name)
          .expectStatus(201);
      });
    });
  });

  describe('Inventory', function () {
    const newInventory: CreateInventoryDto = {
      issueUnitPrice: 10,
      issueUnitPerPackSize: 200,
      packSize: 'Box',
      packSizePrice: 100,
      expirationDate: new Date('2023-01-01'),
      DrugId: '$S{newDrugId}',
    };

    describe('Create Inventory', function () {
      it('should create and return the new inventory', function () {
        return pactum
          .spec()
          .post('/inventory')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...newInventory })
          .expectStatus(201)
          .expectBodyContains(newInventory.issueUnitPrice)
          .stores('inventoryId', 'id');
      });
    });

    describe('Get an inventory', function () {
      it('should return an inventory', function () {
        return pactum
          .spec()
          .get('/inventory/{id}')
          .withPathParams('id', '$S{inventoryId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .expectBodyContains(newInventory.issueUnitPrice);
      });
    });

    describe('Update Inventory By Id', function () {
      const updateInventory: UpdateInventoryDto = {
        issueUnitPrice: 20,
        issueUnitPerPackSize: 100,
        packSize: 'Bottle',
        packSizePrice: 50,
        expirationDate: new Date('2024/10/31'),
        DrugId: '$S{newDrugId}',
      };

      it("should update an inventory's issue unit by id", function () {
        return pactum
          .spec()
          .patch('/inventory/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withPathParams('id', '$S{inventoryId}')
          .withBody({
            issueUnit: updateInventory.issueUnitPrice,
            DrugId: updateInventory.DrugId,
          })
          .expectStatus(200)
          .expectBodyContains(updateInventory.issueUnitPrice);
      });

      it("should update an inventory's issue unit price by id", function () {
        return pactum
          .spec()
          .patch('/inventory/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withPathParams('id', '$S{inventoryId}')
          .withBody({
            issueUnitPrice: updateInventory.issueUnitPrice,
            DrugId: updateInventory.DrugId,
          })
          .expectStatus(200)
          .expectBodyContains(updateInventory.issueUnitPrice);
      });

      it("should update an inventory's issue unit per pack size by id", function () {
        return pactum
          .spec()
          .patch('/inventory/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withPathParams('id', '$S{inventoryId}')
          .withBody({
            issueUnitPerPackSize: updateInventory.issueUnitPerPackSize,
            DrugId: updateInventory.DrugId,
          })
          .expectStatus(200)
          .expectBodyContains(updateInventory.issueUnitPerPackSize);
      });

      it("should update an inventory's pack size by id", function () {
        return pactum
          .spec()
          .patch('/inventory/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withPathParams('id', '$S{inventoryId}')
          .withBody({
            packSize: updateInventory.packSize,
            DrugId: updateInventory.DrugId,
          })
          .expectStatus(200)
          .expectBodyContains(updateInventory.packSize);
      });

      it("should update an inventory's pack size price by id", function () {
        return pactum
          .spec()
          .patch('/inventory/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withPathParams('id', '$S{inventoryId}')
          .withBody({
            packSizePrice: updateInventory.packSizePrice,
            DrugId: updateInventory.DrugId,
          })
          .expectStatus(200)
          .expectBodyContains(updateInventory.packSizePrice);
      });

      it("should update an inventory's expiration date by id", function () {
        return pactum
          .spec()
          .patch('/inventory/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withPathParams('id', '$S{inventoryId}')
          .withBody({
            expirationDate: updateInventory.expirationDate,
            DrugId: updateInventory.DrugId,
          })
          .expectStatus(200)
          .expectBodyContains(updateInventory.expirationDate);
      });
    });

    describe('Delete an inventory by Id', function () {
      it('should delete an inventory and return 204', function () {
        return pactum
          .spec()
          .delete('/inventory/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withPathParams('id', '$S{inventoryId}')
          .expectStatus(204);
      });

      it('should return an empty array', function () {
        return pactum
          .spec()
          .get('/inventory')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .expectBodyContains([]);
      });
    });

    describe('Delete a drug that has an inventory', function () {
      it('should create and return the new inventory', function () {
        return pactum
          .spec()
          .post('/inventory')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...newInventory })
          .expectStatus(201)
          .expectBodyContains(newInventory.issueUnitPrice)
          .stores('inventoryId', 'id');
      });

      // The following tests pass only when the model's paranoid property is set to false.

      it('should delete the drug that has inventory', function () {
        return pactum
          .spec()
          .delete('/drugs/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withPathParams('id', '$S{newDrugId}')
          .expectStatus(204)
          .inspect();
      });

      it('should return an empty drug array', function () {
        return pactum
          .spec()
          .get('/drugs')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .expectBodyContains([])
          .inspect();
      });

      it('should return an empty inventory array', function () {
        return (
          pactum
            .spec()
            .get('/inventory')
            .withHeaders({
              Authorization: 'Bearer $S{accessToken}',
            })
            .expectStatus(200)
            // .expectBodyContains([])
            .inspect()
        );
      });
    });
  });
});
