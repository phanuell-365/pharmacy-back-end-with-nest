import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { DoseForms } from '../enums';
import { DOSE_FORMS, DRUG_STRENGTHS } from '../constants';
import { Inventory } from '../../inventory/entities/inventory.entity';

@Table({
  tableName: 'Drugs',
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class Drug extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    unique: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.ENUM,
    values: DOSE_FORMS,
    allowNull: false,
  })
  doseForm: DoseForms;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isValidStrength(value) {
        if (!DRUG_STRENGTHS.some((strength) => value.includes(strength))) {
          throw new Error('Invalid strength');
        }
      },
    },
  })
  strength: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  levelOfUse: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  therapeuticClass: string;

  @HasOne(() => Inventory, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  inventory: Inventory;
}
