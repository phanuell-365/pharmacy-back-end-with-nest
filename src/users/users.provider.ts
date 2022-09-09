import { USER_REPOSITORY } from './constants';
import { User } from './entities';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
