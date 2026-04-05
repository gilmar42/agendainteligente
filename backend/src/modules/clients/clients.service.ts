import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(
    workspaceId: string,
    data: Prisma.ClientUncheckedCreateWithoutWorkspaceInput,
  ) {
    return this.prisma.client.create({
      data: { ...data, workspaceId },
    });
  }

  async findAll(workspaceId: string) {
    return this.prisma.client.findMany({
      where: { workspaceId },
      include: { appointments: true },
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: { appointments: true },
    });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async update(id: string, data: Prisma.ClientUpdateInput) {
    return this.prisma.client.update({
      where: { id },
      data: { ...data },
    });
  }

  async remove(id: string) {
    return this.prisma.client.delete({ where: { id } });
  }
}
