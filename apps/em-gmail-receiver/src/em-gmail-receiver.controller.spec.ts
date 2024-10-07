import { Test, TestingModule } from '@nestjs/testing';
import { EmGmailReceiverController } from './em-gmail-receiver.controller';
import { EmGmailReceiverService } from './em-gmail-receiver.service';

describe('EmGmailReceiverController', () => {
  let emGmailReceiverController: EmGmailReceiverController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EmGmailReceiverController],
      providers: [EmGmailReceiverService],
    }).compile();

    emGmailReceiverController = app.get<EmGmailReceiverController>(
      EmGmailReceiverController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(emGmailReceiverController.getHello()).toBe('Hello World!');
    });
  });
});
