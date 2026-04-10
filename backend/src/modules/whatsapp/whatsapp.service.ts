import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service';
import { AIService } from '../ai/ai.service';
import { AppointmentStatus } from '@prisma/client';

interface EvolutionResponse {
  data?: unknown;
  message?: string;
}

export interface QRCodeResponse {
  code?: string;
  base64?: string;
  pairingCode?: string;
  count?: number;
}

export interface WebhookData {
  event: string;
  data: {
    key: {
      remoteJid: string;
      fromMe: boolean;
      id: string;
    };
    message?: {
      conversation?: string;
      extendedTextMessage?: {
        text: string;
      };
    };
  };
}

@Injectable()
export class WhatsappService implements OnModuleInit {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly apiUrl: string;
  private readonly apiToken: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private aiService: AIService,
  ) {
    this.apiUrl = this.configService.get<string>('EVOLUTION_API_URL') || '';
    this.apiToken = this.configService.get<string>('EVOLUTION_API_TOKEN') || '';
  }

  async onModuleInit() {
    try {
      this.logger.log('Sincronizando com Evolution API...');
      const instances = await axios.get<any>(
        `${this.apiUrl}/instance/fetchInstances`,
        { headers: { apikey: this.apiToken } }
      );
      
      const exists = instances.data.find(
        (i: any) =>
          i.instanceName === 'agenda-flow' ||
          i.instance?.instanceName === 'agenda-flow',
      );
      
      if (!exists) {
        this.logger.log('Instância "agenda-flow" não encontrada. Criando...');
        await this.createInstance('agenda-flow');
        this.logger.log('✅ Instância "agenda-flow" criada com sucesso.');
      } else {
        this.logger.log(`✅ Instância "agenda-flow" já existe (status: ${exists.connectionStatus ?? 'desconhecido'}).`);
      }
    } catch (error) {
      this.logger.error('Falha ao sincronizar com Evolution API no startup.');
    }
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
        this.logger.error(
          `Erro ao enviar mensagem de WhatsApp: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async getConnectionStatus(): Promise<string> {
    try {
      const response = await axios.get<any>(
        `${this.apiUrl}/instance/connectionState/agenda-flow`,
        { headers: { apikey: this.apiToken } },
      );
      return response.data.instance.state;
    } catch (error) {
      this.logger.error('Erro ao buscar status da conexão');
      return 'DISCONNECTED';
    }
  }

  async getQRCode(phoneNumber?: string): Promise<QRCodeResponse> {
    try {
      const url = phoneNumber 
        ? `${this.apiUrl}/instance/connect/agenda-flow?number=${phoneNumber}`
        : `${this.apiUrl}/instance/connect/agenda-flow`;
        
      const response = await axios.get<QRCodeResponse>(
        url,
        { headers: { apikey: this.apiToken } },
      );
      return response.data;
    } catch (error) {
      this.logger.error('Erro ao buscar QR Code ou Código de Pareamento');
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await axios.delete(
        `${this.apiUrl}/instance/logout/agenda-flow`,
        { headers: { apikey: this.apiToken } },
      );
    } catch (error) {
      this.logger.error('Erro ao realizar logout do WhatsApp');
    }
  }

  async handleWebhook(data: WebhookData): Promise<void> {
    const event = data.event;
    if (event !== 'messages.upsert') return;

    const messageData = data.data;
    const remoteJid = messageData.key.remoteJid;
    const fromMe = messageData.key.fromMe;
    const messageContent =
      messageData.message?.conversation ||
      messageData.message?.extendedTextMessage?.text;

    if (fromMe || !messageContent) return;

    const phone = remoteJid.split('@')[0];
    this.logger.log(`Mensagem recebida de ${phone}: ${messageContent}`);

    const appointment = await this.prisma.appointment.findFirst({
      where: {
        client: { phone: { contains: phone } },
        status: AppointmentStatus.PENDING,
      },
      orderBy: { createdAt: 'desc' },
      include: { client: true },
    });

    if (!appointment) {
      this.logger.warn(
        `Nenhum agendamento pendente encontrado para o telefone ${phone}`,
      );
      return;
    }

    const aiResponse = await this.aiService.processConversation(
      appointment.id,
      messageContent,
    );

    await this.sendMessage(phone, aiResponse);
  }

  async createInstance(instanceName: string): Promise<unknown> {
    try {
      const response = await axios.post<EvolutionResponse>(
        `${this.apiUrl}/instance/create`,
        { 
          instanceName, 
          token: this.apiToken, 
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS'
        },
        { headers: { apikey: this.apiToken } },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(`Erro ao criar instância: ${error.message} - ${JSON.stringify(error.response?.data)}`);
      }
      throw error;
    }
  }
}
