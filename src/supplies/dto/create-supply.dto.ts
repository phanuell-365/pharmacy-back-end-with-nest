import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateSupplyDto {
  @IsNotEmpty()
  @IsNumber()
  packSizeQuantity: number;

  @IsNotEmpty()
  @IsNumber()
  pricePerPackSize: number;

  @IsNotEmpty()
  @IsNumber()
  totalPackSizePrice: number;

  @IsNotEmpty()
  @IsUUID()
  OrderId: string;
}
