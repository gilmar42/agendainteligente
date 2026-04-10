import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { AIModule } from '../ai/ai.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    WhatsappModule,
    AIModule,
    PrismaModule,
    QueueModule,
  ],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
