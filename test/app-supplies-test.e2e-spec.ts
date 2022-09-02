import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { CreateSupplierDto } from '../src/suppliers/dto';
import { DoseForms } from '../src/drugs/enums';
import { CreateInventoryDto } from '../src/inventory/dto';
import { CreateDrugDto } from '../src/drugs/dto';
import { CreateOrderDto } from '../src/orders/dto';
import { OrderStatuses } from '../src/orders/enum';
import { CreateSupplyDto, UpdateSupplyDto } from '../src/supplies/dto';

describe('Supplying Orders in Pharmacy App e2e', function () {
  let suppliesApp: INestApplication;

  jest.setTimeout(20000);

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    suppliesApp = moduleRef.createNestApplication();
    suppliesApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await suppliesApp.init();
    await suppliesApp.listen(process.env.TEST_PORT);
    pactum.request.setBaseUrl(`http://localhost:${process.env.TEST_PORT}`);
  });

  afterAll(async () => {
    await suppliesApp.close();
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
          .expectBodyContains(newInventory.DrugId)
          .stores('inventoryId', 'id');
      });
    });
  });

  describe('Orders', function () {
    const supplyTestOrder: CreateOrderDto = {
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
          .withBody({ ...supplyTestOrder })
          .expectStatus(201)
          .expectBodyContains(supplyTestOrder.status)
          .stores('orderId', 'id');
      });
    });
  });

  describe('Supplies', function () {
    const newSupply: CreateSupplyDto = {
      OrderId: '$S{orderId}',
      packSizeQuantity: 10,
      pricePerPackSize: 100,
      totalPackSizePrice: 1000,
    };

    describe('Get all Orders before Supplying one', function () {
      it('should return an array of orders', function () {
        return pactum
          .spec()
          .get('/orders')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
        // .inspect();
      });
    });

    describe('Get all pending orders', function () {
      it('should return an array of pending orders', function () {
        return pactum
          .spec()
          .get('/orders?status=pending')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });
    });

    describe('Create a supply', function () {
      it('should create a supply', function () {
        return pactum
          .spec()
          .post('/supplies')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...newSupply })
          .expectStatus(201)
          .expectBodyContains(newSupply.packSizeQuantity)
          .stores('supplyId', 'id');
      });
    });

    describe('Get all delivered orders', function () {
      it('should return an array of delivered orders', function () {
        return pactum
          .spec()
          .get('/orders?status=delivered')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });
    });

    describe('Create the same order', function () {
      it('should return a 403 status', function () {
        return pactum
          .spec()
          .post('/supplies')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...newSupply })
          .expectStatus(403);
      });
    });

    describe('Delete a delivered order', function () {
      it('should return a 403 status', function () {
        return pactum
          .spec()
          .delete('/orders/$S{orderId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(403)
          .inspect();
      });
    });

    describe('Get all inventory', function () {
      it('should return all inventory', function () {
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

    describe('Update a supply', function () {
      const updatedSupply: UpdateSupplyDto = {
        packSizeQuantity: 20,
        pricePerPackSize: 200,
        totalPackSizePrice: 2000,
        OrderId: '$S{orderId}',
      };

      it('should return a 403 status', function () {
        return pactum
          .spec()
          .patch('/supplies/$S{supplyId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...updatedSupply })
          .expectStatus(403)
          .inspect();
      });

      describe('Create an order', function () {
        const supplyTestOrder: CreateOrderDto = {
          DrugId: '$S{drugId}',
          SupplierId: '$S{supplierId}',
          orderQuantity: 50,
          status: OrderStatuses.PENDING,
        };

        it('should create and return the newly created order', function () {
          return pactum
            .spec()
            .post('/orders')
            .withHeaders({
              Authorization: 'Bearer $S{accessToken}',
            })
            .withBody({ ...supplyTestOrder })
            .expectStatus(201)
            .expectBodyContains(supplyTestOrder.status)
            .stores('orderIdTwo', 'id')
            .inspect();
        });
      });

      it('should return a new supply', function () {
        updatedSupply.OrderId = '$S{orderIdTwo}';
        return pactum
          .spec()
          .post('/supplies')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...updatedSupply })
          .expectStatus(201)
          .expectBodyContains(updatedSupply.packSizeQuantity)
          .inspect();
      });

      it('should return an inventory', function () {
        return pactum
          .spec()
          .get('/inventory/$S{inventoryId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .expectBodyContains(newSupply.packSizeQuantity)
          .inspect();
      });

      it('should return an updated supply', function () {
        updatedSupply.OrderId = '$S{orderIdTwo}';
        updatedSupply.packSizeQuantity = 30;
        return pactum
          .spec()
          .post('/supplies')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ ...updatedSupply })
          .expectStatus(201)
          .expectBodyContains(updatedSupply.packSizeQuantity)
          .inspect();
      });

      it('should return an inventory', function () {
        return pactum
          .spec()
          .get('/inventory/$S{inventoryId}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .expectBodyContains(newSupply.packSizeQuantity)
          .inspect();
      });

      it('should get all orders', function () {
        return pactum
          .spec()
          .get('/orders')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .inspect();
      });

      it('should return an array of supplies', function () {
        return pactum
          .spec()
          .get('/supplies')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .inspect();
      });
    });
  });
});
