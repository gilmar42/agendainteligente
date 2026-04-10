import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

export class RegisterDto {
  name!: string;
  email!: string;
  password!: string;
  workspaceName!: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const { name, email, password, workspaceName } = data;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) throw new ConflictException('Usuário já existe');

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Workspace and User in a transaction
    return this.prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: workspaceName,
          slug: workspaceName.toLowerCase().replace(/ /g, '-'),
        },
      });

      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: Role.ADMIN,
          workspaceId: workspace.id,
        },
      });

      return {
        access_token: this.jwtService.sign({
          sub: user.id,
          email: user.email,
          workspaceId: user.workspaceId,
          role: user.role,
        }),
        user: {
          ...user,
          workspaceName: workspace.name,
        },
      };
    });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { workspace: true },
    });
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciais inválidas');

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        workspaceId: user.workspaceId,
        role: user.role,
      }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        workspaceId: user.workspaceId,
        workspaceName: user.workspace.name,
        role: user.role,
      },
    };
  }

  private generateToken(user: Record<string, unknown>) {
    const payload = {
      sub: user.id as string,
      email: user.email as string,
      workspaceId: user.workspaceId as string,
      role: user.role as string,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id as string,
        name: user.name as string,
        email: user.email as string,
        workspaceId: user.workspaceId as string,
        role: user.role as string,
      },
    };
  }
}
