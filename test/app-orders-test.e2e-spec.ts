import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { CreateSupplierDto } from '../src/suppliers/dto';
import { DoseForms } from '../src/drugs/enums';
import { CreateDrugDto } from '../src/drugs/dto';
import { CreateInventoryDto } from '../src/inventory/dto';
import { CreateOrderDto, UpdateOrderDto } from '../src/orders/dto';
import { OrderStatuses } from '../src/orders/enum';
import { AuthDto } from '../src/auth/dto';

describe('Order placing Pharmacy App e2e', function () {
  let orderApp: INestApplication;

  jest.setTimeout(15000);
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    orderApp = moduleRef.createNestApplication();
    orderApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await orderApp.init();
    await orderApp.listen(process.env.TEST_PORT);
    pactum.request.setBaseUrl(`http://localhost:${process.env.TEST_PORT}`);
  });

  afterAll(async () => {
    await orderApp.close();
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

  describe('Suppliers', function () {
    const newSupplier: CreateSupplierDto = {
      name: 'Beta Healthcare',
      phone: '0712345678',
      email: 'betahealthcare@info.com',
    };

    describe('Create Supplier', function () {
      it('should create a new supplier', function () {
        return pactum
          .spec()
          .post('/suppliers')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...newSupplier })
          .expectStatus(201)
          .expectBodyContains(newSupplier.name)
          .stores('supplierId', 'id');
      });
    });
  });

  describe('Drugs', function () {
    const newDrug: CreateDrugDto = {
      name: 'Aspirin',
      doseForm: DoseForms.CAPSULE,
      strength: '250mg',
      levelOfUse: 5,
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
  });

  describe('Inventory', function () {
    const newInventory: CreateInventoryDto = {
      issueUnitPrice: 10,
      issueUnitPerPackSize: 200,
      packSize: 'Box',
      packSizePrice: 100,
      expirationDate: new Date('2023-01-01'),
      DrugId: '$S{drugId}',
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
  });

  describe('Orders', function () {
    const newOrder: CreateOrderDto = {
      DrugId: '$S{drugId}',
      SupplierId: '$S{supplierId}',
      orderQuantity: 10,
      status: OrderStatuses.PENDING,
    };

    describe('Create an order', function () {
      it('should create and return the newly created order', function () {
        return pactum
          .spec()
          .post('/orders')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...newOrder })
          .expectStatus(201)
          .expectBodyContains(newOrder.status)
          .stores('orderId', 'id');
      });
    });

    describe('Get all Orders', function () {
      it('should return all orders', function () {
        return pactum
          .spec()
          .get('/orders')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .expectBodyContains(newOrder.status);
      });
    });

    describe('Get an order', function () {
      it('should return an order', function () {
        return pactum
          .spec()
          .get('/orders/$S{orderId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .expectBodyContains(newOrder.status);
      });
    });

    describe('Update an order', function () {
      const updatedOrder: UpdateOrderDto = {
        orderQuantity: 20,
        status: OrderStatuses.ACTIVE,
        DrugId: '$S{drugId}',
        SupplierId: '$S{supplierId}',
      };
      it('should update an order', function () {
        return pactum
          .spec()
          .patch('/orders/$S{orderId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...updatedOrder })
          .expectStatus(200)
          .expectBodyContains(updatedOrder.status);
      });
    });

    describe('Delete an order', function () {
      it('should set the order status to cancelled', function () {
        return pactum
          .spec()
          .delete('/orders/$S{orderId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(204)
          .inspect();
      });

      it('should get all orders after cancellation', function () {
        return pactum
          .spec()
          .get('/orders')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .inspect();
      });
    });
  });
});
