import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Prisma } from '@prisma/client';

interface UserRequest extends Request {
  user: {
    userId: string;
    email: string;
    workspaceId: string;
    role: string;
  };
}

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(
    @Request() req: UserRequest,
    @Body() createClientDto: Prisma.ClientUncheckedCreateWithoutWorkspaceInput,
  ) {
    const { workspaceId } = req.user;
    return this.clientsService.create(workspaceId, createClientDto);
  }

  @Get()
  findAll(@Request() req: UserRequest) {
    const { workspaceId } = req.user;
    return this.clientsService.findAll(workspaceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClientDto: Prisma.ClientUpdateInput,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
