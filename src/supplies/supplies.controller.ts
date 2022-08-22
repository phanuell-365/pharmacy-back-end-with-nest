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
  UseGuards,
} from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { CreateSupplyDto, UpdateSupplyDto } from './dto';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('supplies')
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Post()
  create(
    @Body('OrderId') orderId: string,
    @Body() createSupplyDto: CreateSupplyDto,
  ) {
    return this.suppliesService.create(orderId, createSupplyDto);
  }

  @Get()
  findAll() {
    return this.suppliesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') supplyId: string) {
    return this.suppliesService.findOne(supplyId);
  }

  @Patch(':id')
  update(
    @Param('id') supplyId: string,
    @Body('OrderId') orderId: string,
    @Body() updateSupplyDto: UpdateSupplyDto,
  ) {
    return this.suppliesService.update(orderId, supplyId, updateSupplyDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') supplyId: string) {
    return this.suppliesService.remove(supplyId);
  }
}
