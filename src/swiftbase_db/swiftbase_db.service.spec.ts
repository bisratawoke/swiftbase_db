import { Test, TestingModule } from '@nestjs/testing';
import { SwiftbaseDbService } from './swiftbase_db.service';

describe('SwiftbaseDbService', () => {
  let service: SwiftbaseDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SwiftbaseDbService],
    }).compile();

    service = module.get<SwiftbaseDbService>(SwiftbaseDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
