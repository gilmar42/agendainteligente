import { WorkspacesService } from './workspaces.service';
import { Prisma } from '@prisma/client';
export declare class WorkspacesController {
    private readonly workspacesService;
    constructor(workspacesService: WorkspacesService);
    create(createWorkspaceDto: Prisma.WorkspaceCreateInput): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        plan: import("@prisma/client").$Enums.Plan;
    }>;
    findAll(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        plan: import("@prisma/client").$Enums.Plan;
    }[]>;
    findOne(id: string): Promise<{
        users: {
            name: string;
            email: string;
            password: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
            workspaceId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        clients: {
            name: string;
            id: string;
            workspaceId: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            score: number;
        }[];
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
        subscriptions: {
            id: string;
            workspaceId: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.SubscriptionStatus;
            planId: string;
            externalId: string | null;
            expiresAt: Date | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        plan: import("@prisma/client").$Enums.Plan;
    }>;
    update(id: string, updateWorkspaceDto: Prisma.WorkspaceUpdateInput): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        plan: import("@prisma/client").$Enums.Plan;
    }>;
}
