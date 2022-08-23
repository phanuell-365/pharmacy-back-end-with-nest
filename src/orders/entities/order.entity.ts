import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ORDER_STATUSES } from '../constants';
import { OrderStatuses } from '../enum';
import { Drug } from '../../drugs/entities';
import { Supplier } from '../../suppliers/entities';
import { Supply } from '../../supplies/entities';
import { Sale } from '../../sales/entities';

@Table({
  tableName: 'Orders',
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
    type: DataType.INTEGER,
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

  @BelongsTo(() => Drug, 'DrugId')
  drug: Drug;

  @ForeignKey(() => Supplier)
  @Column({ allowNull: false, type: DataType.UUID })
  SupplierId: string;

  @BelongsTo(() => Supplier, 'SupplierId')
  supplier: Supplier;

  @HasMany(() => Supply, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  supplies: Supply[];

  @HasMany(() => Sale, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  sales: Sale[];
}
