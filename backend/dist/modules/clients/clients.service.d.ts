import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class ClientsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(workspaceId: string, data: Prisma.ClientUncheckedCreateWithoutWorkspaceInput): Promise<{
        name: string;
        id: string;
        workspaceId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        score: number;
    }>;
    findAll(workspaceId: string): Promise<({
        appointments: {
            id: string;
            workspaceId: string;
            createdAt: Date;
            updatedAt: Date;
            startTime: Date;
            endTime: Date;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            noShowRisk: number;
            clientId: string;
        }[];
    } & {
        name: string;
        id: string;
        workspaceId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        score: number;
    })[]>;
    findOne(id: string): Promise<{
        appointments: {
            id: string;
            workspaceId: string;
            createdAt: Date;
            updatedAt: Date;
            startTime: Date;
            endTime: Date;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            noShowRisk: number;
            clientId: string;
        }[];
    } & {
        name: string;
        id: string;
        workspaceId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        score: number;
    }>;
    update(id: string, data: Prisma.ClientUpdateInput): Promise<{
        name: string;
        id: string;
        workspaceId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        score: number;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        workspaceId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        score: number;
    }>;
}
