import { OrderStatuses } from '../enum';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  orderQuantity: number;

  @IsOptional()
  @IsEnum(OrderStatuses, {
    message: 'Status is not valid',
  })
  status: OrderStatuses;

  @IsNotEmpty()
  @IsUUID()
  DrugId: string;

  @IsNotEmpty()
  @IsUUID()
  SupplierId: string;
}
