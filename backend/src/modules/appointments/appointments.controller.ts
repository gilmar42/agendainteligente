import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentStatus, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../auth/guards/subscription.guard';

interface UserRequest extends Request {
  user: {
    userId: string;
    email: string;
    workspaceId: string;
    role: string;
  };
}

@Controller('appointments')
@UseGuards(JwtAuthGuard, SubscriptionGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(
    @Request() req: UserRequest,
    @Body()
    createAppointmentDto: Prisma.AppointmentUncheckedCreateWithoutWorkspaceInput,
  ) {
    const { workspaceId } = req.user;
    return this.appointmentsService.create(workspaceId, createAppointmentDto);
  }

  @Get()
  findAll(@Request() req: UserRequest) {
    const { workspaceId } = req.user;
    return this.appointmentsService.findAll(workspaceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: AppointmentStatus,
  ) {
    return this.appointmentsService.updateStatus(id, status);
  }
}
