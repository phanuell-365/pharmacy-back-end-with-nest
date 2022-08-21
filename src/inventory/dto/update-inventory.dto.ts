import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryDto } from './create-inventory.dto';
import { IssueUnits } from '../enums';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinDate,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
  @IsOptional()
  @IsEnum(IssueUnits, { message: 'Invalid issue unit' })
  issueUnit?: IssueUnits;

  @IsOptional()
  @IsNumber()
  issueUnitPrice?: number;

  @IsOptional()
  @IsNumber()
  issueUnitPerPackSize?: number;

  @IsOptional()
  @IsString()
  packSize?: string;

  @IsOptional()
  @IsNumber()
  packSizePrice?: number;

  @IsOptional()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(new Date())
  expirationDate?: Date;

  @IsNotEmpty()
  @IsUUID()
  DrugId: string;
}
