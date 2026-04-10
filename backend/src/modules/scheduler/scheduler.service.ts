import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { AIService } from '../ai/ai.service';
import { AppointmentStatus } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private prisma: PrismaService,
    private whatsapp: WhatsappService,
    private ai: AIService,
    private configService: ConfigService,
    @InjectQueue('notifications') private notificationQueue: Queue,
  ) {}

  // ── Configura o webhook na Evolution API ao iniciar ──────────
  async onModuleInit() {
    await this.registerEvolutionWebhook();
  }

  private async registerEvolutionWebhook() {
    const apiUrl   = this.configService.get<string>('EVOLUTION_API_URL', 'http://localhost:8080');
    const apiToken = this.configService.get<string>('EVOLUTION_API_TOKEN', '');
    const backendUrl = this.configService.get<string>('BACKEND_URL', 'http://localhost:3001');

    try {
      const { default: axios } = await import('axios');

      await axios.post(
        `${apiUrl}/webhook/set/agenda-flow`,
        {
          webhook: {
            enabled: true,
            url: `${backendUrl}/whatsapp/webhook`,
            webhookByEvents: false,
            webhookBase64: false,
            events: ['MESSAGES_UPSERT'],
          },
        },
        { headers: { apikey: apiToken } },
      );

      this.logger.log(`✅ Webhook da Evolution API configurado → ${backendUrl}/whatsapp/webhook`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`⚠️  Falha ao configurar webhook (tentará na próxima reinicialização): ${msg}`);
    }
  }

  // ─────────────────────────────────────────────────────────────
  //  CRON 1 — Lembrete 24h antes (TODO DIA ÀS 08:00)
  // ─────────────────────────────────────────────────────────────
  @Cron('0 8 * * *', { name: 'reminder-24h', timeZone: 'America/Sao_Paulo' })
  async send24hReminder() {
    this.logger.log('⏰ Cron: Enviando lembretes de 24h...');

    const now = new Date();
    const windowStart = new Date(now);
    windowStart.setDate(windowStart.getDate() + 1);
    windowStart.setHours(0, 0, 0, 0);

    const windowEnd = new Date(windowStart);
    windowEnd.setHours(23, 59, 59, 999);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        startTime: { gte: windowStart, lte: windowEnd },
        status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
      },
      include: { client: true, workspace: true },
    });

    this.logger.log(`📋 ${appointments.length} agendamentos amanhã. Enviando lembretes...`);

    for (const apt of appointments) {
      try {
        const message = await this.ai.generateConfirmationMessage(
          'WhatsApp',
          apt.client.name,
          apt.startTime.toISOString(),
          apt.workspace?.name,
        );

        await this.whatsapp.sendMessage(apt.client.phone, message);

        await this.prisma.messageLog.create({
          data: {
            appointmentId: apt.id,
            content: message,
            type: 'REMINDER',
            status: 'SENT',
          },
        });

        this.logger.log(`📩 Lembrete 24h enviado → ${apt.client.name} (${apt.client.phone})`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.error(`❌ Falha ao enviar lembrete 24h para ${apt.client.name}: ${msg}`);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────
  //  CRON 2 — Lembrete URGENTE 2h antes (A CADA HORA)
  // ─────────────────────────────────────────────────────────────
  @Cron(CronExpression.EVERY_HOUR, { name: 'reminder-2h', timeZone: 'America/Sao_Paulo' })
  async send2hReminder() {
    const now = new Date();
    const windowStart = new Date(now.getTime() + 110 * 60 * 1000); // 1h50 à frente
    const windowEnd   = new Date(now.getTime() + 130 * 60 * 1000); // 2h10 à frente

    const appointments = await this.prisma.appointment.findMany({
      where: {
        startTime: { gte: windowStart, lte: windowEnd },
        status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
      },
      include: { client: true, workspace: true },
    });

    if (appointments.length === 0) return;

    this.logger.log(`⚡ Cron 2h: ${appointments.length} consulta(s) se aproximando. Enviando alertas...`);

    for (const apt of appointments) {
      try {
        const firstName = apt.client.name.split(' ')[0];
        const horario = new Date(apt.startTime).toLocaleString('pt-BR', {
          hour: '2-digit', minute: '2-digit',
        });
        const message = `⏰ ${firstName}, sua consulta está em aproximadamente *2 horas* (${horario})! Lembre-se de comparecer. Até logo! 🙂`;

        await this.whatsapp.sendMessage(apt.client.phone, message);

        await this.prisma.messageLog.create({
          data: {
            appointmentId: apt.id,
            content: message,
            type: 'REMINDER',
            status: 'SENT',
          },
        });

        this.logger.log(`🔔 Lembrete 2h enviado → ${apt.client.name}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.error(`❌ Falha no lembrete 2h para ${apt.client.name}: ${msg}`);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────
  //  CRON 3 — Marcar NO_SHOW automaticamente (A CADA 30 MIN)
  // ─────────────────────────────────────────────────────────────
  @Cron('*/30 * * * *', { name: 'auto-no-show', timeZone: 'America/Sao_Paulo' })
  async markNoShows() {
    const threshold = new Date(Date.now() - 30 * 60 * 1000); // 30 min atrás

    const result = await this.prisma.appointment.updateMany({
      where: {
        startTime: { lte: threshold },
        status: AppointmentStatus.PENDING,   // só os não confirmados
      },
      data: { status: AppointmentStatus.NO_SHOW },
    });

    if (result.count > 0) {
      this.logger.warn(`🚨 ${result.count} agendamento(s) marcado(s) como NO_SHOW automaticamente.`);

      // Atualiza score dos clientes com no-show
      const noShows = await this.prisma.appointment.findMany({
        where: {
          startTime: { lte: threshold },
          status: AppointmentStatus.NO_SHOW,
          updatedAt: { gte: new Date(Date.now() - 2 * 60 * 1000) }, // atualizados agora
        },
        include: { client: true },
      });

      for (const apt of noShows) {
        const newScore = Math.max(0, (apt.client.score ?? 100) - 10);
        await this.prisma.client.update({
          where: { id: apt.client.id },
          data: { score: newScore },
        });
        this.logger.log(`📉 Score do cliente ${apt.client.name} atualizado: ${apt.client.score} → ${newScore}`);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────
  //  CRON 4 — Marcar COMPLETED após 1h do horário (A CADA HORA)
  // ─────────────────────────────────────────────────────────────
  @Cron(CronExpression.EVERY_HOUR, { name: 'auto-complete', timeZone: 'America/Sao_Paulo' })
  async markCompleted() {
    const threshold = new Date(Date.now() - 60 * 60 * 1000); // 1h atrás

    const result = await this.prisma.appointment.updateMany({
      where: {
        endTime: { lte: threshold },
        status: AppointmentStatus.CONFIRMED,
      },
      data: { status: AppointmentStatus.COMPLETED },
    });

    if (result.count > 0) {
      this.logger.log(`✅ ${result.count} agendamento(s) marcado(s) como COMPLETED.`);

      // Bônus de score para clientes que compareceram
      const completed = await this.prisma.appointment.findMany({
        where: {
          endTime: { lte: threshold },
          status: AppointmentStatus.COMPLETED,
          updatedAt: { gte: new Date(Date.now() - 2 * 60 * 1000) },
        },
        include: { client: true },
      });

      for (const apt of completed) {
        const newScore = Math.min(100, (apt.client.score ?? 100) + 5);
        await this.prisma.client.update({
          where: { id: apt.client.id },
          data: { score: newScore },
        });
      }
    }
  }
}
