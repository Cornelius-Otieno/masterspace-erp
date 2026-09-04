import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  username: true,
  role: true,
  active: true,
  mustChangePassword: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto, actorId?: string) {
    const password = await bcrypt.hash(dto.password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email.toLowerCase(),
          username: dto.username.toLowerCase(),
          password,
          role: dto.role,
          active: dto.active ?? true,
          mustChangePassword: true,
        },
        select: SAFE_SELECT,
      });
      await this.audit(actorId, 'USER_CREATED', user.id, { email: user.email, role: user.role });
      return user;
    } catch (error: any) {
      if (error.code === 'P2002') throw new ConflictException('A user with this email already exists.');
      throw error;
    }
  }

  findAll() {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      select: SAFE_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: SAFE_SELECT,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto, actorId?: string) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.email) data.email = dto.email.toLowerCase();
    if (dto.username) data.username = dto.username.toLowerCase();
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
      data.mustChangePassword = true;
    }
    try {
      const user = await this.prisma.user.update({ where: { id }, data, select: SAFE_SELECT });
      await this.audit(actorId, dto.active === false ? 'USER_DEACTIVATED' : 'USER_UPDATED', id);
      return user;
    } catch (error: any) {
      if (error.code === 'P2002') throw new ConflictException('A user with this email already exists.');
      throw error;
    }
  }

  async remove(id: string, actorId?: string) {
    if (id === actorId) throw new BadRequestException('You cannot delete your own account.');
    await this.findOne(id);
    await this.prisma.user.update({ where: { id }, data: { active: false, deletedAt: new Date() } });
    await this.audit(actorId, 'USER_SOFT_DELETED', id);
    return { success: true };
  }

  private audit(actorId: string | undefined, event: string, target?: string, metadata?: Record<string, string>) {
    return this.prisma.auditEvent.create({
      data: { actorId, userId: actorId, event, target, metadata: metadata ? JSON.stringify(metadata) : undefined },
    });
  }
}
