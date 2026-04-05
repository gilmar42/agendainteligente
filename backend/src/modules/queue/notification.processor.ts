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

  async process(job: Job<any>): Promise<any> {
    const { appointmentId } = job.data;
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { client: true },
    });

    if (!appointment || !appointment.client) {
      this.logger.error(
        `Appointment ${appointmentId} not found or client missing`,
      );
      return;
    }

    if (job.name === 'send-confirmation') {
      const message = await this.aiService.generateConfirmationMessage(
        'WhatsApp',
        appointment.client.name,
        appointment.startTime.toISOString(),
      );

      await this.whatsappService.sendMessage(appointment.client.phone, message);

      // Log the message
      await this.prisma.messageLog.create({
        data: {
          appointmentId: appointment.id,
          content: message,
          type: MessageType.CONFIRMATION,
          status: MessageStatus.SENT,
        },
      });

      this.logger.log(`Confirmation sent for appointment ${appointmentId}`);
    }
  }
}
