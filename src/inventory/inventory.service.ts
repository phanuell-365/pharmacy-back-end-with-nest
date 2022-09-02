import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateInventoryDto, UpdateInventoryDto } from './dto';
import { INVENTORY_REPOSITORY, ISSUE_UNITS } from './constants';
import { Inventory } from './entities/inventory.entity';
import { Drug } from '../drugs/entities/drug.entity';
import { DRUG_REPOSITORY } from '../drugs/constants';

@Injectable()
export class InventoryService {
  constructor(
    @Inject(INVENTORY_REPOSITORY)
    private readonly inventoryRepository: typeof Inventory,
    @Inject(DRUG_REPOSITORY)
    private readonly drugRepository: typeof Drug,
  ) {}

  async create(drugId, createInventoryDto: CreateInventoryDto) {
    const drug = await this.drugRepository.findByPk(drugId);

    if (!drug) {
      throw new ForbiddenException('Drug not found');
    }

    const inventory = await this.inventoryRepository.findOne({
      where: {
        DrugId: drug.id,
      },
    });

    if (inventory) {
      throw new ConflictException('Drug has an associated inventory');
    }

    return await this.inventoryRepository.create({
      ...createInventoryDto,
      DrugId: drug.id,
    });
  }

  async findAll() {
    return await this.inventoryRepository.findAll();
  }

  findIssueUnits() {
    return ISSUE_UNITS;
  }

  async findOne(id: string) {
    const inventory = await this.inventoryRepository.findByPk(id);

    if (!inventory) {
      throw new ForbiddenException('Inventory not found');
    }

    return inventory;
  }

  async update(
    drugId: string,
    inventoryId: string,
    updateInventoryDto: UpdateInventoryDto,
  ) {
    const drug = await this.drugRepository.findByPk(drugId);

    if (!drug) {
      throw new ForbiddenException('Drug not found');
    }

    const inventory = await this.inventoryRepository.findByPk(inventoryId);

    if (!inventory) {
      throw new ForbiddenException('Inventory not found');
    }

    return await inventory.update({ ...updateInventoryDto });
  }

  async remove(inventoryId: string) {
    const inventory = await this.inventoryRepository.findByPk(inventoryId);

    if (!inventory) {
      throw new ForbiddenException('Inventory not found');
    }

    // if (process.env.NODE_ENV === 'test') {
    //   return await inventory.destroy({
    //     force: true,
    //   });
    // }

    return await inventory.destroy();
  }
}
