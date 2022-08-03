import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { OrderStatuses } from './enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Body('DrugId') drugId: string,
    @Body('SupplierId') supplierId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(drugId, supplierId, createOrderDto);
  }

  @Get()
  findAll(
    @Query('status') status: string,
    @Query('resource') resource: string,
  ) {
    if (status === OrderStatuses.PENDING) {
      return this.ordersService.findPendingOrders();
    } else if (status === OrderStatuses.DELIVERED) {
      return this.ordersService.findDeliveredOrders();
    } else if (status === OrderStatuses.CANCELLED) {
      return this.ordersService.findCancelledOrders();
    } else if (status === OrderStatuses.ACTIVE) {
      return this.ordersService.findActiveOrders();
    } else if (resource && resource === 'status') {
      return this.ordersService.findOrderStatus();
    } else {
      return this.ordersService.findAll();
    }
  }

  @Get(':id')
  findOne(@Param('id') orderId: string) {
    return this.ordersService.findOne(orderId);
  }

  @Patch(':id')
  update(
    @Param('id') orderId: string,
    @Body('DrugId') drugId: string,
    @Body('SupplierId') supplierId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(
      drugId,
      supplierId,
      orderId,
      updateOrderDto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') orderId: string) {
    return this.ordersService.remove(orderId);
  }
}
