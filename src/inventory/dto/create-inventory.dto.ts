import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MinDate,
} from 'class-validator';
import { IssueUnits } from '../enums';
import { Transform } from 'class-transformer';

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsEnum(IssueUnits, { message: 'Invalid issue unit' })
  issueUnit: IssueUnits;

  @IsNumber()
  @IsNotEmpty()
  issueUnitPrice: number;

  @IsNumber()
  @IsNotEmpty()
  issueUnitPerPackSize: number;

  @IsNotEmpty()
  @IsString()
  packSize: string;

  @IsNumber()
  @IsNotEmpty()
  packSizePrice: number;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date())
  expirationDate: Date;

  @IsNotEmpty()
  @IsUUID()
  DrugId: string;
}
