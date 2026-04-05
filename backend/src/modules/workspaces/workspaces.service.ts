import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.WorkspaceCreateInput) {
    return this.prisma.workspace.create({ data });
  }

  async findOne(id: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: {
        users: true,
        clients: true,
        appointments: true,
        subscriptions: true,
      },
    });
    if (!workspace) throw new NotFoundException('Workspace not found');
    return workspace;
  }

  async update(id: string, data: Prisma.WorkspaceUpdateInput) {
    return this.prisma.workspace.update({
      where: { id },
      data,
    });
  }

  async findAll() {
    return this.prisma.workspace.findMany();
  }
}
