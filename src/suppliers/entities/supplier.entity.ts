import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Order } from '../../orders/entities/order.entity';

@Table({
  tableName: 'Supplier',
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class Supplier extends Model {
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
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone: string;

  @HasMany(() => Order, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  orders: Order[];
}
