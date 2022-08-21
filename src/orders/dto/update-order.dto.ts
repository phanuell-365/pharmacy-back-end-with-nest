import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatuses } from '../enum';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsNumber()
  orderQuantity?: number;

  @IsOptional()
  @IsEnum(OrderStatuses, {
    message: 'Status is not valid',
  })
  status?: OrderStatuses;

  @IsNotEmpty()
  @IsUUID()
  DrugId: string;

  @IsNotEmpty()
  @IsUUID()
  SupplierId: string;
}
