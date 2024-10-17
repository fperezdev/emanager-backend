import { Test, TestingModule } from '@nestjs/testing';
import { EmRealtimeApiController } from './em-realtime-api.controller';
import { EmRealtimeApiService } from './em-realtime-api.service';

describe('EmRealtimeApiController', () => {
  let emRealtimeApiController: EmRealtimeApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EmRealtimeApiController],
      providers: [EmRealtimeApiService],
    }).compile();

    emRealtimeApiController = app.get<EmRealtimeApiController>(
      EmRealtimeApiController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(emRealtimeApiController.getHello()).toBe('Hello World!');
    });
  });
});
