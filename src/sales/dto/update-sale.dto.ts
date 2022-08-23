import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleDto } from './create-sale.dto';
import { SalesStatus } from '../enums';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @IsOptional()
  @IsNumber()
  issueUnitQuantity?: number;

  @IsOptional()
  @IsEnum(SalesStatus, {
    message: 'Invalid status',
  })
  status?: SalesStatus;

  @IsNotEmpty()
  @IsUUID()
  DrugId: string;

  @IsNotEmpty()
  @IsUUID()
  PatientId: string;
}
