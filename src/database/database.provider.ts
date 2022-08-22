import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from './constants';
import { databaseConfig } from './database.config';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../users/entities/user.entity';
import { Drug } from '../drugs/entities/drug.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Order } from '../orders/entities/order.entity';
import { Supply } from '../supplies/entities/supply.entity';
import { InternalServerErrorException } from '@nestjs/common';

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
