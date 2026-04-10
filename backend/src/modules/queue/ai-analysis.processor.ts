import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AIService } from '../ai/ai.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
@Processor('ai-analysis')
export class AIAnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(AIAnalysisProcessor.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
    private whatsappService: WhatsappService,
  ) {
    super();
  }

  async process(job: Job<{ appointmentId: string }>): Promise<void> {
    const rawData = job.data as unknown;
    if (
      !rawData ||
      typeof rawData !== 'object' ||
      !('appointmentId' in rawData)
    ) {
      this.logger.error(
        `Dados do trabalho inválidos para o job ${job.id as string}`,
      );
      return;
    }

    const data = rawData as { appointmentId: string };
    const { appointmentId } = data;
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { client: true },
    });

    if (!appointment) {
      this.logger.error(`Agendamento ${appointmentId} não encontrado`);
      return;
    }

    if (job.name === 'analyze-risk') {
      const score: number = await this.aiService.predictNoShowRisk(appointment);

      await this.prisma.appointment.update({
        where: { id: appointmentId },
        data: { noShowRisk: score },
      });

      // Lógica do Agente de No-Show: Agir se o risco for alto
      if (score > 0.7 && appointment.client) {
        const clientName = appointment.client.name;
        const message = `Olá ${clientName}, notamos que sua consulta está próxima. Gostaríamos de confirmar sua presença para garantir sua vaga. Podemos confirmar?`;

        await this.whatsappService.sendMessage(
          appointment.client.phone,
          message,
        );

        this.logger.log(
          `Alerta de No-Show enviado para agendamento ${appointmentId} (Risco: ${score})`,
        );
      }

      this.logger.log(
        `Análise de risco concluída para o agendamento ${appointmentId}: ${score}`,
      );
    }
  }
}
