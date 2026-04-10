import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AIAnalysisProcessor } from './ai-analysis.processor';
import { NotificationProcessor } from './notification.processor';
import { AIModule } from '../ai/ai.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: 'notifications' },
      { name: 'ai-analysis' },
    ),
    AIModule,
    WhatsappModule,
    PrismaModule,
  ],
  providers: [AIAnalysisProcessor, NotificationProcessor],
  exports: [BullModule],
})
export class QueueModule {}
