import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateDrugDto, UpdateDrugDto } from './dto';
import { DOSE_FORMS, DRUG_REPOSITORY, DRUG_STRENGTHS } from './constants';
import { Drug } from './entities';

@Injectable()
export class DrugsService {
  constructor(
    @Inject(DRUG_REPOSITORY) private readonly drugRepository: typeof Drug,
  ) {}

  async create(createDrugDto: CreateDrugDto): Promise<Drug> {
    if (
      (await this.drugRepository.findOne({
        where: {
          ...createDrugDto,
        },
      })) ||
      (await this.drugRepository.findOne({
        where: {
          name: createDrugDto.name,
          doseForm: createDrugDto.doseForm,
          strength: createDrugDto.strength,
        },
      }))
    ) {
      throw new ConflictException('Drug already exists!');
    }

    try {
      return await this.drugRepository.create({ ...createDrugDto });
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
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

    let existingDrug: Drug;

    if (
      updateDrugDto.name &&
      updateDrugDto.doseForm &&
      updateDrugDto.strength
    ) {
      existingDrug = await this.drugRepository.findOne({
        where: {
          name: updateDrugDto.name,
          doseForm: updateDrugDto.doseForm,
          strength: updateDrugDto.strength,
        },
      });
    }

    if (updateDrugDto.name) {
      const someDrug = await this.drugRepository.findByPk(id);

      existingDrug = await this.drugRepository.findOne({
        where: {
          name: updateDrugDto.name,
        },
      });

      if (someDrug.id !== existingDrug.id) {
        throw new ConflictException(
          'Drug with given credentials already exists!',
        );
      }
    }

    if (updateDrugDto.name) {
      const someDrug = await this.drugRepository.findByPk(id);

      existingDrug = await this.drugRepository.findOne({
        where: {
          name: updateDrugDto.name,
          doseForm: someDrug.doseForm,
          strength: someDrug.strength,
        },
      });
    }

    if (updateDrugDto.doseForm) {
      const someDrug = await this.drugRepository.findByPk(id);

      existingDrug = await this.drugRepository.findOne({
        where: {
          name: someDrug.name,
          doseForm: updateDrugDto.doseForm,
          strength: someDrug.strength,
        },
      });
    }

    if (updateDrugDto.strength) {
      const someDrug = await this.drugRepository.findByPk(id);

      existingDrug = await this.drugRepository.findOne({
        where: {
          name: someDrug.name,
          doseForm: someDrug.doseForm,
          strength: updateDrugDto.strength,
        },
      });
    }

    if (existingDrug && existingDrug.id !== id) {
      throw new ConflictException(
        'Drug with given credentials already exists!',
      );
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
