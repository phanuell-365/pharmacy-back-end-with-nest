import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateSupplierDto, UpdateSupplierDto } from './dto';
import { SUPPLIER_REPOSITORY } from './constants';
import { Supplier } from './entities/supplier.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: typeof Supplier,
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {
    const supplier = await this.supplierRepository.findOne({
      where: {
        name: createSupplierDto.name,
      },
    });

    if (supplier) {
      throw new ForbiddenException('Supplier already exists');
    }

    return await this.supplierRepository.create({ ...createSupplierDto });
  }

  async findAll() {
    return await this.supplierRepository.findAll();
  }

  async findOne(id: string) {
    const supplier = await this.supplierRepository.findByPk(id);

    if (!supplier) {
      throw new ForbiddenException('Supplier not found');
    }

    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.supplierRepository.findByPk(id);

    if (!supplier) {
      throw new ForbiddenException('Supplier not found');
    }

    return await supplier.update({ ...updateSupplierDto });
  }

  async remove(id: string) {
    const supplier = await this.supplierRepository.findByPk(id);

    if (!supplier) {
      throw new ForbiddenException('Supplier not found');
    }

    return await supplier.destroy();
  }
}
