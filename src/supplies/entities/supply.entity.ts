import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Order } from '../../orders/entities/order.entity';

@Table({
  tableName: 'Supplies',
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class Supply extends Model {
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
  packSizeQuantity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  pricePerPackSize: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  totalPackSizePrice: number;

  @ForeignKey(() => Order)
  @Column({ allowNull: false, type: DataType.UUID })
  OrderId: string;

  @BelongsTo(() => Order, 'OrderId')
  order: Order;
}
