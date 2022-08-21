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
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';

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
  findAll() {
    return this.ordersService.findAll();
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
