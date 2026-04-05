import { PrismaService } from '../../prisma/prisma.service';
import { Queue } from 'bullmq';
import { AppointmentStatus, Prisma } from '@prisma/client';
export declare class AppointmentsService {
    private prisma;
    private notificationQueue;
    private aiQueue;
    constructor(prisma: PrismaService, notificationQueue: Queue, aiQueue: Queue);
    create(workspaceId: string, data: Prisma.AppointmentUncheckedCreateWithoutWorkspaceInput): Promise<{
        id: string;
        workspaceId: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        endTime: Date;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        noShowRisk: number;
        clientId: string;
    }>;
    findAll(workspaceId: string): Promise<({
        client: {
            name: string;
            id: string;
            workspaceId: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            score: number;
        };
    } & {
        id: string;
        workspaceId: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        endTime: Date;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        noShowRisk: number;
        clientId: string;
    })[]>;
    findOne(id: string): Promise<{
        client: {
            name: string;
            id: string;
            workspaceId: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            score: number;
        };
    } & {
        id: string;
        workspaceId: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        endTime: Date;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        noShowRisk: number;
        clientId: string;
    }>;
    updateStatus(id: string, status: AppointmentStatus): Promise<{
        id: string;
        workspaceId: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        endTime: Date;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        noShowRisk: number;
        clientId: string;
    }>;
}
