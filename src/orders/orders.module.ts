import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { orderProviders } from './orders.provider';
import { supplierProviders } from '../suppliers/suppliers.provider';
import { drugProviders } from '../drugs/drugs.provider';
import { DrugsModule } from '../drugs/drugs.module';
import { SuppliersModule } from '../suppliers/suppliers.module';

@Module({
  imports: [DrugsModule, SuppliersModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    ...orderProviders,
    ...supplierProviders,
    ...drugProviders,
  ],
})
export class OrdersModule {}
