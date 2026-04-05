import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role, Prisma } from '@prisma/client';

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
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new ConflictException('User already exists');

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

      return this.generateToken(user);
    });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user);
  }

  private generateToken(user: Record<string, unknown>) {
    const payload = { 
      sub: user.id as string, 
      email: user.email as string, 
      workspaceId: user.workspaceId as string, 
      role: user.role as string 
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
