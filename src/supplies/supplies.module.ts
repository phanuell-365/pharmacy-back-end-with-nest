import { Module } from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { SuppliesController } from './supplies.controller';

@Module({
  controllers: [SuppliesController],
  providers: [SuppliesService],
})
export class SuppliesModule {}
