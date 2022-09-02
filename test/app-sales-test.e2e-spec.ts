import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { CreateDrugDto } from '../src/drugs/dto';
import { DoseForms } from '../src/drugs/enums';
import { CreateSupplierDto } from '../src/suppliers/dto';
import { CreateInventoryDto } from '../src/inventory/dto';
import { CreateOrderDto } from '../src/orders/dto';
import { OrderStatuses } from '../src/orders/enum';
import { CreateSupplyDto } from '../src/supplies/dto';
import { CreateSaleDto, UpdateSaleDto } from '../src/sales/dto';
import { CreatePatientDto } from '../src/patients/dto';

describe('Making a Sale in Pharmacy App e2e', function () {
  let salesApp: INestApplication;

  jest.setTimeout(15000);

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    salesApp = moduleRef.createNestApplication();
    salesApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await salesApp.init();
    await salesApp.listen(process.env.TEST_PORT);
    pactum.request.setBaseUrl(`http://localhost:${process.env.TEST_PORT}`);
  });

  afterAll(async () => {
    await salesApp.close();
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

  describe('Sales test 1', function () {
    describe('Get empty sale', function () {
      it('should return an empty array', function () {
        return pactum
          .spec()
          .get('/sales')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .expectBodyContains([]);
      });
    });
  });

  describe('Drug', function () {
    describe('Create Drug', function () {
      const drugDto: CreateDrugDto = {
        name: 'Paracetamol',
        doseForm: DoseForms.CAPSULE,
        strength: '250mg',
        levelOfUse: 5,
        therapeuticClass: 'Analgesic',
      };

      it('should return a new drug', function () {
        return pactum
          .spec()
          .post('/drugs')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...drugDto })
          .expectStatus(201)
          .expectBodyContains(drugDto.doseForm)
          .stores('drugId', 'id');
      });
    });
  });

  describe('Patient', function () {
    describe('Create a patient', function () {
      const patientDto: CreatePatientDto = {
        name: 'John Doe',
        phone: '0712345678',
        email: 'johndoe@localhost.com',
      };

      it('should create and return the new patient', function () {
        return pactum
          .spec()
          .post('/patients')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...patientDto })
          .expectStatus(201)
          .expectBodyContains(patientDto.name)
          .stores('patientId', 'id');
      });
    });
  });

  describe('Supplier', function () {
    describe('Create Supplier', function () {
      const supplierDto: CreateSupplierDto = {
        name: 'Beta Healthcare',
        phone: '0712345678',
        email: 'betahealthcare@info.com',
      };

      it('should return a new supplier', function () {
        return pactum
          .spec()
          .post('/suppliers')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...supplierDto })
          .expectStatus(201)
          .expectBodyContains(supplierDto.name)
          .stores('supplierId', 'id');
      });
    });
  });

  describe('Inventory', function () {
    describe('Create Inventory', function () {
      const inventoryDto: CreateInventoryDto = {
        issueUnitPrice: 10,
        issueUnitPerPackSize: 200,
        packSize: 'Box',
        packSizePrice: 100,
        expirationDate: new Date('2023-01-01'),
        DrugId: '$S{drugId}',
      };
      it('should return an inventory', function () {
        return pactum
          .spec()
          .post('/inventory')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...inventoryDto })
          .expectStatus(201)
          .expectBodyContains(inventoryDto.DrugId)
          .stores('inventoryId', 'id');
      });
    });
  });

  describe('Order', function () {
    describe('Create Order', function () {
      const orderDto: CreateOrderDto = {
        DrugId: '$S{drugId}',
        SupplierId: '$S{supplierId}',
        orderQuantity: 10,
        status: OrderStatuses.PENDING,
      };

      it('should return a ', function () {
        return pactum
          .spec()
          .post('/orders')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...orderDto })
          .expectStatus(201)
          .expectBodyContains(orderDto.DrugId)
          .stores('orderId', 'id');
      });
    });
  });

  describe('Sales Test 2', function () {
    describe('Create sale', function () {
      const saleDto: CreateSaleDto = {
        DrugId: '$S{drugId}',
        PatientId: '$S{patientId}',
        issueUnitQuantity: 10,
      };

      it('should get all inventory', function () {
        return pactum
          .spec()
          .get('/inventory')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });

      it('should return a 403 status', function () {
        return pactum
          .spec()
          .post('/sales')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...saleDto })
          .expectStatus(403);
      });

      it('should get all inventory', function () {
        return pactum
          .spec()
          .get('/inventory')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });
    });
  });

  describe('Supply', function () {
    describe('Create a supply', function () {
      const supplyDto: CreateSupplyDto = {
        OrderId: '$S{orderId}',
        packSizeQuantity: 10,
        pricePerPackSize: 100,
        totalPackSizePrice: 1000,
      };
      it('should return a new supply', function () {
        return pactum
          .spec()
          .post('/supplies')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...supplyDto })
          .expectStatus(201)
          .expectBodyContains(supplyDto.OrderId)
          .stores('supplyId', 'id');
      });
    });
  });

  describe('Sales Test 3', function () {
    describe('Create sale', function () {
      const saleDto: CreateSaleDto = {
        DrugId: '$S{drugId}',
        PatientId: '$S{patientId}',
        issueUnitQuantity: 20,
      };

      it('should return a new sale', function () {
        return pactum
          .spec()
          .post('/sales')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...saleDto })
          .stores('saleId', 'id')
          .expectStatus(201);
      });

      it('should get all inventory', function () {
        return pactum
          .spec()
          .get('/inventory')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });
    });

    describe('Get all sales', function () {
      it('should return an array of sales', function () {
        return pactum
          .spec()
          .get('/sales')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });
    });

    describe('Get a sale', function () {
      it('should return a sale', function () {
        return pactum
          .spec()
          .get('/sales/$S{saleId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });
    });

    describe('Update sale', function () {
      const saleDto: UpdateSaleDto = {
        issueUnitQuantity: 30,
        PatientId: '$S{patientId}',
        DrugId: '$S{drugId}',
      };

      it('should return a sale', function () {
        return pactum
          .spec()
          .get('/sales/$S{saleId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .inspect();
      });

      it('should get all inventory', function () {
        return pactum
          .spec()
          .get('/inventory')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .inspect();
      });

      it('should return a sale', function () {
        return pactum
          .spec()
          .patch('/sales/$S{saleId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...saleDto })
          .expectStatus(200)
          .expectBodyContains(saleDto.issueUnitQuantity)
          .inspect();
      });

      it('should get all inventory', function () {
        return pactum
          .spec()
          .get('/inventory')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .inspect();
      });
    });

    describe('Delete a sale', function () {
      it('should return status code 204', function () {
        return pactum
          .spec()
          .delete('/sales/$S{saleId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(204)
          .inspect();
      });

      it('should get all inventory', function () {
        return pactum
          .spec()
          .get('/inventory')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .inspect();
      });

      it('should return an array of sales', function () {
        return pactum
          .spec()
          .get('/sales')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .inspect();
      });

      it('should return a sale', function () {
        return pactum
          .spec()
          .get('/sales/$S{saleId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(403)
          .inspect();
      });
    });
  });
});
