import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    if (!user || !user.active) {
      await this.prisma.auditEvent.create({ data: { event: 'LOGIN_FAILED', target: email } });
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      await this.prisma.auditEvent.create({ data: { userId: user.id, actorId: user.id, event: 'LOGIN_FAILED' } });
      throw new UnauthorizedException('Invalid credentials');
    }
    await this.prisma.auditEvent.create({ data: { userId: user.id, actorId: user.id, event: 'LOGIN_SUCCESS' } });
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwt.signAsync(payload);
    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { id: true, name: true, email: true, role: true, active: true, mustChangePassword: true },
    });
    if (user) await this.prisma.auditEvent.create({ data: { userId, actorId: userId, event: 'AUTH_PROFILE_ACCESSED' } });
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId, deletedAt: null } });
    if (!user || !user.active || !(await bcrypt.compare(currentPassword, user.password))) {
      await this.prisma.auditEvent.create({ data: { userId, actorId: userId, event: 'PASSWORD_CHANGE_FAILED' } });
      throw new UnauthorizedException('Current password is incorrect');
    }
    if (currentPassword === newPassword) throw new BadRequestException('Choose a different password.');
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: await bcrypt.hash(newPassword, 10), mustChangePassword: false },
    });
    await this.prisma.auditEvent.create({ data: { userId, actorId: userId, event: 'PASSWORD_CHANGED' } });
    return { success: true };
  }
}
