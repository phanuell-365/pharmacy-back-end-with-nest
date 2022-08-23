import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateSupplyDto, UpdateSupplyDto } from './dto';
import { SUPPLY_REPOSITORY } from './constants';
import { Supply } from './entities';
import { ORDER_REPOSITORY } from '../orders/constants';
import { Order } from '../orders/entities';
import { INVENTORY_REPOSITORY } from '../inventory/constants';
import { Inventory } from '../inventory/entities';
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

  // utility functions

  async getOrder(orderId: string) {
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

    return order;
  }

  async getInventory(drugId: string) {
    const inventory = await this.inventoryRepository.findOne({
      where: {
        DrugId: drugId,
      },
    });

    if (!inventory) {
      throw new ForbiddenException('Inventory not found');
    }

    return inventory;
  }

  getNewOrderQuantity(pending: number, supplied: number) {
    const newOrderQuantity = pending - supplied;

    if (newOrderQuantity < 0) {
      throw new ForbiddenException(
        'Supplied quantity is greater than order quantity',
      );
    }

    return newOrderQuantity;
  }

  async updateOrderQuantity(orderId: string, newOrderQuantity: number) {
    const order = await this.getOrder(orderId);

    if (newOrderQuantity === 0) {
      await order.update({ status: OrderStatuses.DELIVERED });
    } else if (newOrderQuantity > 0) {
      await order.update({
        orderQuantity: newOrderQuantity,
        status: OrderStatuses.ACTIVE,
      });
    }

    return order;
  }

  async updateInventoryPackSizeQuantity(
    drugId: string,
    currentInventoryPackSizeQuantity: number,
    suppliedQuantity: number,
  ) {
    const newInventoryPackSizeQuantity =
      currentInventoryPackSizeQuantity + suppliedQuantity;

    const inventory = await this.getInventory(drugId);

    await inventory.update({
      packSizeQuantity: newInventoryPackSizeQuantity,
    });

    return inventory;
  }

  async updateInventoryIssueQuantity(
    drugId: string,
    currentInventoryIssueQuantity: number,
    inventoryIssueUnitPerPackSize: number,
    suppliedQuantity: number,
  ) {
    const newInventoryIssueQuantity =
      currentInventoryIssueQuantity +
      suppliedQuantity * inventoryIssueUnitPerPackSize;

    const inventory = await this.getInventory(drugId);

    await inventory.update({
      issueQuantity: newInventoryIssueQuantity,
    });

    return inventory;
  }

  async create(orderId: string, createSupplyDto: CreateSupplyDto) {
    const order = await this.getOrder(orderId);

    const inventory = await this.getInventory(order.DrugId);

    const pendingOrderQuantity = order.orderQuantity;

    const suppliedQuantity = createSupplyDto.packSizeQuantity;

    const newOrderQuantity = this.getNewOrderQuantity(
      pendingOrderQuantity,
      suppliedQuantity,
    );

    // update order quantity
    await this.updateOrderQuantity(orderId, newOrderQuantity);

    // update inventory pack size quantity
    await this.updateInventoryPackSizeQuantity(
      order.DrugId,
      inventory.packSizeQuantity,
      suppliedQuantity,
    );
    // update inventory issue quantity

    await this.updateInventoryIssueQuantity(
      order.DrugId,
      inventory.issueQuantity,
      inventory.issueUnitPerPackSize,
      suppliedQuantity,
    );

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
    // this statement will throw if the supply does not exist
    const supply = await this.findOne(supplyId);

    const order = await this.getOrder(orderId);

    const inventory = await this.getInventory(order.DrugId);

    if (updateSupplyDto.packSizeQuantity) {
      const pendingOrderQuantity = order.orderQuantity;

      const suppliedQuantity = updateSupplyDto.packSizeQuantity;

      const newOrderQuantity = this.getNewOrderQuantity(
        pendingOrderQuantity,
        suppliedQuantity,
      );

      // update order quantity
      await this.updateOrderQuantity(orderId, newOrderQuantity);

      // update inventory pack size quantity

      await this.updateInventoryPackSizeQuantity(
        order.DrugId,
        inventory.packSizeQuantity,
        suppliedQuantity,
      );

      // update inventory issue quantity

      await this.updateInventoryIssueQuantity(
        order.DrugId,
        inventory.issueQuantity,
        inventory.issueUnitPerPackSize,
        suppliedQuantity,
      );
    }

    return await supply.update(
      { ...updateSupplyDto },
      { where: { id: supplyId } },
    );
  }

  async remove(supplyId: string) {
    const supply = await this.findOne(supplyId);
    return await supply.destroy();
  }
}
