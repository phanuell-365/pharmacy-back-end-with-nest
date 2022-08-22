import { SUPPLY_REPOSITORY } from './constants';
import { Supply } from './entities/supply.entity';

export const supplyProviders = [
  {
    provide: SUPPLY_REPOSITORY,
    useValue: Supply,
  },
];
