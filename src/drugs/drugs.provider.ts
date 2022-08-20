import { DRUG_REPOSITORY } from './constants';
import { Drug } from './entities/drug.entity';

export const drugProviders = [
  {
    provide: DRUG_REPOSITORY,
    useValue: Drug,
  },
];
