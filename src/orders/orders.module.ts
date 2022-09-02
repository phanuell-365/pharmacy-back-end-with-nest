import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { orderProviders } from './orders.provider';
import { supplierProviders } from '../suppliers/suppliers.provider';
import { drugProviders } from '../drugs/drugs.provider';
import { DrugsModule } from '../drugs/drugs.module';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { InventoryModule } from '../inventory/inventory.module';
import { inventoryProviders } from '../inventory/inventory.provider';

@Module({
  imports: [DrugsModule, SuppliersModule, InventoryModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    ...orderProviders,
    ...supplierProviders,
    ...drugProviders,
    ...inventoryProviders,
  ],
})
export class OrdersModule {}
