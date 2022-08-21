import { Supplier } from './entities/supplier.entity';
import { SUPPLIER_REPOSITORY } from './constants';

export const supplierProviders = [
  {
    provide: SUPPLIER_REPOSITORY,
    useValue: Supplier,
  },
];
