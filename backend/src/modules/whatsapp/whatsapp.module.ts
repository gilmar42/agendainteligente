import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { HttpModule } from '@nestjs/axios';

import { AIModule } from '../ai/ai.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [HttpModule, AIModule, PrismaModule],
  providers: [WhatsappService],
  controllers: [WhatsappController],
  exports: [WhatsappService],
})
export class WhatsappModule {}
