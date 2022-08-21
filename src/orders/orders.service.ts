import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { DRUG_REPOSITORY } from '../drugs/constants';
import { Drug } from '../drugs/entities/drug.entity';
import { SUPPLIER_REPOSITORY } from '../suppliers/constants';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { ORDER_REPOSITORY } from './constants';
import { Order } from './entities/order.entity';
import { Op } from 'sequelize';
import { OrderStatuses } from './enum';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(DRUG_REPOSITORY)
    private readonly drugRepository: typeof Drug,
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: typeof Supplier,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: typeof Order,
  ) {}

  async create(
    drugId: string,
    supplierId: string,
    createOrderDto: CreateOrderDto,
  ) {
    const drug = await this.drugRepository.findByPk(drugId);

    if (!drug) {
      throw new ForbiddenException('Drug not found');
    }

    const supplier = await this.supplierRepository.findByPk(supplierId);

    if (!supplier) {
      throw new ForbiddenException('Supplier not found');
    }

    return await this.orderRepository.create({
      ...createOrderDto,
      DrugId: drugId,
      SupplierId: supplierId,
    });
  }

  async findAll() {
    return await this.orderRepository.findAll({
      where: {
        [Op.or]: [
          { status: OrderStatuses.PENDING },
          { status: OrderStatuses.ACTIVE },
          { status: OrderStatuses.DELIVERED },
        ],
      },
    });
  }

  async findOne(orderId: string) {
    const order = await this.orderRepository.findByPk(orderId);

    if (!order) {
      throw new ForbiddenException('Order not found');
    }

    if (order.status === OrderStatuses.CANCELLED) {
      throw new ForbiddenException('Order is cancelled');
    }

    return order;
  }

  // TODO: implement findActiveOrders, findPendingOrders, findDeliveredOrders and findCancelledOrders

  async update(
    drugId: string,
    supplierId: string,
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ) {
    const drug = await this.drugRepository.findByPk(drugId);

    if (!drug) {
      throw new ForbiddenException('Drug not found');
    }

    const supplier = await this.supplierRepository.findByPk(supplierId);

    if (!supplier) {
      throw new ForbiddenException('Supplier not found');
    }

    const order = await this.findOne(orderId);

    return await order.update({ ...updateOrderDto });
  }

  async remove(orderId: string) {
    const order = await this.findOne(orderId);
    return order.update({ status: OrderStatuses.CANCELLED });
  }
}
