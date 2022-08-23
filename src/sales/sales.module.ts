import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { patientProviders } from '../patients/patients.provider';
import { PatientsModule } from '../patients/patients.module';
import { salesProviders } from './sales.provider';
import { inventoryProviders } from '../inventory/inventory.provider';
import { InventoryModule } from '../inventory/inventory.module';
import { drugProviders } from '../drugs/drugs.provider';
import { DrugsModule } from '../drugs/drugs.module';

@Module({
  imports: [PatientsModule, InventoryModule, DrugsModule],
  controllers: [SalesController],
  providers: [
    SalesService,
    ...patientProviders,
    ...salesProviders,
    ...inventoryProviders,
    ...drugProviders,
  ],
})
export class SalesModule {}
