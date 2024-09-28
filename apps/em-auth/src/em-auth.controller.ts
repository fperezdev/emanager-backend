import { Controller, Get } from '@nestjs/common';
import { EmAuthService } from './em-auth.service';

@Controller()
export class EmAuthController {
  constructor(private readonly emAuthService: EmAuthService) {}

  @Get()
  getHello(): string {
    return this.emAuthService.getHello();
  }
}
