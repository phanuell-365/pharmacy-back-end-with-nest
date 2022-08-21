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
import { InventoryService } from './inventory.service';
import { CreateInventoryDto, UpdateInventoryDto } from './dto';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(
    @Body('DrugId') drugId: string,
    @Body() createInventoryDto: CreateInventoryDto,
  ) {
    return this.inventoryService.create(drugId, createInventoryDto);
  }

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') inventoryId: string) {
    return this.inventoryService.findOne(inventoryId);
  }

  @Patch(':id')
  update(
    @Param('id') inventoryId: string,
    @Body('DrugId') drugId: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(
      drugId,
      inventoryId,
      updateInventoryDto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') inventoryId: string) {
    return this.inventoryService.remove(inventoryId);
  }
}
