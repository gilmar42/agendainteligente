import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { AIService } from '../ai/ai.service';
import { MessageType, MessageStatus } from '@prisma/client';

@Injectable()
@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    private prisma: PrismaService,
    private whatsappService: WhatsappService,
    private aiService: AIService,
  ) {
    super();
  }

  async process(job: Job<{ appointmentId: string }>): Promise<void> {
    const { appointmentId } = job.data;

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { client: true, workspace: true },
    });

    if (!appointment || !appointment.client) {
      this.logger.error(`Agendamento ${appointmentId} não encontrado ou sem cliente`);
      return;
    }

    if (job.name === 'send-confirmation') {
      try {
        // Gera mensagem de confirmação com nome da clínica
        const message = await this.aiService.generateConfirmationMessage(
          'WhatsApp',
          appointment.client.name,
          appointment.startTime.toISOString(),
          appointment.workspace?.name,
        );

        await this.whatsappService.sendMessage(appointment.client.phone, message);

        await this.prisma.messageLog.create({
          data: {
            appointmentId: appointment.id,
            content: message,
            type: MessageType.CONFIRMATION,
            status: MessageStatus.SENT,
          },
        });

        this.logger.log(`✅ Confirmação enviada para ${appointment.client.name} (${appointment.client.phone})`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.error(`❌ Erro ao enviar confirmação para ${appointment.id}: ${msg}`);

        await this.prisma.messageLog.create({
          data: {
            appointmentId: appointment.id,
            content: 'Falha no envio da confirmação',
            type: MessageType.CONFIRMATION,
            status: MessageStatus.FAILED,
          },
        });
      }
    }
  }
}
