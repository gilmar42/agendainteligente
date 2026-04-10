import { Controller, Post, Get, Body, UseGuards, Query } from '@nestjs/common';
import { WhatsappService, QRCodeResponse } from './whatsapp.service';
import type { WebhookData } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private whatsappService: WhatsappService) {}

  @UseGuards(JwtAuthGuard)
  @Get('status')
  async getStatus() {
    return { state: await this.whatsappService.getConnectionStatus() };
  }

  @UseGuards(JwtAuthGuard)
  @Get('qrcode')
  async getQRCode(@Query('number') number?: string): Promise<QRCodeResponse> {
    return this.whatsappService.getQRCode(number);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    return this.whatsappService.logout();
  }

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

  @Post('webhook')
  async handleWebhook(@Body() data: WebhookData): Promise<void> {
    return this.whatsappService.handleWebhook(data);
  }
}
