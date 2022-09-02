import { DoseForms } from '../enums';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DRUG_STRENGTHS } from '../constants';
import { IsValueContaining } from '../../validations';

export class CreateDrugDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(DoseForms, {
    message: 'Invalid dose form',
  })
  @IsNotEmpty()
  readonly doseForm: DoseForms;

  @IsString()
  @IsValueContaining(DRUG_STRENGTHS, {
    message: 'Invalid drug strength',
  })
  @IsNotEmpty()
  strength: string;

  @IsNotEmpty()
  @IsNumber()
  levelOfUse: number;

  @IsNotEmpty()
  @IsString()
  therapeuticClass: string;
}
