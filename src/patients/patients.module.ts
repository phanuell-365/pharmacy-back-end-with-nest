import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { patientProviders } from './patients.provider';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService, ...patientProviders],
})
export class PatientsModule {}
