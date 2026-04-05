import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface EvolutionResponse {
  data?: unknown;
  message?: string;
}

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly apiUrl: string;
  private readonly apiToken: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('EVOLUTION_API_URL') || '';
    this.apiToken = this.configService.get<string>('EVOLUTION_API_TOKEN') || '';
  }

  async sendMessage(number: string, message: string): Promise<unknown> {
    try {
      const response = await axios.post<EvolutionResponse>(
        `${this.apiUrl}/message/sendText/agenda-flow`,
        {
          number,
          options: { delay: 1200, presence: 'composing' },
          textMessage: { text: message },
        },
        { headers: { apikey: this.apiToken } },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(`Error sending WhatsApp message: ${error.message}`);
      }
      throw error;
    }
  }

  async createInstance(instanceName: string): Promise<unknown> {
    try {
      const response = await axios.post<EvolutionResponse>(
        `${this.apiUrl}/instance/create`,
        { instanceName, token: this.apiToken, qrcode: true },
        { headers: { apikey: this.apiToken } },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(`Error creating instance: ${error.message}`);
      }
      throw error;
    }
  }
}
