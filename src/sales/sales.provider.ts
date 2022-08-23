import { SALES_REPOSITORY } from './constants';
import { Sale } from './entities';

export const salesProviders = [
  {
    provide: SALES_REPOSITORY,
    useValue: Sale,
  },
];
