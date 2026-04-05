import { AppointmentsService } from './appointments.service';
import { AppointmentStatus, Prisma } from '@prisma/client';
interface UserRequest extends Request {
    user: {
        userId: string;
        email: string;
        workspaceId: string;
        role: string;
    };
}
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(req: UserRequest, createAppointmentDto: Prisma.AppointmentUncheckedCreateWithoutWorkspaceInput): Promise<{
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
    findAll(req: UserRequest): Promise<({
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
export {};
