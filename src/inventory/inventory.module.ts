import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { inventoryProviders } from './inventory.provider';
import { drugProviders } from '../drugs/drugs.provider';
import { DrugsModule } from '../drugs/drugs.module';

@Module({
  imports: [DrugsModule],
  controllers: [InventoryController],
  providers: [InventoryService, ...inventoryProviders, ...drugProviders],
})
export class InventoryModule {}
