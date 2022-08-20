import { Test, TestingModule } from '@nestjs/testing';
import { DrugsController } from './drugs.controller';
import { DrugsService } from './drugs.service';
import { drugProviders } from './drug.provider';

describe('DrugsController', () => {
  let controller: DrugsController;

  const mockDrugRepository = {};
  const mockDrugService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DrugsController],
      providers: [DrugsService, ...drugProviders],
    })
      .overrideProvider(DrugsService)
      .useValue(mockDrugService)
      .compile();

    controller = module.get<DrugsController>(DrugsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
