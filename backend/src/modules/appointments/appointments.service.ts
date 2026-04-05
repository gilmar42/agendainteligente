import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AppointmentStatus, Prisma } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('notifications') private notificationQueue: Queue,
    @InjectQueue('ai-analysis') private aiQueue: Queue,
  ) {}

  async create(
    workspaceId: string,
    data: Prisma.AppointmentUncheckedCreateWithoutWorkspaceInput,
  ) {
    const { startTime, endTime } = data;

    // Concurrency check
    const conflict = await this.prisma.appointment.findFirst({
      where: {
        workspaceId,
        startTime: { lt: new Date(startTime) },
        endTime: { gt: new Date(endTime) },
        status: { not: AppointmentStatus.CANCELLED },
      },
    });

    if (conflict) throw new ConflictException('Horário já ocupado');

    const appointment = await this.prisma.appointment.create({
      data: {
        ...data,
        workspaceId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    // Enfileirar análise de IA e notificações
    await this.aiQueue.add('analyze-risk', { appointmentId: appointment.id });
    await this.notificationQueue.add('send-confirmation', {
      appointmentId: appointment.id,
    });

    return appointment;
  }

  async findAll(workspaceId: string) {
    return this.prisma.appointment.findMany({
      where: { workspaceId },
      include: { client: true },
      orderBy: { startTime: 'asc' },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { client: true },
    });
    if (!appointment) throw new NotFoundException('Agendamento não encontrado');
    return appointment;
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }
}
