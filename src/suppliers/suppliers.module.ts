import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { supplierProviders } from './suppliers.provider';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService, ...supplierProviders],
})
export class SuppliersModule {}
