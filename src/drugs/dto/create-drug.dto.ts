import { DoseForms } from '../enums';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DRUG_STRENGTHS } from '../constants';
import { IsValueContaining } from '../../validations';

export class CreateDrugDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(DoseForms, {
    message: 'Invalid dose form',
  })
  readonly doseForm: DoseForms;

  @IsNotEmpty()
  @IsValueContaining(DRUG_STRENGTHS, {
    message: 'Invalid strength',
  })
  strength: string;

  @IsNotEmpty()
  @IsNumber()
  levelOfUse: number;

  @IsNotEmpty()
  @IsString()
  therapeuticClass: string;
}
