import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplyDto } from './create-supply.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateSupplyDto extends PartialType(CreateSupplyDto) {
  @IsOptional()
  @IsNumber()
  packSizeQuantity?: number;

  @IsOptional()
  @IsNumber()
  pricePerPackSize?: number;

  @IsOptional()
  @IsNumber()
  totalPackSizePrice?: number;

  @IsNotEmpty()
  @IsUUID()
  OrderId: string;
}
