import {
  ForbiddenException,
  Inject,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { DRUG_REPOSITORY } from '../drugs/constants';
import { Drug } from '../drugs/entities';
import { SUPPLIER_REPOSITORY } from '../suppliers/constants';
import { Supplier } from '../suppliers/entities';
import { ORDER_REPOSITORY, ORDER_STATUSES } from './constants';
import { Order } from './entities';
import { Op } from 'sequelize';
import { OrderStatuses } from './enum';
import { INVENTORY_REPOSITORY } from '../inventory/constants';
import { Inventory } from '../inventory/entities';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(DRUG_REPOSITORY)
    private readonly drugRepository: typeof Drug,
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: typeof Supplier,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: typeof Order,
    @Inject(INVENTORY_REPOSITORY)
    private readonly inventoryRepository: typeof Inventory,
  ) {}

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

  async checkIfInventoryIssueQuantityPriceIsValid(drugId: string) {
    const inventory = await this.getInventory(drugId);

    if (inventory.issueUnitPrice < 0)
      throw new PreconditionFailedException(
        "The drug's issue unit price is invalid!",
      );
  }

  async checkIfInventoryIssueUnitPackSizeIsValid(drugId: string) {
    const inventory = await this.getInventory(drugId);

    if (inventory.issueUnitPerPackSize < 0)
      throw new PreconditionFailedException(
        "The drug's issue unit per pack size is invalid!",
      );
  }

  async checkIfInventoryPackSizePriceIsValid(drugId: string) {
    const inventory = await this.getInventory(drugId);

    if (inventory.packSizePrice < 0)
      throw new PreconditionFailedException(
        "The drug's pack size price invalid!",
      );
  }

  async create(
    drugId: string,
    supplierId: string,
    createOrderDto: CreateOrderDto,
  ) {
    const drug = await this.drugRepository.findByPk(drugId);

    if (!drug) {
      throw new ForbiddenException('Drug not found');
    }

    await this.checkIfInventoryIssueQuantityPriceIsValid(drugId);
    await this.checkIfInventoryPackSizePriceIsValid(drugId);
    await this.checkIfInventoryIssueUnitPackSizeIsValid(drugId);

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

  findOrderStatus() {
    return ORDER_STATUSES;
  }

  async findActiveOrders() {
    return await this.orderRepository.findAll({
      where: {
        status: OrderStatuses.ACTIVE,
      },
    });
  }

  async findPendingOrders() {
    return await this.orderRepository.findAll({
      where: {
        status: OrderStatuses.PENDING,
      },
    });
  }

  async findDeliveredOrders() {
    return await this.orderRepository.findAll({
      where: {
        status: OrderStatuses.DELIVERED,
      },
    });
  }

  async findCancelledOrders() {
    return await this.orderRepository.findAll({
      where: {
        status: OrderStatuses.CANCELLED,
      },
    });
  }

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

    if (order.status === OrderStatuses.CANCELLED) {
      throw new ForbiddenException('Order is already cancelled');
    } else if (order.status === OrderStatuses.DELIVERED) {
      throw new ForbiddenException('Order is already delivered');
    }
    return order.update({ status: OrderStatuses.CANCELLED });
  }
}
