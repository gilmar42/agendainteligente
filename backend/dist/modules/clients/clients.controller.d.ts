import { ClientsService } from './clients.service';
import { Prisma } from '@prisma/client';
interface UserRequest extends Request {
    user: {
        userId: string;
        email: string;
        workspaceId: string;
        role: string;
    };
}
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(req: UserRequest, createClientDto: Prisma.ClientUncheckedCreateWithoutWorkspaceInput): Promise<{
        name: string;
        id: string;
        workspaceId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        score: number;
    }>;
    findAll(req: UserRequest): Promise<({
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
    update(id: string, updateClientDto: Prisma.ClientUpdateInput): Promise<{
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
export {};
