import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateDrugDto, UpdateDrugDto } from './dto';
import { DOSE_FORMS, DRUG_REPOSITORY, DRUG_STRENGTHS } from './constants';
import { Drug } from './entities';

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
    const drug = await this.drugRepository.findByPk(id);

    if (!drug) {
      throw new ForbiddenException('Drug not found');
    }

    return drug;
  }

  findDrugStrengths() {
    return DRUG_STRENGTHS;
  }

  findDrugDoseForms() {
    return DOSE_FORMS;
  }

  async update(id: string, updateDrugDto: UpdateDrugDto): Promise<Drug> {
    const drug = await this.drugRepository.findByPk(id);

    if (!drug) {
      throw new ForbiddenException('Drug not found');
    }

    return await drug.update({ ...updateDrugDto });
  }

  async remove(id: string) {
    const drug = await this.drugRepository.findByPk(id);

    if (!drug) {
      throw new ForbiddenException('Drug not found');
    }

    // if (process.env.NODE_ENV === 'test') {
    //   return await drug.destroy({
    //     force: true,
    //   });
    // }

    return await drug.destroy();
  }
}
