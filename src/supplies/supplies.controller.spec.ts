import { Test, TestingModule } from '@nestjs/testing';
import { SuppliesController } from './supplies.controller';
import { SuppliesService } from './supplies.service';

describe('SuppliesController', () => {
  let controller: SuppliesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliesController],
      providers: [SuppliesService],
    }).compile();

    controller = module.get<SuppliesController>(SuppliesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
