import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { ClientsModule } from './modules/clients/clients.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { AIModule } from './modules/ai/ai.module';
import { QueueModule } from './modules/queue/queue.module';
import { BillingModule } from './modules/billing/billing.module';
import { DashboardController } from './modules/dashboard/dashboard.controller';
import { DashboardService } from './modules/dashboard/dashboard.service';
import { SchedulerModule } from './modules/scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    WorkspacesModule,
    ClientsModule,
    AppointmentsModule,
    WhatsappModule,
    AIModule,
    QueueModule,
    BillingModule,
    SchedulerModule,
  ],
  controllers: [AppController, DashboardController],
  providers: [AppService, DashboardService],
})
export class AppModule {}
