import { PartialType } from '@nestjs/mapped-types';
import { CreateDrugDto } from './create-drug.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { DoseForms } from '../enums';

export class UpdateDrugDto extends PartialType(CreateDrugDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(DoseForms, {
    message: 'Invalid dose form',
  })
  doseForm?: DoseForms;

  @IsOptional()
  @IsString()
  strength?: string;

  @IsOptional()
  @IsNumber()
  levelOfUse?: number;

  @IsOptional()
  @IsString()
  therapeuticClass?: string;
}
