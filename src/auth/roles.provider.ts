import { ROLE_GUARD } from './constants/role.guard';
import { RolesGuard } from './roles/guard';

export const rolesProvider = [
  {
    provide: ROLE_GUARD,
    useClass: RolesGuard,
  },
];
