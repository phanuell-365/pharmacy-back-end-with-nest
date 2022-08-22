import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { CreateSupplierDto } from '../src/suppliers/dto';
import { DoseForms } from '../src/drugs/enums';
import { CreateInventoryDto } from '../src/inventory/dto';
import { IssueUnits } from '../src/inventory/enums';
import { CreateDrugDto } from '../src/drugs/dto';
import { CreateOrderDto } from '../src/orders/dto';
import { OrderStatuses } from '../src/orders/enum';
import { CreateSupplyDto } from '../src/supplies/dto';

describe('Supplying Orders in Pharmacy App e2e', function () {
  let suppliesApp: INestApplication;

  jest.setTimeout(15000);

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    suppliesApp = moduleRef.createNestApplication();
    suppliesApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await suppliesApp.init();
    await suppliesApp.listen(process.env.PORT);
    pactum.request.setBaseUrl(`http://localhost:${process.env.PORT}`);
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
        issueUnit: IssueUnits.TABS,
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
            .expectBodyContains(newInventory.issueUnit)
            .stores('inventoryId', 'id');
        });
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
          .stores('supplyId', 'id')
          .inspect();
      });
    });
  });
});
