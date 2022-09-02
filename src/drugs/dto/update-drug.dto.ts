import { PartialType } from '@nestjs/mapped-types';
import { CreateDrugDto } from './create-drug.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { DoseForms, IssueUnits } from '../enums';
import { IsValueContaining } from '../../validations';
import { DRUG_STRENGTHS } from '../constants';

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
  @IsValueContaining(DRUG_STRENGTHS, {
    message: 'Invalid drug strength',
  })
  strength?: string;

  @IsOptional()
  @IsNumber()
  levelOfUse?: number;

  @IsOptional()
  @IsString()
  therapeuticClass?: string;

  @IsOptional()
  @IsEnum(IssueUnits, { message: 'Invalid issue unit' })
  issueUnit?: IssueUnits;
}
