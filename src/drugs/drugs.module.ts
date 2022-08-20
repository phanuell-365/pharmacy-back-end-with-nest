import { Module } from '@nestjs/common';
import { DrugsService } from './drugs.service';
import { DrugsController } from './drugs.controller';
import { drugProviders } from './drugs.provider';

@Module({
  controllers: [DrugsController],
  providers: [DrugsService, ...drugProviders],
  exports: [DrugsService],
})
export class DrugsModule {}
