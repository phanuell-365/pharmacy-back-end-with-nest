import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from './constants';
import { databaseConfig } from './database.config';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../users/entities/user.entity';
import { Drug } from '../drugs/entities/drug.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;

      switch (process.env.NODE_ENV) {
        case TEST:
          config = databaseConfig.test;
          break;
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }

      const sequelize = new Sequelize(config);
      sequelize.addModels([User, Drug]);

      switch (process.env.NODE_ENV) {
        case TEST:
          await sequelize.sync({ force: true });
          break;
        case DEVELOPMENT:
          await sequelize.sync();
          break;
        case PRODUCTION:
          await sequelize.sync();
          break;
        default:
          await sequelize.sync();
      }

      return sequelize;
    },
  },
];
