import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { SALES_STATUS } from '../constants';
import { SalesStatus } from '../enums';
import { Drug } from '../../drugs/entities';
import { Patient } from '../../patients/entities';

@Table({
  tableName: 'Sales',
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class Sale extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    unique: true,
  })
  id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  issueUnitQuantity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  issueUnitPrice: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  totalPrice: number;

  @Column({
    type: DataType.ENUM,
    values: SALES_STATUS,
    defaultValue: SalesStatus.ISSUED,
  })
  status: string;

  @ForeignKey(() => Drug)
  @Column({ allowNull: false, type: DataType.UUID })
  DrugId: string;

  @BelongsTo(() => Drug, 'DrugId')
  drug: Drug;

  @ForeignKey(() => Patient)
  @Column({ allowNull: false, type: DataType.UUID })
  PatientId: string;

  @BelongsTo(() => Patient, 'PatientId')
  patient: Patient;
}
