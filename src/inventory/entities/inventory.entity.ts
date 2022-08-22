import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ISSUE_UNITS } from '../constants';
import { Drug } from '../../drugs/entities/drug.entity';

@Table({
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class Inventory extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    unique: true,
  })
  id: string;

  @Column({
    type: DataType.ENUM,
    values: ISSUE_UNITS,
    allowNull: false,
  })
  issueUnit: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  issueUnitPrice: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  issueUnitPerPackSize: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  issueQuantity: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  packSize: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  packSizePrice: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  packSizeQuantity: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expirationDate: Date;

  @ForeignKey(() => Drug)
  @Column({ allowNull: false, type: DataType.UUID })
  DrugId: string;

  @BelongsTo(() => Drug)
  drug: Drug;
}
