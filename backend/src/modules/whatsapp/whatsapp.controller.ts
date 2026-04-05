import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private whatsappService: WhatsappService) {}

  @Post('instance/create')
  async createInstance(@Body() data: { instanceName: string }) {
    const { instanceName } = data;
    return this.whatsappService.createInstance(instanceName);
  }

  @Post('message/send')
  async sendMessage(@Body() data: { to: string; text: string }) {
    const { to, text } = data;
    return this.whatsappService.sendMessage(to, text);
  }
}
