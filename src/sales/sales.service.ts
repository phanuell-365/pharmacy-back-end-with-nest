import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateSaleDto, UpdateSaleDto } from './dto';
import { PATIENT_REPOSITORY } from '../patients/constants';
import { Patient } from '../patients/entities';
import { SALES_REPOSITORY, SALES_STATUS } from './constants';
import { Sale } from './entities';
import { INVENTORY_REPOSITORY } from '../inventory/constants';
import { Inventory } from '../inventory/entities';
import { SalesStatus } from './enums';
import { DRUG_REPOSITORY } from '../drugs/constants';
import { Drug } from '../drugs/entities';
import { Op } from 'sequelize';

@Injectable()
export class SalesService {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: typeof Patient,
    @Inject(SALES_REPOSITORY) private readonly saleRepository: typeof Sale,
    @Inject(INVENTORY_REPOSITORY)
    private readonly inventoryRepository: typeof Inventory,
    @Inject(DRUG_REPOSITORY) private readonly drugRepository: typeof Drug,
  ) {}

  async getPatient(patientId: string) {
    const patient = await this.patientRepository.findByPk(patientId);

    if (!patient) {
      throw new ForbiddenException('Patient not found');
    }

    return patient;
  }

  async getDrug(drugId: string) {
    const drug = await this.drugRepository.findByPk(drugId);

    if (!drug) {
      throw new ForbiddenException('Drug not found');
    }

    return drug;
  }

  async getInventory(drugId: string) {
    const inventory = await this.inventoryRepository.findOne({
      where: {
        DrugId: drugId,
      },
    });

    if (!inventory) {
      throw new ForbiddenException('Inventory not found');
    }

    return inventory;
  }

  async getSale(salesId: string) {
    const sale = await this.saleRepository.findByPk(salesId);

    if (!sale) {
      throw new ForbiddenException('Sale not found');
    } else if (sale.status === SalesStatus.CANCELLED) {
      throw new ForbiddenException('Sale is cancelled');
    }

    return sale;
  }

  async updateInventory(drugId: string, newInventoryIssueQuantity: number) {
    const inventory = await this.getInventory(drugId);

    // if (inventory.issueQuantity < newInventoryIssueQuantity) {
    //   throw new ForbiddenException('Inventory is insufficient');
    // } else if (inventory.issueQuantity === newInventoryIssueQuantity) {
    //   throw new ForbiddenException('Inventory is equal to new quantity');
    // }

    if (newInventoryIssueQuantity < 0) {
      throw new ForbiddenException('Inventory is insufficient');
    } else if (newInventoryIssueQuantity === 0) {
      throw new ForbiddenException('Inventory is equal to new quantity');
    }

    return await inventory.update({
      issueQuantity: newInventoryIssueQuantity,
    });
  }

  async create(
    drugId: string,
    patientId: string,
    createSaleDto: CreateSaleDto,
  ) {
    await this.getPatient(patientId);

    await this.getDrug(drugId);

    const inventory = await this.getInventory(drugId);

    // update inventory
    const newInventoryIssueQuantity =
      inventory.issueQuantity - createSaleDto.issueUnitQuantity;

    await this.updateInventory(drugId, newInventoryIssueQuantity);

    // get the drug price
    const drugPrice = inventory.issueUnitPrice;

    // calculate the total price
    const totalPrice = drugPrice * createSaleDto.issueUnitQuantity;

    // create the sale
    return await this.saleRepository.create({
      ...createSaleDto,
      issueUnitPrice: drugPrice,
      totalPrice,
      status: SalesStatus.ISSUED,
    });
  }

  async findAll() {
    return await this.saleRepository.findAll({
      where: {
        [Op.or]: [
          { status: SalesStatus.ISSUED },
          { status: SalesStatus.PENDING },
        ],
      },
    });
  }

  findSalesStatus() {
    return SALES_STATUS;
  }

  async findOne(salesId: string) {
    return await this.getSale(salesId);
  }

  async update(
    drugId: string,
    patientId: string,
    salesId: string,
    updateSaleDto: UpdateSaleDto,
  ) {
    await this.getPatient(patientId);

    await this.getDrug(drugId);

    const inventory = await this.getInventory(drugId);

    const sale = await this.getSale(salesId);

    // update inventory
    const newInventoryIssueQuantity =
      inventory.issueQuantity +
      sale.issueUnitQuantity -
      updateSaleDto.issueUnitQuantity;

    await this.updateInventory(drugId, newInventoryIssueQuantity);

    // get the drug price
    const drugPrice = inventory.issueUnitPrice;

    // calculate the total price
    const totalPrice = drugPrice * updateSaleDto.issueUnitQuantity;

    // update the sale
    return await sale.update({
      ...updateSaleDto,
      issueUnitPrice: drugPrice,
      totalPrice,
      status: SalesStatus.ISSUED,
    });
  }

  async remove(salesId: string) {
    const sale = await this.getSale(salesId);

    const inventory = await this.getInventory(sale.DrugId);

    const newInventoryIssueQuantity =
      inventory.issueQuantity + sale.issueUnitQuantity;

    await this.updateInventory(sale.DrugId, newInventoryIssueQuantity);

    // change the sales status to cancelled
    return await sale.update({
      status: SalesStatus.CANCELLED,
    });
  }
}
