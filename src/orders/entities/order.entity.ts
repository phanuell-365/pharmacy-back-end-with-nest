import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ORDER_STATUSES } from '../constants';
import { OrderStatuses } from '../enum';
import { Drug } from '../../drugs/entities/drug.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';

@Table({
  tableName: 'Order',
  paranoid: true,
  timestamps: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class Order extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    unique: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  orderQuantity: number;

  @Column({
    type: DataType.ENUM,
    values: ORDER_STATUSES,
    defaultValue: OrderStatuses.PENDING,
    allowNull: false,
  })
  status: string;

  @ForeignKey(() => Drug)
  @Column({ allowNull: false, type: DataType.UUID })
  DrugId: string;

  @BelongsTo(() => Drug)
  drug: Drug;

  @ForeignKey(() => Supplier)
  @Column({ allowNull: false, type: DataType.UUID })
  SupplierId: string;

  @BelongsTo(() => Supplier)
  supplier: Supplier;
}
