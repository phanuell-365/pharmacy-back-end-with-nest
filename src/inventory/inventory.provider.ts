import { INVENTORY_REPOSITORY } from './constants';
import { Inventory } from './entities/inventory.entity';

export const inventoryProviders = [
  {
    provide: INVENTORY_REPOSITORY,
    useValue: Inventory,
  },
];
