import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(workspaceId: string) {
    const total = await this.prisma.appointment.count({
      where: { workspaceId },
    });

    const confirmed = await this.prisma.appointment.count({
      where: { workspaceId, status: AppointmentStatus.CONFIRMED },
    });

    const cancelled = await this.prisma.appointment.count({
      where: { workspaceId, status: AppointmentStatus.CANCELLED },
    });

    // Mock "No-Shows Evitados" count for now
    const avoided = Math.floor(confirmed * 0.15); 

    return {
      total,
      confirmed,
      cancelled,
      avoided,
    };
  }
}
