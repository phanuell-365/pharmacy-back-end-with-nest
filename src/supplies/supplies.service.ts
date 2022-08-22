import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateSupplyDto, UpdateSupplyDto } from './dto';
import { SUPPLY_REPOSITORY } from './constants';
import { Supply } from './entities/supply.entity';
import { ORDER_REPOSITORY } from '../orders/constants';
import { Order } from '../orders/entities/order.entity';
import { INVENTORY_REPOSITORY } from '../inventory/constants';
import { Inventory } from '../inventory/entities/inventory.entity';
import { OrderStatuses } from '../orders/enum';

@Injectable()
export class SuppliesService {
  constructor(
    @Inject(SUPPLY_REPOSITORY)
    private readonly supplyRepository: typeof Supply,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: typeof Order,
    @Inject(INVENTORY_REPOSITORY)
    private readonly inventoryRepository: typeof Inventory,
  ) {}

  async create(orderId, createSupplyDto: CreateSupplyDto) {
    const order = await this.orderRepository.findByPk(orderId);

    if (!order) {
      throw new ForbiddenException('Order not found');
    }

    if (order.status === OrderStatuses.CANCELLED) {
      throw new ForbiddenException('Order was cancelled');
    }

    if (order.status === OrderStatuses.DELIVERED) {
      throw new ForbiddenException('Order was delivered');
    }

    return await this.supplyRepository.create({
      ...createSupplyDto,
      OrderId: orderId,
    });
  }

  async findAll() {
    return await this.supplyRepository.findAll();
  }

  async findOne(supplyId: string) {
    const supply = await this.supplyRepository.findByPk(supplyId);

    if (!supply) {
      throw new ForbiddenException('Supply not found');
    }

    return supply;
  }

  async update(
    orderId: string,
    supplyId: string,
    updateSupplyDto: UpdateSupplyDto,
  ) {
    const order = await this.orderRepository.findByPk(orderId);

    if (!order) {
      throw new ForbiddenException('Order not found');
    }

    // this statement will throw if the supply does not exist
    await this.findOne(supplyId);

    return await this.supplyRepository.update(
      { ...updateSupplyDto },
      { where: { id: supplyId } },
    );
  }

  async remove(supplyId: string) {
    const supply = await this.findOne(supplyId);
    return await supply.destroy();
  }
}
