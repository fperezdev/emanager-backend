import { Test, TestingModule } from '@nestjs/testing';
import { EmAuthController } from './em-auth.controller';
import { EmAuthService } from './em-auth.service';

describe('EmAuthController', () => {
  let emAuthController: EmAuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EmAuthController],
      providers: [EmAuthService],
    }).compile();

    emAuthController = app.get<EmAuthController>(EmAuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(emAuthController.getHello()).toBe('Hello World!');
    });
  });
});
