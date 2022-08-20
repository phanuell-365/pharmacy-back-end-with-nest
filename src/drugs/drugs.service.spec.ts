import { Test, TestingModule } from '@nestjs/testing';
import { DrugsService } from './drugs.service';
import { DRUG_REPOSITORY } from './constants';

describe('DrugsService', () => {
  let service: DrugsService;

  const mockDrugRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DrugsService,
        {
          provide: DRUG_REPOSITORY,
          useValue: mockDrugRepository,
        },
      ],
    }).compile();

    service = module.get<DrugsService>(DrugsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
