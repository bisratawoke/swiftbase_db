import { Test, TestingModule } from '@nestjs/testing';
import { SwiftbaseDbController } from './swiftbase_db.controller';

describe('SwiftbaseDbController', () => {
  let controller: SwiftbaseDbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwiftbaseDbController],
    }).compile();

    controller = module.get<SwiftbaseDbController>(SwiftbaseDbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
