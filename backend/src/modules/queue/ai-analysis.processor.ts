import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AIService } from '../ai/ai.service';

@Injectable()
@Processor('ai-analysis')
export class AIAnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(AIAnalysisProcessor.name);

  constructor(
    private prisma: PrismaService,
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

    if (!appointment) {
      this.logger.error(`Appointment ${appointmentId} not found`);
      return;
    }

    if (job.name === 'analyze-risk') {
      const riskScore = await this.aiService.predictNoShowRisk(appointment);

      await this.prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          noShowRisk: riskScore,
        },
      });

      this.logger.log(
        `AI risk analysis completed for appointment ${appointmentId}: ${riskScore}`,
      );
    }
  }
}
