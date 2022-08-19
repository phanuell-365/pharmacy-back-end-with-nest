import { Inject, Injectable } from '@nestjs/common';
import { CreateDrugDto, UpdateDrugDto } from './dto';
import { DRUG_REPOSITORY } from './constants';
import { Drug } from './entities/drug.entity';

@Injectable()
export class DrugsService {
  constructor(
    @Inject(DRUG_REPOSITORY) private readonly drugRepository: typeof Drug,
  ) {}

  async create(createDrugDto: CreateDrugDto): Promise<Drug> {
    return await this.drugRepository.create({ ...createDrugDto });
  }

  async findAll(): Promise<Drug[]> {
    return await this.drugRepository.findAll();
  }

  async findOne(id: string): Promise<Drug> {
    return await this.drugRepository.findByPk(id);
  }

  async update(
    id: string,
    updateDrugDto: UpdateDrugDto,
  ): Promise<[affectedCount: number]> {
    return await this.drugRepository.update(
      { ...updateDrugDto },
      { where: { id } },
    );
  }

  async remove(id: string) {
    return await this.drugRepository.destroy({ where: { id } });
  }
}
