import { Module } from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { SuppliesController } from './supplies.controller';
import { OrdersModule } from '../orders/orders.module';
import { orderProviders } from '../orders/orders.provider';
import { supplyProviders } from './supplies.provider';
import { inventoryProviders } from '../inventory/inventory.provider';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [OrdersModule, InventoryModule],
  controllers: [SuppliesController],
  providers: [
    SuppliesService,
    ...orderProviders,
    ...supplyProviders,
    ...inventoryProviders,
  ],
})
export class SuppliesModule {}
