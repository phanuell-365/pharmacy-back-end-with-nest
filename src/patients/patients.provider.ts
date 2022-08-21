import { PATIENT_REPOSITORY } from './constants';
import { Patient } from './entities/patient.entity';

export const patientProviders = [
  {
    provide: PATIENT_REPOSITORY,
    useValue: Patient,
  },
];
