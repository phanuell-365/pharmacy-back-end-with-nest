import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreatePatientDto, UpdatePatientDto } from './dto';
import { PATIENT_REPOSITORY } from './constants';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: typeof Patient,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    const patient = await this.patientRepository.findOne({
      where: {
        name: createPatientDto.name,
      },
    });

    if (patient) {
      throw new ForbiddenException('Patient already exists');
    }

    return await this.patientRepository.create({ ...createPatientDto });
  }

  async findAll() {
    return await this.patientRepository.findAll();
  }

  async findOne(id: string) {
    const patient = await this.patientRepository.findByPk(id);

    if (!patient) {
      throw new ForbiddenException('Patient not found');
    }

    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const patient = await this.patientRepository.findByPk(id);

    if (!patient) {
      throw new ForbiddenException('Patient not found');
    }

    return await patient.update({ ...updatePatientDto });
  }

  async remove(id: string) {
    const patient = await this.patientRepository.findByPk(id);

    if (!patient) {
      throw new ForbiddenException('Patient not found');
    }

    return await patient.destroy();
  }
}
