import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from './constants';
import { databaseConfig } from './database.config';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../users/entities';
import { Drug } from '../drugs/entities';
import { Supplier } from '../suppliers/entities';
import { Patient } from '../patients/entities';
import { Inventory } from '../inventory/entities';
import { Order } from '../orders/entities';
import { Supply } from '../supplies/entities';
import { InternalServerErrorException } from '@nestjs/common';
import { Sale } from '../sales/entities';

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
      sequelize.addModels([
        User,
        Drug,
        Supplier,
        Patient,
        Inventory,
        Order,
        Supply,
        Sale,
      ]);

      try {
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
      } catch (error) {
        console.error(error.message);
        throw new InternalServerErrorException('Error while syncing database');
      }

      return sequelize;
    },
  },
];
