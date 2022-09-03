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
  UseGuards,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto, UpdateSaleDto } from './dto';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(
    @Body('DrugId') drugId: string,
    @Body('PatientId') patientId: string,
    @Body() createSaleDto: CreateSaleDto,
  ) {
    return this.salesService.create(drugId, patientId, createSaleDto);
  }

  @Get()
  findAll(@Query('resource') resource: string) {
    if (resource && resource === 'status') {
      return this.salesService.findSalesStatus();
    }
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') salesId: string) {
    return this.salesService.findOne(salesId);
  }

  @Patch(':id')
  update(
    @Param('id') salesId: string,
    @Body('DrugId') drugId: string,
    @Body('PatientId') patientId: string,
    @Body() updateSaleDto: UpdateSaleDto,
  ) {
    return this.salesService.update(drugId, patientId, salesId, updateSaleDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') salesId: string) {
    return this.salesService.remove(salesId);
  }
}
