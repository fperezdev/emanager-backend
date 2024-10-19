import { Test, TestingModule } from '@nestjs/testing';
import { EmRealtimeApiGateway } from './em-realtime-api.gateway';

describe('EmRealtimeApiGateway', () => {
  let gateway: EmRealtimeApiGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmRealtimeApiGateway],
    }).compile();

    gateway = module.get<EmRealtimeApiGateway>(EmRealtimeApiGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
